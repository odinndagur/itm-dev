import { useEffect, useState } from 'react'
import { query } from '../db'
import SearchableSignList from './SearchableSignList'
import { AppNavBar } from './AppNavBar'

function Leit() {
    const [handforms, setHandforms] = useState([])
    const [myndunarstadir, setMyndunarstadir] = useState([])
    const [efnisflokkar, setEfnisflokkar] = useState([])
    const [ordflokkar, setOrdflokkar] = useState([])

    const [selectedHandforms, setSelectedHandforms] = useState<string[]>([])
    const [selectedMyndunarstadir, setSelectedMyndunarstadir] = useState<
        string[]
    >([])
    const [selectedEfnisflokkar, setSelectedEfnisflokkar] = useState<string[]>(
        []
    )
    const [selectedOrdflokkar, setSelectedOrdflokkar] = useState<string[]>([])

    const [signs, setSigns] = useState<any>([])

    const [showFilterBox, setShowFilterBox] = useState(false)

    useEffect(() => {
        const clauses = [
            selectedHandforms.length
                ? `handform in (${selectedHandforms.join(',')})`
                : '',
            selectedMyndunarstadir.length
                ? `myndunarstadur in (${selectedMyndunarstadir.join(',')})`
                : '',
            selectedEfnisflokkar.length
                ? `efnisflokkur in (${selectedEfnisflokkar.join(',')})`
                : '',
            selectedOrdflokkar.length
                ? `ordflokkur in (${selectedOrdflokkar.join(',')})`
                : '',
        ].filter((entry) => {
            return entry != ''
        })
        let sql = `
        select distinct
        sign.id,
        sign.phrase,
        sign.myndunarstadur,
        sign.ordflokkur,
        sign.handform,
        efnisflokkur.text as efnisflokkur
        from sign
        join sign_efnisflokkur
        ON sign.id = sign_efnisflokkur.sign_id
        join efnisflokkur
        ON efnisflokkur.id = sign_efnisflokkur.efnisflokkur_id
        ${clauses.length ? 'where' : ''}
        ${clauses.join(' and ')}
        group by sign.id
        order by sign.phrase
        `
        console.log(sql)
        query(sql).then((signs) => {
            console.log(signs)
            setSigns(signs)
        })
        console.log({
            selectedEfnisflokkar,
            selectedHandforms,
            selectedMyndunarstadir,
            selectedOrdflokkar,
        })
    }, [
        selectedEfnisflokkar,
        selectedHandforms,
        selectedMyndunarstadir,
        selectedOrdflokkar,
    ])

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
            'select efnisflokkur.text as efnisflokkur from efnisflokkur where efnisflokkur.text is not null order by efnisflokkur.text'
        ).then((efnisflokkar: any) => {
            setEfnisflokkar(
                efnisflokkar
                    .map((flokkur: any) => {
                        return flokkur.efnisflokkur
                    })
                    .filter((flokkur: any) => {
                        return flokkur != ''
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
    return (<>
        <div style={{ height: '100%' }}>
            <h1>leit</h1>
                <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignContent: 'center',
                    width:'80%',
                    margin:'auto'
                }}
                >
                <button onClick={() => setShowFilterBox(!showFilterBox)}>Sía niðurstöður</button>
                {showFilterBox ?
                <div>

                        <select
                            style={{ flexBasis: '100%', margin: '0.5rem' }}
                            name=""
                            id=""
                            multiple
                            onChange={(e) => {
                                let values = Array.from(
                                    e.target.selectedOptions,
                                    (option) => `"${option.value}"`
                                )
                                setSelectedHandforms(values)
                            }}
                        >
                            {handforms.map((handform) => {
                                return (
                                    <option value={handform} key={handform}>
                                        {handform}
                                    </option>
                                )
                            })}
                        </select>
                        <select
                            style={{ flexBasis: '100%', margin: '0.5rem' }}
                            name=""
                            id=""
                            multiple
                            onChange={(e) => {
                                let values = Array.from(
                                    e.target.selectedOptions,
                                    (option) => `"${option.value}"`
                                )
                                setSelectedMyndunarstadir(values)
                            }}
                        >
                            {myndunarstadir.map((myndunarstadur) => {
                                return (
                                    <option value={myndunarstadur} key={myndunarstadur}>
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
                            onChange={(e) => {
                                let values = Array.from(
                                    e.target.selectedOptions,
                                    (option) => `"${option.value}"`
                                )
                                setSelectedEfnisflokkar(values)
                            }}
                        >
                            {efnisflokkar.map((efnisflokkur) => {
                                return (
                                    <option value={efnisflokkur} key={efnisflokkur}>
                                        {efnisflokkur}
                                    </option>
                                )
                            })}
                        </select>
                        <select
                            style={{ flexBasis: '100%', margin: '0.5rem' }}
                            name=""
                            id=""
                            multiple
                            onChange={(e) => {
                                let values = Array.from(
                                    e.target.selectedOptions,
                                    (option) => `"${option.value}"`
                                )
                                setSelectedOrdflokkar(values)
                            }}
                        >
                            {ordflokkar.map((ordflokkur) => {
                                return (
                                    <option value={ordflokkur} key={ordflokkur}>
                                        {ordflokkur}
                                    </option>
                                )
                            })}
                        </select>
                </div>
            : ''
            }
                </div>

            {/* : <button onClick={() => setShowFilterBox(!showFilterBox)}>Sía niðurstöður</button> */}
            <div style={{ flexGrow: 1, height: '100%' }}>
                <SearchableSignList
                    items={signs}
                    itemType="sign"
                    itemSize={40}
                />
            </div>
        </div>
        {/* <AppNavBar/> */}
        </>
    )
}

export default Leit
