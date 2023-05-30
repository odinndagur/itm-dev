import { Link, useNavigate, useSearch } from '@tanstack/react-location'
import { useQuery } from '@tanstack/react-query'
import { listHandforms, listSignDetails } from '../db'
import { ChangeEvent, useEffect, useState } from 'react'
import './signpage.css'

export function SignFilter() {
    const [showFilters, setShowFilters] = useState(false)
    type signDetailsType = Awaited<ReturnType<typeof listSignDetails>>
    const [signDetails, setSignDetails] = useState<signDetailsType>()
    const [selectedSignDetails, setSelectedSignDetails] =
        useState<signDetailsType>()
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        // listHandforms().then(setHandforms)
        listSignDetails().then(setSignDetails)
        setLoaded(true)
    }, [])

    const navigate = useNavigate()

    function changeDetail(
        ev: ChangeEvent<HTMLSelectElement>,
        {
            kind,
        }: {
            kind: 'handform' | 'ordflokkur' | 'efnisflokkur' | 'myndunarstadur'
        }
    ) {
        console.log(kind)
        const currentOptions = Array.from(ev.target)
            .map((option) => {
                if (option.selected) {
                    return option.value
                }
                return null
            })
            .filter((temp) => temp != null && temp != '')
        if (!currentOptions) {
            navigate({ search: (old) => ({ ...old, signDetails: null }) })
            return
        }
        if (kind == 'ordflokkur') {
            navigate({
                search: (old) => ({
                    ...old,
                    signDetails: {
                        ...old.signDetails,
                        ordflokkur: currentOptions,
                    },
                }),
            })
        }
        if (kind == 'efnisflokkur') {
            navigate({
                search: (old) => ({
                    ...old,
                    signDetails: {
                        ...old.signDetails,
                        efnisflokkur: currentOptions,
                    },
                }),
            })
        }
        if (kind == 'myndunarstadur') {
            navigate({
                search: (old) => ({
                    ...old,
                    signDetails: {
                        ...old.signDetails,
                        myndunarstadur: currentOptions,
                    },
                }),
            })
        }
        if (kind == 'handform') {
            navigate({
                search: (old) => ({
                    ...old,
                    signDetails: {
                        ...old.signDetails,
                        handform: currentOptions,
                    },
                }),
            })
        }
    }

    // function changeHandform(ev) {
    //     console.log(ev)
    //     const selectedHandforms = Array.from(ev.target)
    //         .map((option) => {
    //             if (option.selected) {
    //                 return option.value
    //             }
    //             return null
    //         })
    //         .filter((temp) => temp != null)
    //     navigate({
    //         search: (old) => ({
    //             ...old,
    //             signDetails: {
    //                 ...old.signDetails,
    //                 handform: selectedHandforms,
    //             },
    //         }),
    //     })
    // }

    if (!loaded) {
        return null
    }
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <button onClick={() => setShowFilters((show) => !show)}>
                    Síur
                </button>
                <Link search={(old) => ({ ...old, signDetails: null })}>
                    <span className="material-icons">clear</span>
                </Link>
            </div>
            <div
                className="sign-info"
                style={{ display: showFilters ? null : 'none' }}
            >
                {/* <div>{JSON.stringify(signDetails)}</div> */}
                <select
                    className="sign-info-item card"
                    multiple
                    onChange={(ev) => changeDetail(ev, { kind: 'handform' })}
                    // onChange={(ev) => changeHandform(ev)}
                >
                    <option value="Handform" disabled>
                        Handform
                    </option>

                    {signDetails?.handform?.map((hf) => {
                        return (
                            <option key={hf} value={hf}>
                                {hf}
                            </option>
                        )
                    })}
                </select>
                <select
                    className="sign-info-item card"
                    multiple
                    onChange={(ev) => changeDetail(ev, { kind: 'ordflokkur' })}
                >
                    <option value="Orðflokkur" disabled>
                        Orðflokkur
                    </option>

                    {signDetails?.ordflokkur?.map((ordfl) => {
                        return (
                            <option key={ordfl} value={ordfl}>
                                {ordfl}
                            </option>
                        )
                    })}
                </select>
                <select
                    className="sign-info-item card"
                    multiple
                    onChange={(ev) =>
                        changeDetail(ev, { kind: 'efnisflokkur' })
                    }
                >
                    <option value="Efnisflokkur" disabled>
                        Efnisflokkur
                    </option>

                    {signDetails?.efnisflokkur?.map((efnisfl) => {
                        return (
                            <option key={efnisfl} value={efnisfl}>
                                {efnisfl}
                            </option>
                        )
                    })}
                </select>
                <select
                    className="sign-info-item card"
                    multiple
                    onChange={(ev) =>
                        changeDetail(ev, { kind: 'myndunarstadur' })
                    }
                >
                    <option value="Myndunarstaður" disabled>
                        Myndunarstaður
                    </option>

                    {signDetails?.myndunarstadur?.map((mf) => {
                        return (
                            <option key={mf} value={mf}>
                                {mf}
                            </option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
}
