import { useState, useRef, useEffect } from 'react'
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

type MyLocationGenerics = MakeGenerics<{
    Search: {
        page?: number
        query?: string
    }
}>

export function AllSignsPage() {
    const inputRef = useRef<HTMLInputElement>(null)
    // const [oldSearch, setOldSearch] = useState<URLSearchParams>()
    const [page, setPage] = useState(1)
    const scrollRef = useRef<HTMLDivElement>(null)
    const params = new URLSearchParams(window.location.search)
    useEffect(() => {
        setPage(Number(params.get('page') ?? 1))
        setSearchValue(params.get('query') ?? '')
        if (inputRef.current) {
            inputRef.current.value = ''
            inputRef.current.value = params.get('query') ?? ''
        }
    }, [window.location.search])

    const [searchValue, setSearchValue] = useState('')

    const handleSearch = (query: string) => {
        setSearchValue(query)
        // const params = new URLSearchParams(window.location.search)
        // params.set('query', query)
        // params.set('page', '1')
        // window.history.replaceState(
        //     params.toString(),
        //     '',
        //     `?${params.toString()}`
        // )
        if(query[query.length-1] != '´'){
            navigate({
                search: (old) => ({ ...old, query: query, page: 1 }),
            })
            scrollRef.current?.scrollTo({ top: 0 })
        }
        // setOldSearch(params)
        // params.set('query', query)
        // location.search = params.toString()
        // window.history.replaceState(null, '', location)
    }

    const updatePage = (page: number) => {
        // const params = new URLSearchParams(window.location.search)
        // params.set('page', String(page))
        // newLocation.search = params.toString()
        // let newLocation = window.location
        //     .toString()
        //     .replace(window.location.search, params.toString())
        // window.history.pushState(null, '', newLocation)
        // window.history.pushState(null, '', `?${params.toString()}`)

        navigate({
            search: (old) => ({ ...old, query: searchValue, page: page }),
        })
        // window.location.search = params.toString()
        // setPage(page)
        scrollRef.current?.scrollTo({ top: 0 })
    }
    const search = useSearch<MyLocationGenerics>()
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
    // const {
    //     data: {
    //         // You can access any data merged in from parent loaders as well
    //         signs,
    //     },
    // } = useMatch()

    function Pagination({
        offset,
        totalPages,
        totalSignCount,
        updatePage,
        limit,
    }: {
        offset: number
        totalPages: number
        totalSignCount: number
        updatePage: (page: number) => void
        limit: number
    }) {
        const signCountOnPage = Math.min(totalSignCount - offset, limit)
        return (
            <>
                {/* <div>{offset}</div>
                <div>{totalPages}</div>
                <div>{totalSignCount}</div>
                <div>signs on page {Math.min(totalSignCount-offset, limit)}</div> */}
                    <div className='center pad'>
                        Sýni tákn {offset}-{offset+signCountOnPage} af {totalSignCount}.
                    </div>
                <div className="pagination">
                    {/* <a onClick={() => updatePage(page - 1)}>
                        {page > 1 ? page - 1 : ''}
                    </a> */}
                    <a onClick={() => updatePage(page - 1)} className="">
                        Fyrri
                    </a>
                    <a onClick={() => updatePage(1)} className="">
                        1
                    </a>
                    <a className="active">{page}</a>
                    <a onClick={() => updatePage(totalPages)} className="">
                        {totalPages}
                    </a>
                    {/* <a onClick={() => updatePage(page + 1)}>{page + 1}</a> */}
                    <a onClick={() => updatePage(page + 1)}>Næsta</a>
                </div>
            </>
        )
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
                        ref={inputRef}
                    />
                </div>
            </header>
            {data || isPlaceholderData ? (
                <div className="signlist" ref={scrollRef}>
                    <Pagination
                        offset={data.offset}
                        totalPages={data.totalPages}
                        totalSignCount={data.totalSignCount}
                        updatePage={updatePage}
                        limit={data.limit}
                    />
                    {data.signs.map((sign) => {
                        return (
                            <Link
                                key={sign.sign_id}
                                to={`/itm-dev/sign`}
                                search={(search) => ({
                                    id: sign.sign_id,
                                    lastSearch: {
                                        ...search,
                                        query: searchValue,
                                        page: page,
                                    },
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
                    />
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
