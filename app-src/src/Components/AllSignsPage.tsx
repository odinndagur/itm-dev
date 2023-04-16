import { useState, useRef, useEffect } from 'react'
import { getCollectionById, searchPagedCollectionById } from '../db'
import {
    Link,
    useSearch,
    MakeGenerics,
    useNavigate,
} from '@tanstack/react-location'
import './AllSignsPage.css'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

type MyLocationGenerics = MakeGenerics<{
    Search: {
        pagination?: {
            index: number
        }
    }
}>

export function AllSignsPage() {
    const [page, setPage] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)
    // const location = useLocation()
    const params = new URLSearchParams(window.location.search)
    useEffect(() => {
        // if (params.get('page')) {
        //     setPage(Number(params.get('page')))
        // }
        setPage(Number(params.get('page')))
        setSearchValue(params.get('query') ?? '')
    }, [])

    const [searchValue, setSearchValue] = useState('')

    const handleSearch = (query: string) => {
        setSearchValue(query)
        // params.set('query', query)
        // location.search = params.toString()
        // window.history.replaceState(null, '', location)
    }

    const updatePage = (page: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set('page', String(page))
        // newLocation.search = params.toString()
        // let newLocation = window.location
        //     .toString()
        //     .replace(window.location.search, params.toString())
        // window.history.pushState(null, '', newLocation)
        window.history.replaceState(null, '', `?${params.toString()}`)
        // window.location.search = params.toString()
        setPage(page)
        scrollRef.current?.scrollTo({ top: 0 })
    }
    const search = useSearch<MyLocationGenerics>()
    const navigate = useNavigate<MyLocationGenerics>()

    const nextPage = () => {
        console.log('next page')
        navigate({
            // All typesafe!
            search: (old) => ({
                ...old,
                pagination: {
                    ...old.pagination,
                    index: old.pagination.index ? old.pagination.index + 1 : 0,
                },
            }),
        })
    }

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
        return 'Loading...'
    }
    if (isError) {
        return 'Error.'
    }
    return (
        // <div className="flexcol">
        <>
            <header>
                <Link to={'/'}>
                    <h1 className="heading">ÍTM</h1>
                </Link>
                {/* <h3>{collectionName}</h3> */}
                <div className="search">
                    <input
                        onChange={(event) => handleSearch(event.target.value)}
                        type="search"
                        placeholder="Leita að tákni"
                        style={{ padding: '0.4rem 1rem' }}
                    />
                </div>
            </header>
            {data || isPlaceholderData ? (
                <div className="signlist" ref={scrollRef}>
                    {data.map((sign) => {
                        return (
                            <Link
                                key={sign.sign_id}
                                to={`/itm-dev/signs/${sign.sign_id}`}
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
                    <div className="pagination">
                        <a onClick={() => updatePage(page - 1)}>
                            {page > 0 ? page : ''}
                        </a>
                        <a className="active">{page + 1}</a>
                        <a onClick={() => updatePage(page + 1)}>{page + 2}</a>
                    </div>
                </div>
            ) : (
                ''
            )}
            {/* <AppNavBar/> */}
            {/* <SignWikiCredits/> */}
        </>
        // </div>
    )
}
