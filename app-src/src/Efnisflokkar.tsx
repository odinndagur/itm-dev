import { useState, useEffect } from "react"
function Efnisflokkar(){
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

    const [efnisflokkar,setEfnisflokkar] = useState([])
    const [loaded,setLoaded] = useState(false)

    useEffect(()=> {
        window.promiseWorker.postMessage({type:'sql',query:'select * from efnisflokkur'}).then((efnisflokkar:any) => {
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