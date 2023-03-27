import { useState, useEffect, FormEvent } from 'react'
import Sign from './Sign'
import UserCollection from './UserCollection'
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    TextField,
} from '@mui/material'

import './app.css'

import InfiniteSignList from './InfiniteSignList'

function App() {
    const [searchValue, setSearchValue] = useState('')
    // const [signs, setSigns] = useState<Signs>([])
    const [allCollections, setAllCollections] = useState<Collections>([])
    const [currentCollection, setCurrentCollection] = useState('')
    const [promiseWorkerLoaded, setPromiseWorkerLoaded] = useState(false)

    // timeout to get initial signs, have to wait so the promiseworker is definitely there
    // useEffect(() => {
    //     const msCount = 1000
    //     const timer = setTimeout(() => {
    //         console.log(`This will run after ${msCount}ms!`)
    //         // get initial signs
    //         window.promiseWorker
    //             .postMessage({
    //                 type: 'signSearch',
    //                 query: searchValue,
    //             })
    //             .then((searchResults: Signs) => {
    //                 console.log(searchResults)
    //                 setSigns(searchResults)
    //             })

    //         // get list of collections
    //         window.promiseWorker
    //             .postMessage({
    //                 type: 'listCollections',
    //             })
    //             .then((collections: Collections) => {
    //                 setAllCollections(collections)
    //             })
    //     }, msCount)
    //     return () => clearTimeout(timer)
    // }, [])

    // search everytime the input changes
    // useEffect(() => {
    //     searchSigns(searchValue).then((signs) => {
    //         setSigns(signs)
    //     })
    // window.promiseWorker.postMessage({
    //   type:'signSearch',
    //   query:searchValue
    // }).then((searchResults: Signs) => {
    //   setSigns(searchResults)
    // })
    // }, [searchValue])

    // useEffect(() => {
    //     console.log(currentCollection)
    //     window.promiseWorker
    //         .postMessage({
    //             type: 'getCollectionById',
    //             collectionId: currentCollection,
    //         })
    //         .then((searchResults: Signs) => {
    //             console.log(searchResults)
    //             setSigns(searchResults)
    //         })
    // }, [currentCollection])

    // function buttonClick() {
    //     window.promiseWorker
    //         .postMessage({
    //             type: 'signSearch',
    //             query: searchValue,
    //         })
    //         .then((searchResults: Signs) => {
    //             setSigns(searchResults)
    //         })
    // }

    async function searchSigns(searchQuery: string) {
        console.log('searchsigns')
        const searchResults: Signs = await window.promiseWorker.postMessage({
            type: 'signSearch',
            query: searchQuery,
        })
        return searchResults
    }

    // function createNewCollection(event: FormEvent<HTMLFormElement>) {
    //     event.preventDefault()
    //     console.log(event.target.collectionName.value)
    // }

    // function handleChange(param) {
    //     console.log(param)
    // }

    function handleSearch(event) {
        setSearchValue(event.target.value)
    }

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

    return (
        <div
            className="App"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <header>
                {/* <Button variant="contained">Hello World</Button>
                <Switch /> */}
                <h1 className="heading">ÍTM</h1>
                {/* <label>
                    Leita að tákni
                    <input
                        value={searchValue}
                        onChange={handleSearch}
                        type={'search'}
                    />
                </label> */}

                <div className="search">
                    <TextField
                        id="outlined-basic"
                        onChange={handleSearch}
                        variant="outlined"
                        fullWidth
                        label="Search"
                    />
                </div>
            </header>
            {/* <div style={{display:'flex',flexDirection:'row',padding:'0 2rem',margin:'auto',justifyContent:'space-between',width:'100%'}}> */}
            {/* <UserCollection/> */}
            {/* <div> */}
            <div className="signlist">
                {promiseWorkerLoaded ? (
                    <InfiniteSignList searchValue={searchValue} />
                ) : (
                    ''
                )}
            </div>
            {/* {signs.map((sign) => {
                return <Sign key={sign.id} sign={sign} />
            })} */}
            {/* </div> */}
            {/* </div> */}
        </div>
    )
}

export default App
