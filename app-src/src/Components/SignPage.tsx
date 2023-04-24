//@ts-nocheck
import {
    Link,
    useMatch,
    useNavigate,
    MakeGenerics,
    useLocation,
    useSearch,
    Navigate,
} from '@tanstack/react-location'
import { YoutubeEmbed } from './YoutubeEmbed'
import './signpage.css'
import { useEffect } from 'react'

type MyLocationGenerics = MakeGenerics<{
    Search: {
        page?: number
        query?: string
        lastSearch: { page?: number; query?: string }
    }
}>

function process_description(description: string) {
    const matches = description.matchAll(/\[\[[a-zA-Z0-9|\p{L}]*\]\]/gmu)
    let output = []
    let temp_last
    for (let match of matches) {
        console.log(match[0])
        const word = match[0].includes('|')
            ? match[0].split('|')[0].replace('[[', '')
            : match[0].replace('[[', '').replace(']]', '')
        console.log(word)
        console.log({ description: description, match: match[0] })
        const [before, _] = description.split(match[0])
        description = description.replace(before, '')
        console.log({ before })
        const after = description.replace(match[0], '')
        description = after
        output.push(before)
        output.push(
            <Link
                to={`/signs/phrase/${word}`}
                search={(old) => ({ ...old.lastSearch })}
            >
                {word.toLocaleLowerCase()}
            </Link>
        )
        temp_last = after
        // output.push(after)
    }
    output.push(temp_last)
    if (!output.length) {
        return description
    }
    console.log('process description\n', output)
    return output
}
function SignPage() {
    const {
        data: {
            // You can access any data merged in from parent loaders as well
            sign,
        },
    } = useMatch()

    const navigate = useNavigate()
    const search = useSearch<MyLocationGenerics>()
    // const [scroll, setScroll] = useState(0)
    useEffect(() => {
        setTimeout(() => {
            const scrollTarget = Number(search.scroll) ?? 0
            window.scrollTo({ top: scrollTarget })
        }, 100)
    }, [])
    useEffect(() => {
        const handleScroll = (event: any) => {
            // setScroll(window.scrollY)
            console.log(window.scrollY)
            navigate({
                search: (old) => ({
                    ...old,
                    scroll: window.scrollY,
                }),
                replace: true,
                fromCurrent: true,
            })
        }
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // if (!sign) {
    //     return <Navigate to={'/'} />
    // }

    return (
        <div className="sign" id={sign.sign_id}>
            {/* <button onClick={() => window.history.back()}>lalalalala</button> */}
            {/* <header>
                <Link to={'/'} className="heading">
                    <b>ÍTM</b>
                </Link>
            </header> */}
            {search.lastSearch && (
                <Link
                    className="temp-card"
                    style={{ width: 'fit-content' }}
                    to={'/signs'}
                    search={search.lastSearch}
                >
                    Til baka í leit{' '}
                    {search.lastSearch.query && (
                        <i>(„{search.lastSearch.query}“)</i>
                    )}
                </Link>
            )}
            <div>
                <div>
                    <h2 className="sign-phrase">{sign.phrase}</h2>
                    <YoutubeEmbed embedId={sign.videos[0]} />
                </div>
                <div className="sign-info card">
                    {sign.efnisflokkar && (
                        <div className="sign-info-item">
                            <h3>Efnisflokkar</h3>
                            {sign.efnisflokkar.map((efnisflokkur) => {
                                return (
                                    <div key={efnisflokkur}>
                                        <Link
                                            to={`/efnisflokkar/${efnisflokkur}`}
                                        >
                                            {efnisflokkur}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {sign.ordflokkur && (
                        <div className="sign-info-item">
                            <h3>Orðflokkur</h3>
                            <div>
                                <Link to={`/ordflokkar/${sign.ordflokkur}`}>
                                    {sign.ordflokkur}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.myndunarstadur && (
                        <div className="sign-info-item">
                            <h3>Myndunarstaður</h3>
                            <div>
                                <Link
                                    to={`/myndunarstadir/${sign.myndunarstadur}`}
                                >
                                    {sign.myndunarstadur}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.handform && (
                        <div className="sign-info-item">
                            <Link to={`/handform/${sign.handform}`}>
                                <h3>Handform</h3>
                                <img
                                    className="handform-img"
                                    src={`/itm-dev/assets/itm-images/handform/${sign.handform}.png`}
                                />
                                <div>{sign.handform}</div>
                            </Link>
                        </div>
                    )}
                    {sign.description && (
                        <div className="sign-info-item">
                            <h3>Lýsing</h3>
                            <div>{process_description(sign.description)}</div>
                        </div>
                    )}
                </div>
            </div>
            <div
                className={
                    sign.videos.length > 1 || sign.islenska || sign.taknmal
                        ? 'card'
                        : ''
                }
            >
                <div className="alternate-videos">
                    {sign.videos.slice(1).map((id) => {
                        return (
                            <div className="alternate-video" key={id}>
                                <YoutubeEmbed embedId={id} />
                            </div>
                        )
                    })}
                </div>
                <div className="flexrow">
                    {sign.islenska && (
                        <div className="sign-info-item">
                            <b>Íslenska</b>
                            <div>{sign.islenska}</div>
                        </div>
                    )}
                    {sign.taknmal && (
                        <div className="sign-info-item">
                            <b>Táknmál</b>
                            <div>{sign.taknmal}</div>
                        </div>
                    )}
                </div>
            </div>

            {sign.related_signs && (
                <div className="sign-info-item card center">
                    <div>
                        <b>Tengd tákn</b>
                    </div>
                    <div className="flexcol related-signs">
                        {sign.related_signs.map((related_sign) => {
                            return (
                                <Link
                                    key={related_sign.id}
                                    to={`/signs/${related_sign.id}`}
                                    search={(old) => ({ ...old })}
                                >
                                    <div className="card">
                                        {related_sign.phrase}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SignPage
