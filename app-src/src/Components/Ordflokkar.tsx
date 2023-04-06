import { useState, useEffect } from 'react'
import { query } from '../db'
import { Link } from 'react-router-dom'
function Ordflokkar() {
    const [ordflokkar, setOrdflokkar] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        query(
            'select distinct ordflokkur from sign where ordflokkur is not null order by ordflokkur'
        ).then((ordflokkar: any) => {
            setOrdflokkar(
                ordflokkar
                    .map((flokkur: any) => {
                        return flokkur.ordflokkur
                    })
                    .filter((flokkur: any) => {
                        return flokkur.text != ''
                    })
            )
            setLoaded(true)
        })
    }, [])

    if (!loaded) {
        return ''
    }
    return (
        <div>
            {ordflokkar.map((ordflokkur: any) => {
                return (
                    <Link to={`/ordflokkar/${ordflokkur}`} key={ordflokkur}>
                        <div className="card">{ordflokkur}</div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Ordflokkar
