import { useState, useRef, useEffect } from 'react'
import { getCollectionById, searchPagedCollectionById } from '../db'
import { Link, useLocation } from 'react-router-dom'
import './AllSignsPage.css'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

export function AllSignsPage() {
    const [page, setPage] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)

    const location = useLocation()
    const params = new URLSearchParams(location.search)
    useEffect(() => {
        if (params.get('page')) {
            setPage(Number(params.get('page')))
        }
    }, [])

    const [searchValue, setSearchValue] = useState('')

    const updatePage = (page: number) => {
        setPage(page)
        scrollRef.current?.scrollTo({ top: 0 })
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
                        onChange={(event) => setSearchValue(event.target.value)}
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
                                to={`/signs/${sign.sign_id}`}
                            >
                                <div className="temp-card">
                                    <b>{sign.phrase}</b>
                                    <div>
                                        <i>{sign.related_signs}</i>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    <div className="pagination">
                        <a onClick={() => updatePage(page - 1)}>
                            {page - 1 > 0 ? page : ''}
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
