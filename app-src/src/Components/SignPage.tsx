//@ts-nocheck
import {
    Link,
    useMatch,
    useNavigate,
    MakeGenerics,
    useLocation,
} from '@tanstack/react-location'
import { YoutubeEmbed } from './YoutubeEmbed'
import './signpage.css'
import { useEffect } from 'react'
function SignPage() {
    const {
        data: {
            // You can access any data merged in from parent loaders as well
            sign,
        },
    } = useMatch()

    if (!sign) {
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
                        <div className="sign-info-item card">
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
                        <div className="sign-info-item card">
                            <b>Orðflokkur</b>
                            <div>
                                <Link to={`/ordflokkar/${sign.ordflokkur}`}>
                                    {sign.ordflokkur}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.myndunarstadur && (
                        <div className="sign-info-item card">
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
                        <div className="sign-info-item card">
                            <b>Handform</b>
                            <div>
                                <Link to={`/handform/${sign.handform}`}>
                                    {sign.handform}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.description && (
                        <div className="sign-info-item card">
                            <b>Lýsing</b>
                            <div>{sign.description}</div>
                        </div>
                    )}
                    {sign.related_signs && (
                        <div className="sign-info-item card">
                            <b>Tengd tákn</b>
                            {sign.related_signs.map((related_sign) => {
                                return (
                                    <div key={related_sign.id}>
                                        <Link to={`/signs/${related_sign.id}`}>
                                            {related_sign.phrase}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className="alternate-videos">
                {sign.islenska && (
                    <div className="sign-info-item card">
                        <b>Íslenska</b>
                        <div>{sign.islenska}</div>
                    </div>
                )}
                {sign.taknmal && (
                    <div className="sign-info-item card">
                        <b>Táknmál</b>
                        <div>{sign.taknmal}</div>
                    </div>
                )}
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
