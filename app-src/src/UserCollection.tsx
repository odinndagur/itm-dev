import { useState, useEffect } from 'react'
import Sign from './Sign'

function UserCollection() {
    const [signs, setSigns] = useState([])

    useEffect(() => {
        const msCount = 1000
        const timer = setTimeout(() => {
            console.log(`This will run after ${msCount}ms!`)
            window.promiseWorker
                .postMessage({
                    type: 'getDefaultUserCollection',
                })
                .then((searchResults) => {
                    console.log(searchResults)
                    setSigns(searchResults)
                })
        }, msCount)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div>
            {signs.map((sign) => {
                return <Sign sign={sign} key={sign.id} />
            })}
        </div>
    )
}

export default UserCollection
