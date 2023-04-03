//@ts-nocheck
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getSignById } from './db'
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
            <div className="sign-phrase">
                <h2>{sign.phrase}</h2>
            </div>
            <div>
                <YoutubeEmbed embedId={sign.youtube_ids[0]}/>
            </div>
            <div className='sign-info'>
                {sign.efnisflokkar && (
                <div className='sign-item'>
                    <b>Efnisflokkar</b>
                    {sign.efnisflokkar.map(efnisflokkur => {
                        return <div key={efnisflokkur}>{efnisflokkur}</div>
                    })}
                </div>
                )}
                {sign.ordflokkur && (
                <div className='sign-item'>
                    <b>Orðflokkur</b>
                        <div>{sign.ordflokkur}</div>
                </div>
                )}
                {sign.myndunarstadur && (
                <div className='sign-item'>
                    <b>Myndunarstaður</b>
                        <div>{sign.myndunarstadur}</div>
                </div>
                )}
                {sign.handform && (
                <div className='sign-item'>
                    <b>Handform</b>
                        <div>{sign.handform}</div>
                </div>
                )}
            </div>
            <div className="alternate-videos">
                {sign.youtube_ids.slice(1).map((id) => {
                    return <div className="alternate-video" key={id}><YoutubeEmbed embedId={id}/></div>
                })}
            </div>
        </div>
    )
}

export default SignPage
