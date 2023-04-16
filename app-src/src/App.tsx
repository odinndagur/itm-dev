//@ts-nocheck
import { useState, useEffect, FormEvent } from 'react'
import SignPage from './Components/SignPage'
import { AllSignsPage } from './Components/AllSignsPage'
import Home from './Components/Home'
import { query, getSignById } from './db'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ReactLocation, Router } from '@tanstack/react-location'
import PlaceholderScreen from './Components/PlaceholderScreen'

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { AppNavBar } from './Components/AppNavBar'

const reactLocation = new ReactLocation()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            networkMode: 'offlineFirst',
        },
    },
})

function App() {
    const [promiseWorkerLoaded, setPromiseWorkerLoaded] = useState(false)
    useEffect(() => {
        const intervalID = setInterval(() => {
            console.log('callback yo')
            try {
                query('select * from sign limit 5').then((res: any) => {
                    if (res[0]) {
                        clearInterval(intervalID)
                        setPromiseWorkerLoaded(true)
                        console.log('promise worker loaded')
                    }
                })
            } catch (error) {
                console.error(error)
            }
        }, 500)
    }, [])

    if (!promiseWorkerLoaded) {
        return <PlaceholderScreen />
    }
    return (
        <QueryClientProvider client={queryClient}>
            {/* <Router basename={import.meta.env.BASE_URL}>
                <Routes>
                    <Route exact path={''} element={<AllSignsPage />}></Route>
                    <Route exact path={`/signs`} element={<AllSignsPage />} />
                    <Route exact path={`/signs/:id`} element={<SignPage />} />
                    <Route render={() => <div>404 Not Found</div>} />
                </Routes>
            </Router> */}
            <Router
                location={reactLocation}
                basepath="itm-dev"
                routes={[
                    {
                        path: '/',
                        element: <AllSignsPage />,
                    },
                    {
                        path: 'signs',
                        children: [
                            {
                                path: '/',
                                element: <AllSignsPage />,
                            },
                            {
                                path: ':id',
                                element: <SignPage />,
                                loader: async ({ params }) => ({
                                    sign: await getSignById(params.id),
                                }),
                            },
                        ],
                    },
                ]}
            />
        </QueryClientProvider>
    )
}

export default App
