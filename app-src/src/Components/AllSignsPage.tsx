import { useState, useRef, useEffect } from 'react'
import { Pagination } from './Pagination'
import {
    getCollectionById,
    getSignByIdJson,
    searchPagedCollectionById,
} from '../db'
import {
    Link,
    useSearch,
    MakeGenerics,
    useNavigate,
    useMatch,
} from '@tanstack/react-location'
import './AllSignsPage.css'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { AppNavBar } from './AppNavBar'
import { Header } from './Header'

type MyLocationGenerics = MakeGenerics<{
    Search: {
        page?: number
        query?: string
        scroll?: number
        lastSearch?: {
            page?: number
            query?: string
            scroll?: number
        }
    }
}>

export function AllSignsPage() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [page, setPage] = useState(1)
    const scrollRef = useRef<HTMLDivElement>(null)
    const params = new URLSearchParams(window.location.search)
    const [scroll, setScroll] = useState(0)
    useEffect(() => {
        setTimeout(() => {
            const scrollTarget = Number(search.scroll) ?? 0
            window.scrollTo({ top: scrollTarget })
        }, 200)
    }, [])
    let lastScroll = 0
    useEffect(() => {
        const handleScroll = (event: any) => {
            // setScroll(window.scrollY)
            console.log(window.scrollY)
            console.log(event.currentTarget.scrollY)
            const currentScroll = window.scrollY
            if (Math.abs(currentScroll - lastScroll) > 10) {
                lastScroll = currentScroll
                navigate({
                    search: (old) => ({
                        ...old,
                        scroll: window.scrollY,
                    }),
                    replace: true,
                })
            }
        }
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const search = useSearch<MyLocationGenerics>()
    useEffect(() => {
        setPage(Number(params.get('page') ?? 1))
        setSearchValue(params.get('query') ?? '')
        if (inputRef.current) {
            inputRef.current.value = ''
            inputRef.current.value = params.get('query') ?? ''
        }
        window.scrollTo({ top: 0 })
    }, [search.page, search.query])

    const [searchValue, setSearchValue] = useState('')

    const handleSearch = (query: string) => {
        setSearchValue(query)
        if (query[query.length - 1] != '´') {
            navigate({
                search: (old) => ({ ...old, query: query, page: 1, scroll: 0 }),
            })
            // scrollRef.current?.scrollTo({ top: 0 })
        }
    }

    const updatePage = (page: number) => {
        navigate({
            search: (old) => ({
                ...old,
                query: searchValue,
                page: page,
                scroll: 0,
            }),
        })
        // scrollRef.current?.scrollTo({ top: 0 })
    }
    const navigate = useNavigate<MyLocationGenerics>()

    const { data, isPlaceholderData, isLoading, isError } = useQuery({
        queryKey: ['signs', searchValue ?? null, page],
        queryFn: () =>
            searchPagedCollectionById({
                searchValue: searchValue,
                collectionId: 1,
                page: page,
            }),
        keepPreviousData: true,
    })

    if (isLoading) {
        return ''
    }
    if (isError) {
        return 'Error.'
    }

    return (
        <>
            <Header>
                <div className="search">
                    <input
                        onChange={(event) => handleSearch(event.target.value)}
                        type="search"
                        placeholder="Leita að tákni"
                        ref={inputRef}
                    />
                </div>
            </Header>
            {data || isPlaceholderData ? (
                <div className="signlist" ref={scrollRef}>
                    <Pagination
                        offset={data.offset}
                        totalPages={data.totalPages}
                        totalSignCount={data.totalSignCount}
                        updatePage={updatePage}
                        limit={data.limit}
                        currentPage={page}
                    />
                    {data.signs.map((sign) => {
                        return (
                            <Link
                                key={sign.sign_id}
                                to={`/itm-dev/signs/${sign.sign_id}`}
                                search={(search) => ({
                                    lastSearch: {
                                        ...search,
                                    },
                                    scroll: 0,
                                })}
                            >
                                <div className="temp-card">
                                    <b>{sign.phrase}</b>
                                    <div>
                                        <i>
                                            {sign.related_signs
                                                ? sign.related_signs
                                                      .split(',')
                                                      .join(', ')
                                                : sign.related_signs}
                                        </i>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    <Pagination
                        offset={data.offset}
                        totalPages={data.totalPages}
                        totalSignCount={data.totalSignCount}
                        updatePage={updatePage}
                        limit={data.limit}
                        currentPage={page}
                    />
                </div>
            ) : (
                ''
            )}
        </>
    )
}
