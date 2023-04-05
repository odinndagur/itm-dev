import { useState, useEffect } from "react"
import { useParams } from 'react-router'
import Sign from "./Sign"
import { query } from "../db"

function Efnisflokkur(){
    const [signs,setSigns] = useState([])
    const [loaded,setLoaded] = useState(false)

    const params: any = useParams()

    useEffect(()=> {
        query(`select * from sign
                join sign_efnisflokkur on sign.id = sign_efnisflokkur.sign_id
                join efnisflokkur on efnisflokkur.id = sign_efnisflokkur.efnisflokkur_id
                where efnisflokkur.text = ${params.efnisflokkur}`).then((signs:any) => {
            setSigns(signs)
            setLoaded(true)
        })
    },[])

    if(!loaded){
        return ''
    }
    return (
        <div>
            {signs.map((sign:any) => {
                return <div>
                    <Sign sign={sign}/>
                </div>
            })}
        </div>
    )
}

export default Efnisflokkur