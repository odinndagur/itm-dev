import InfiniteSignList from './InfiniteSignList'
import SearchableSignList from './SearchableSignList'
import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Switch } from '@mui/material'
import './app.css'

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
    
    const [promiseWorkerLoaded, setPromiseWorkerLoaded] = useState(false)
    useEffect(() => {
        const intervalID = setInterval(() => {
            console.log('callback yo')
            try {
                window.promiseWorker
                    .postMessage({
                        type: 'sql',
                        query: 'select * from sign limit 5',
                    } satisfies absurdSqlPromiseWorkerMessage)
                    .then((res: any) => {
                        if (res[0]) {
                            clearInterval(intervalID)
                            setPromiseWorkerLoaded(true)
                        }
                    })
            } catch (error) {
                console.error(error)
            }
        }, 500)
    }, [])

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
                    <TextField
                        id="outlined-basic"
                        onChange={(event) => setSearchValue(event.target.value)}
                        variant="outlined"
                        fullWidth
                        label="Search"
                    />
                </div>
                <span>Öll tákn</span>
                <Switch onClick={() => changeCollection()} />
                <span>Mín tákn</span>
            </header>
            <div className="signlist">
                {promiseWorkerLoaded ? (
                    <ConditionalSignList
                        searchValue={searchValue}
                        listProps={{ itemSize: 40 }}
                        collection={collection}
                    />
                ) : (
                    ''
                )}
            </div>
            <footer style={{ margin: 'auto' }}></footer>
        </div>
    )
}

export default SignList
