import { useState, useEffect } from 'react'
import { query } from '../db'
import { Link } from 'react-router-dom'
function Efnisflokkar() {
    const [efnisflokkar, setEfnisflokkar] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        query('select * from efnisflokkur order by text').then(
            (efnisflokkar: any) => {
                setEfnisflokkar(
                    efnisflokkar.filter((flokkur:any) => {
                        return flokkur.text != ''
                    })
                )
                setLoaded(true)
            }
        )
    }, [])

    if (!loaded) {
        return ''
    }
    return (
        <div>
            {efnisflokkar.map((efnisflokkur: any) => {
                return (
                    <Link
                        to={`/efnisflokkar/${efnisflokkur.text}`}
                        key={efnisflokkur.id}
                    >
                        <div className="card">{efnisflokkur.text}</div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Efnisflokkar
