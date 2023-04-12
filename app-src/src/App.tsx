//@ts-nocheck
import { useState, useEffect, FormEvent } from 'react'
import SignPage from './Components/SignPage'
import { AllSignsPage } from './Components/AllSignsPage'
import Efnisflokkar from './Components/Efnisflokkar'
import Efnisflokkur from './Components/Efnisflokkur'
import Myndunarstadir from './Components/Myndunarstadir'
import Myndunarstadur from './Components/Myndunarstadur'
import Handform from './Components/Handform'
import Handforms from './Components/Handforms'
import Leit from './Components/Leit'
import Home from './Components/Home'
import { query } from './db'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Collections from './Components/Collections'
import CollectionPage from './Components/CollectionPage'
import PlaceholderScreen from './Components/PlaceholderScreen'
import Ordflokkar from './Components/Ordflokkar'
import Ordflokkur from './Components/Ordflokkur'

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
            <Router basename={import.meta.env.BASE_URL}>
                <Routes>
                    <Route exact path={''} element={<Home />}></Route>
                    <Route exact path={`/signs`} element={<AllSignsPage />} />
                    <Route exact path={`/signs/:id`} element={<SignPage />} />
                    <Route
                        exact
                        path={`/efnisflokkar`}
                        element={<Efnisflokkar />}
                    />
                    <Route
                        exact
                        path={`/efnisflokkar/:efnisflokkur`}
                        element={<Efnisflokkur />}
                    />
                    <Route
                        exact
                        path={`/ordflokkar`}
                        element={<Ordflokkar />}
                    />
                    <Route
                        exact
                        path={`/ordflokkar/:ordflokkur`}
                        element={<Ordflokkur />}
                    />
                    <Route
                        exact
                        path={`/myndunarstadir`}
                        element={<Myndunarstadir />}
                    />
                    <Route
                        exact
                        path={`/myndunarstadir/:myndunarstadur`}
                        element={<Myndunarstadur />}
                    />
                    <Route exact path={`/handform`} element={<Handforms />} />
                    <Route
                        exact
                        path={`/handform/:handform`}
                        element={<Handform />}
                    />
                    <Route exact path={`/leit`} element={<Leit />} />
                    <Route
                        exact
                        path={`/collections/`}
                        element={<Collections />}
                    />
                    <Route
                        exact
                        path={`/collections/:collectionId`}
                        element={<CollectionPage />}
                    />
                    <Route render={() => <div>404 Not Found</div>} />
                </Routes>
            </Router>
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}

export default App
