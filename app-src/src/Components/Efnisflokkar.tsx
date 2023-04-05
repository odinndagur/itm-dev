import { useState, useEffect } from 'react'
import { query } from '../db'
function Efnisflokkar() {
    const [efnisflokkar, setEfnisflokkar] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        query('select * from efnisflokkur order by text').then(
            (efnisflokkar: any) => {
                setEfnisflokkar(
                    efnisflokkar.filter((flokkur) => {
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
                    <div className="card" key={efnisflokkur.id}>
                        {efnisflokkur.text}
                    </div>
                )
            })}
        </div>
    )
}

export default Efnisflokkar
