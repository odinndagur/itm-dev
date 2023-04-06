import { useEffect, useState } from 'react'
import { query } from '../db'

function Leit() {
    const [handforms, setHandforms] = useState([])
    const [myndunarstadir, setMyndunarstadir] = useState([])
    const [efnisflokkar, setEfnisflokkar] = useState([])
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        query(
            'select distinct handform from sign where handform is not null order by handform'
        ).then((handforms) => {
            setHandforms(handforms.map((row: any) => row.handform))
            setLoaded(true)
        })
    }, [])
    if (!loaded) {
        return ''
    }
    return (
        <div>
            <h1>leit</h1>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignContent: 'center',
                }}
            >
                <select
                    style={{ flexBasis: '100%', margin: '0.5rem' }}
                    name=""
                    id=""
                >
                    {handforms.map((handform) => {
                        return <option value={handform}>{handform}</option>
                    })}
                </select>
                <select
                    style={{ flexBasis: '100%', margin: '0.5rem' }}
                    name=""
                    id=""
                ></select>
                <select
                    style={{ flexBasis: '100%', margin: '0.5rem' }}
                    name=""
                    id=""
                ></select>
            </div>
        </div>
    )
}

export default Leit
