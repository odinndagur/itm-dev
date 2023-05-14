//@ts-nocheck
import { useState, useEffect, FormEvent } from 'react'
import { ThemeContext } from './Components/ThemeContext'
import SignPage from './Components/SignPage'
import { AllSignsPage } from './Components/AllSignsPage'
import HomePage from './Components/Home'
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
    Navigate,
} from '@tanstack/react-location'
import { ReactLocationDevtools } from '@tanstack/react-location-devtools'

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
import { RandomSign } from './Components/RandomSign'
import { SignCollectionPage } from './Components/SignCollectionPage'
import { HeadlessUITest } from './Components/HeadlessUITest'

const reactLocation = new ReactLocation()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 1000 * 60 * 5,
            networkMode: 'offlineFirst',
        },
    },
})

function App() {
    const [promiseWorkerLoaded, setPromiseWorkerLoaded] = useState(false)
    const [currentTheme, setCurrentTheme] = useState(
        window.localStorage.getItem('theme_mode') ?? 'light'
    )
    const [user, setUser] = useState(3)
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
        return
        return <PlaceholderScreen />
    }
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={currentTheme}>
                <Router
                    location={reactLocation}
                    basepath="itm-dev"
                    // defaultLinkPreloadMaxAge={Infinity}
                    // defaultPendingElement={<PlaceholderScreen />}
                    // defaultLoaderMaxAge={Infinity}
                    routes={[
                        {
                            path: '/',
                            element: (
                                <Navigate
                                    to={'/collection'}
                                    search={{ id: 1 }}
                                />
                            ),
                            // loader: async ({ search }) => ({
                            //     signs: await searchPagedCollectionById({
                            //         searchValue: search.query ?? '',
                            //         collectionId: search.collection ?? 1,
                            //         page: search.page ?? 1,
                            //     }),
                            // }),
                        },
                        {
                            path: 'home',
                            element: <HomePage />,
                        },
                        {
                            path: 'collection',
                            children: [
                                {
                                    //search: (search) => 'id' in search,
                                    element: <SignCollectionPage />,

                                    loader: async ({ search }) => ({
                                        signCollection:
                                            await searchPagedCollectionById({
                                                collectionId: search.id ?? 1,
                                                page: search.page ?? 1,
                                                searchValue: search.query ?? '',
                                            }),
                                        user: await getUserById(3),
                                    }),
                                    loaderMaxAge: 0,
                                },
                            ],
                            // element: <HomePage />,
                            // loader: async ({ search }) => ({
                            //     signs: await searchPagedCollectionById({
                            //         searchValue: search.query ?? '',
                            //         collectionId: search.collection ?? 1,
                            //         page: search.page ?? 1,
                            //     }),
                            // }),
                        },
                        { path: 'handforms', element: <Handform /> },
                        {
                            path: 'random',
                            element: <RandomSign />,
                            loader: async () => ({
                                sign: await getSignByIdJson(
                                    await getRandomSign()
                                ),
                            }),
                        },
                        {
                            path: 'signs',
                            children: [
                                {
                                    path: '/',
                                    element: <AllSignsPage />,
                                    loader: async ({ search }) => ({
                                        signs: await searchPagedCollectionById({
                                            searchValue: search.query ?? '',
                                            collectionId:
                                                search.collection ?? 1,
                                            page: search.page ?? 1,
                                        }),
                                    }),
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
                                                user: await getUserById(3),
                                            }),
                                        },
                                    ],
                                },
                                {
                                    path: ':id',
                                    element: <SignPage />,
                                    loader: async ({ params }) => ({
                                        sign: await getSignByIdJson(params.id),
                                        user: await getUserById(3),
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
                                user: await getUserById(3),
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
                                user: await getUserById(3),
                            }),
                        },
                        // {
                        //     path: 'settings',
                        //     element: <SettingsPage />,
                        //     loader: async () => ({
                        //         user: await getUserById(3),
                        //     }),
                        // },
                        {
                            path: 'settings',

                            element: <CollectionsPage />,
                            loader: async () => ({
                                user: await getUserById(3),
                            }),
                            loaderMaxAge: 0,
                        },
                        {
                            path: 'leit',
                            element: <AllSignsPage />,
                            loader: async ({ search }) => ({
                                signs: await searchPagedCollectionById({
                                    searchValue: search.query ?? '',
                                    collectionId: search.collection ?? 1,
                                    page: search.page ?? 1,
                                }),
                            }),
                        },
                        {
                            path: 'headlessuitest',
                            element: <HeadlessUITest />,
                        },
                        {
                            // Passing no route is equivalent to passing `path: '*'`
                            element: <NotFound />,
                        },
                    ]}
                >
                    <Outlet />
                    <AppNavBar type="footer" />
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
                        <DarkModeSwitch setCurrentTheme={setCurrentTheme} />
                        {/* <ReactLocationDevtools /> */}
                    </div>
                </Router>
                <SignWikiCredits />
            </ThemeContext.Provider>
        </QueryClientProvider>
    )
}

export default App
