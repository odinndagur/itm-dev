import { useState, useEffect } from "react"
import { query } from "../db"
function Efnisflokkar(){
    const [efnisflokkar,setEfnisflokkar] = useState([])
    const [loaded,setLoaded] = useState(false)

    useEffect(()=> {
        query('select * from efnisflokkur').then((efnisflokkar:any) => {
            setEfnisflokkar(efnisflokkar)
            setLoaded(true)
        })
    },[])

    if(!loaded){
        return ''
    }
    return (
        <div>
            {efnisflokkar.map((efnisflokkur:any) => {
                return <div>
                    {efnisflokkur.text}
                </div>
            })}
        </div>
    )
}

export default Efnisflokkar