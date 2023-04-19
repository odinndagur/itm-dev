//@ts-nocheck
import { useState, useEffect, FormEvent } from 'react'
import SignPage from './Components/SignPage'
import { AllSignsPage } from './Components/AllSignsPage'
import Home from './Components/Home'
import { query, getSignById, getSignByPhrase, getSignByIdJson, searchPagedCollectionById } from './db'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import {
    ReactLocation,
    Router,
    useMatch,
    useSearch,
} from '@tanstack/react-location'
import PlaceholderScreen from './Components/PlaceholderScreen'

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { AppNavBar } from './Components/AppNavBar'
import { Place } from '@mui/icons-material'

const reactLocation = new ReactLocation()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            networkMode: 'offlineFirst',
        },
    },
})

const TestaSignById = () => {
    const { test } = useSearch()
    return (
        <div>
            <h1>{test}</h1>
        </div>
    )
}
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
                // defaultLinkPreloadMaxAge={Infinity}
                defaultPendingElement={<PlaceholderScreen />}
                // defaultLoaderMaxAge={Infinity}
                routes={[
                    {
                        path: '/',
                        element: <AllSignsPage />,
                        loader: async ({ search }) => ({
                            signs: await searchPagedCollectionById({
                                searchValue: search.query ?? '',
                                collectionId: search.collection ?? 1,
                                page: search.page ?? 1,
                            }),
                        })
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
                                    sign: await getSignByIdJson(params.id),
                                }),
                            },
                        ],
                    },
                    {
                        path: 'sign',
                        id: 'signByPhrase',
                        element: <SignPage />,
                        search: (search) => {
                            return 'phrase' in search
                        },
                        loader: async ({ search }) => ({
                            sign: await getSignByPhrase(search.phrase),
                        }),
                    },
                    {
                        path: 'sign',
                        id: 'signById',
                        element: <SignPage />,
                        search: (search) => {
                            return 'id' in search
                        },
                        loader: async ({ search }) => ({
                            sign: await getSignByIdJson(search.id),
                        }),
                    },
                    {
                        path: 'sign',
                        id: 'signByTest',
                        element: <TestaSignById />,
                        search: (search) => {
                            return 'test' in search
                        },
                        // loader: async ({ search }) => ({
                        //     sign: await getSignById(search.id),
                        // }),
                    },
                    {
                        // Passing no route is equivalent to passing `path: '*'`
                        element: `This would render as the fallback when '/' or '/about' were not matched`,
                      },
                ]}
            />
        </QueryClientProvider>
    )
}

export default App
