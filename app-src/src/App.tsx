//@ts-nocheck
import { useState, useEffect, FormEvent } from 'react'
import SignList from './Components/SignList'
import SignPage from './Components/SignPage'
import Efnisflokkar from './Components/Efnisflokkar'
import Efnisflokkur from './Components/Efnisflokkur'
import {
    createBrowserRouter,
    BrowserRouter as Router,
    Route,
    Routes,
    ScrollRestoration,
} from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

function App() {
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
                <Route render={() => <div>404 Not Found</div>} />
            </Routes>
        </Router>
    )
}

export default App
