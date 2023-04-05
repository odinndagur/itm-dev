import { useState, useEffect } from "react"
import { useParams } from 'react-router'
import Sign from "./Sign"

function Efnisflokkur(){
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

    const [signs,setSigns] = useState([])
    const [loaded,setLoaded] = useState(false)

    const params: any = useParams()

    useEffect(()=> {
        window.promiseWorker.postMessage({type:'sql',query:`select * from sign
                                                            join sign_efnisflokkur on sign.id = sign_efnisflokkur.sign_id
                                                            join efnisflokkur on efnisflokkur.id = sign_efnisflokkur.efnisflokkur_id
                                                            where efnisflokkur.text = ${params.efnisflokkur}`}).then((signs:any) => {
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