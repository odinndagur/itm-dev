import InfiniteSignList from './InfiniteSignList'
import SearchableSignList from './SearchableSignList'
import { useEffect, useState } from 'react'
import { Switch } from '@mui/material'
import './SignList.css'

function ConditionalSignList({
    searchValue,
    listProps,
    collection,
}: {
    searchValue: string
    listProps: {}
    collection?: number
}) {
    const userCollection = 3
    return searchValue === '' && collection == 1 ? (
        <InfiniteSignList collection={userCollection} {...listProps} />
    ) : (
        <SearchableSignList
            collection={collection!}
            searchValue={searchValue}
            {...listProps}
        />
    )
}

function SignList() {
    const [searchValue, setSearchValue] = useState('')  
    const [collection, setCollection] = useState(1)
    
    function changeCollection() {
        if (collection == 1) {
            setCollection(3)
        } else {
            setCollection(1)
        }

        const temp = searchValue
        setSearchValue('')
        setSearchValue(temp)
    }

    return (
        <div
            className="App"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <header>
                <h1 className="heading">ÍTM</h1>
                <div className="search">
                    {/* <TextField
                        id="outlined-basic"
                        onChange={(event) => setSearchValue(event.target.value)}
                        variant="outlined"
                        fullWidth
                        label="Search"
                    /> */}
                    <input
                        onChange={(event) => setSearchValue(event.target.value)}
                        type="search"
                    />
                </div>
                <span>Öll tákn</span>
                <Switch onClick={() => changeCollection()} />
                <span>Mín tákn</span>
            </header>
            <div className="signlist">
                    <ConditionalSignList
                        searchValue={searchValue}
                        listProps={{ itemSize: 40 }}
                        collection={collection}
                    />
            </div>
            <footer style={{ margin: 'auto' }}></footer>
        </div>
    )
}

export default SignList
