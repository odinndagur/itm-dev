import SearchableSignList from './SearchableSignList'
import { useState, useRef, useEffect } from 'react'
import { getCollectionById } from '../db'
import './SignList.css'
import { Link } from 'react-router-dom'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

export function AllSignsPage() {
    const [searchValue, setSearchValue] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)
    const handleSearch = () => {
        if (inputRef.current) {
            setSearchValue(inputRef.current.value)
            console.log(inputRef, searchValue)
        }
    }

    const handleOnKeyDown = () => {
        // if (inputRef.current) {
        //     setSearchValue(inputRef.current.value)
        //     console.log(inputRef, searchValue)
        // }
        handleSearch()
    }
    useEffect(() => {
        if (inputRef.current) {
            setSearchValue(inputRef.current.value)
            console.log(inputRef, searchValue)
        }
    }, [inputRef.current])
    const { data, isPlaceholderData } = useQuery({
        queryKey: ['signs', searchValue ?? null],
        queryFn: () => getCollectionById(searchValue, 1),
        keepPreviousData: true,
    })
    return (
        <div className="flexcol">
            <header>
                <Link to={'/'}>
                    <h1 className="heading">ÍTM</h1>
                </Link>
                {/* <h3>{collectionName}</h3> */}
                <div className="search">
                    <input
                        // onChange={(event) => setSearchValue(event.target.value)}
                        onKeyDown={handleOnKeyDown}
                        ref={inputRef}
                        type="search"
                        placeholder="Leita að tákni"
                        style={{ padding: '0.4rem 1rem' }}
                    />
                </div>
            </header>
            {data || isPlaceholderData ? (
                <div className="signlist">
                    <SearchableSignList
                        items={data}
                        itemSize={50}
                        itemType="sign"
                    />
                </div>
            ) : (
                ''
            )}
            <footer style={{ margin: 'auto' }}></footer>
        </div>
    )
}
