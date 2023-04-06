//@ts-nocheck
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { getSignById, query } from '../db'
import { YoutubeEmbed } from './YoutubeEmbed'
import './signpage.css'

function SignPage() {
    const params: any = useParams()
    const [signLoaded, setSignLoaded] = useState(false)
    const [sign, setSign] = useState<Sign>(undefined)
    const [infoBox, setInfoBox] = useState<object>(undefined)
    useEffect(() => {
        getSignById(params.id).then((sign) => {
            setSign(sign)
            setSignLoaded(true)
        })
    }, [signLoaded])

    if (!signLoaded) {
        return ''
    }

    return (
        <div className="sign" id={sign.sign_id}>
            <div>
                <div>
                    <h2 className="sign-phrase">{sign.phrase}</h2>
                    <YoutubeEmbed embedId={sign.youtube_ids[0]} />
                </div>
                <div className="sign-info">
                    {sign.efnisflokkar && (
                        <div className="sign-info-item">
                            <b>Efnisflokkar</b>
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
                            <b>Orðflokkur</b>
                            <div>
                                <Link to={`/ordflokkar/${sign.ordflokkur}`}>
                                    {sign.ordflokkur}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.myndunarstadur && (
                        <div className="sign-info-item">
                            <b>Myndunarstaður</b>
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
                            <b>Handform</b>
                            <div>
                                <Link to={`/handform/${sign.handform}`}>
                                    {sign.handform}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.description && (
                        <div className="sign-info-item">
                            <b>Lýsing</b>
                            <div>{sign.description}</div>
                        </div>
                    )}
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
            <div className="alternate-videos">
                {sign.youtube_ids.slice(1).map((id) => {
                    return (
                        <div className="alternate-video" key={id}>
                            <YoutubeEmbed embedId={id} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SignPage
