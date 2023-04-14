import { useState, useRef, useEffect } from 'react'
import { getCollectionById, searchPagedCollectionById } from '../db'
import { Link } from 'react-router-dom'
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
    const [searchValue, setSearchValue] = useState('')

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
                <div className="signlist">
                    {data.map((sign) => {
                        return <div key={sign.sign_id}>{sign.phrase}</div>
                    })}
                    <div className="pagination">
                        <a onClick={() => setPage(page - 1)}>
                            {page - 1 > 0 ? page : ''}
                        </a>
                        <a className="active">{page + 1}</a>
                        <a onClick={() => setPage(page + 1)}>{page + 2}</a>
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
