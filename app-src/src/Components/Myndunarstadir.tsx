import { useState, useEffect } from 'react'
import { query } from '../db'
import { Link } from 'react-router-dom'
function Myndunarstadir() {
    const [myndunarstadir, setMyndunarstadir] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        query(
            'select distinct myndunarstadur from sign order by myndunarstadur'
        ).then((myndunarstadir: any) => {
            setMyndunarstadir(
                myndunarstadir
                    .map((myndunarstadur: any) => {
                        if (myndunarstadur.myndunarstadur != '') {
                            return myndunarstadur.myndunarstadur
                        }
                    })
                    .filter((myndunarstadur: any) => {
                        return myndunarstadur != null
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
            {myndunarstadir.map((myndunarstadur: any) => {
                return (
                    <Link
                        to={`/myndunarstadir/${myndunarstadur}`}
                        key={myndunarstadur}
                    >
                        <div className="card">{myndunarstadur}</div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Myndunarstadir
