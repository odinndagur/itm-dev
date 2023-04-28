//@ts-nocheck
import { useState, useEffect, FormEvent } from 'react'
import SignPage from './Components/SignPage'
import { AllSignsPage } from './Components/AllSignsPage'
import Home from './Components/Home'
import {
    query,
    getSignById,
    getSignByPhrase,
    getSignByIdJson,
    searchPagedCollectionById,
    getUserById,
    getRandomSign,
} from './db'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import {
    ReactLocation,
    Router,
    useMatch,
    useSearch,
    Link,
    Outlet,
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
import { Handform } from './Components/Handform'
import { SettingsPage } from './Components/SettingsPage'
import { DarkModeSwitch } from './Components/DarkModeSwitch'
import { NotFound } from './Components/NotFound'
import SignWikiCredits from './Components/SignWikiCredits'
import { CollectionsPage } from './Components/CollectionsPage'

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
            <Router
                location={reactLocation}
                basepath="itm-dev"
                // defaultLinkPreloadMaxAge={Infinity}
                // defaultPendingElement={<PlaceholderScreen />}
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
                        }),
                    },
                    { path: 'handforms', element: <Handform /> },
                    {
                        path: 'random',
                        element: <SignPage />,
                        loader: async () => ({
                            sign: await getSignByIdJson(await getRandomSign()),
                        }),
                    },
                    {
                        path: 'signs',
                        children: [
                            {
                                path: '/',
                                element: <AllSignsPage />,
                            },
                            {
                                path: 'phrase',
                                children: [
                                    {
                                        path: ':phrase',
                                        element: <SignPage />,
                                        loader: async ({ params }) => ({
                                            sign: await getSignByPhrase(
                                                decodeURIComponent(
                                                    params.phrase
                                                )
                                            ),
                                        }),
                                    },
                                ],
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
                        path: 'settings',
                        element: <SettingsPage />,
                        loader: async () => ({
                            user: await getUserById(3),
                        }),
                    },
                    {
                        path: 'collections',
                        element: <CollectionsPage />,
                        loader: async () => ({
                            user: await getUserById(3),
                        }),
                    },
                    {
                        path: 'leit',
                        element: <PlaceholderScreen />,
                    },
                    {
                        // Passing no route is equivalent to passing `path: '*'`
                        element: <NotFound />,
                    },
                ]}
            >
                <Outlet />
                <AppNavBar type="mobile" />
                <div
                    className="dark-mode-switch-container"
                    style={{
                        position: 'fixed',
                        top: 'env(safe-area-inset-top)',
                        right: '0',
                        padding: '1rem',
                        zIndex: 999,
                    }}
                >
                    <DarkModeSwitch />
                </div>
            </Router>
            <SignWikiCredits />
        </QueryClientProvider>
    )
}

export default App
