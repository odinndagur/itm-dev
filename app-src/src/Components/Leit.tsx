import { useEffect, useState } from 'react'
import { query } from '../db'

function Leit() {
    const [handforms, setHandforms] = useState([])
    const [myndunarstadir, setMyndunarstadir] = useState([])
    const [efnisflokkar, setEfnisflokkar] = useState([])
    const [ordflokkar, setOrdflokkar] = useState([])
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        query(
            'select distinct handform from sign where handform is not null order by handform'
        ).then((handforms) => {
            setHandforms(handforms.map((row: any) => row.handform))
        })
        query(
            'select distinct myndunarstadur from sign where myndunarstadur is not null order by myndunarstadur'
        ).then((myndunarstadir) => {
            setMyndunarstadir(
                myndunarstadir.map((row: any) => row.myndunarstadur)
            )
        })
        query(
            'select * from efnisflokkur where efnisflokkur.text is not null order by efnisflokkur.text'
        ).then((efnisflokkar: any) => {
            setEfnisflokkar(
                efnisflokkar.filter((flokkur: any) => {
                    return flokkur.text != ''
                })
            )
        })
        query(
            'select distinct ordflokkur from sign where ordflokkur is not null order by ordflokkur'
        ).then((ordflokkar: any) => {
            setOrdflokkar(
                ordflokkar
                    .map((flokkur: any) => {
                        return flokkur.ordflokkur
                    })
                    .filter((flokkur: any) => {
                        return flokkur.text != ''
                    })
            )
        })
        setLoaded(true)
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
                    multiple
                >
                    {handforms.map((handform) => {
                        return <option value={handform}>{handform}</option>
                    })}
                </select>
                <select
                    style={{ flexBasis: '100%', margin: '0.5rem' }}
                    name=""
                    id=""
                    multiple
                >
                    {myndunarstadir.map((myndunarstadur) => {
                        return (
                            <option value={myndunarstadur}>
                                {myndunarstadur}
                            </option>
                        )
                    })}
                </select>
                <select
                    style={{ flexBasis: '100%', margin: '0.5rem' }}
                    name=""
                    id=""
                    multiple
                >
                    {efnisflokkar.map((efnisflokkur) => {
                        return (
                            <option value={efnisflokkur.id}>
                                {efnisflokkur.text}
                            </option>
                        )
                    })}
                </select>
                <select
                    style={{ flexBasis: '100%', margin: '0.5rem' }}
                    name=""
                    id=""
                    multiple
                >
                    {ordflokkar.map((ordflokkur) => {
                        return <option value={ordflokkur}>{ordflokkur}</option>
                    })}
                </select>
            </div>
        </div>
    )
}

export default Leit
