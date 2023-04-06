import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import Sign from './Sign'
import { query } from '../db'

function Myndunarstadur() {
    const [signs, setSigns] = useState([])
    const [loaded, setLoaded] = useState(false)

    const params: any = useParams()

    useEffect(() => {
        query(`select distinct
                sign.id as sign_id,
                sign.phrase
                from sign
                where myndunarstadur = "${params.myndunarstadur}"
                group by sign.id
                order by sign.phrase
                collate nocase`).then((signs: any) => {
            setSigns(signs)
            setLoaded(true)
        })
    }, [])

    if (!loaded) {
        return ''
    }
    return (
        <div>
            {signs.map((sign: any) => {
                return (
                    <div key={sign.sign_id}>
                        <Sign sign={sign} />
                    </div>
                )
            })}
        </div>
    )
}

export default Myndunarstadur
