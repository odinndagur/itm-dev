import { useState, useEffect } from 'react'
import { query } from '../db'
import { Link } from 'react-router-dom'
function Handforms() {
    const [handforms, setHandforms] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        query('select distinct handform from sign order by handform').then(
            (handforms: any) => {
                setHandforms(
                    handforms
                        .map((handform: any) => {
                            if (handform.handform != '') {
                                return handform.handform
                            }
                        })
                        .filter((handform: any) => {
                            return handform != null
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
            {handforms.map((handform: any) => {
                return (
                    <Link to={`/handform/${handform}`} key={handform}>
                        <div className="card">{handform}</div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Handforms
