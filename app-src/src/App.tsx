//@ts-nocheck
import { useState, useEffect, FormEvent } from 'react'
import SignList from './Components/SignList'
import SignPage from './Components/SignPage'
import Efnisflokkar from './Components/Efnisflokkar'
import Efnisflokkur from './Components/Efnisflokkur'
import { query } from './db'
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom'
import Collections from './Components/Collections'
import Collection from './Components/Collection'

function App() {
    const [promiseWorkerLoaded, setPromiseWorkerLoaded] = useState(false)
    useEffect(() => {
        const intervalID = setInterval(() => {
            console.log('callback yo')
            try {
                query('select * from sign limit 5')
                .then((res: any) => {
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

    if(!promiseWorkerLoaded){
        return ''
    }
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route exact path={''} element={<SignList />}></Route>
                <Route exact path={`/signs/:id`} element={<SignPage />} />
                <Route exact path={`/efnisflokkar`} element={<Efnisflokkar />} />                
                <Route exact path={`/efnisflokkar/:efnisflokkur`} element={<Efnisflokkur />} />                
                <Route exact path={`/collections/`} element={<Collections />} />                
                <Route exact path={`/collections/:collectionId`} element={<Collection />} />                
                <Route render={() => <div>404 Not Found</div>} />
            </Routes>
        </Router>
    )
}

export default App
