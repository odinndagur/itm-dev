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
                <span>{sign.phrase}</span>
            </div>
            <div>
                <YoutubeEmbed embedId={sign.youtube_ids[0]}/>
            </div>
            <div className="alternate-videos">
                {sign.youtube_ids.slice(1).map((id) => {
                    return <div className="alternate-video"><YoutubeEmbed embedId={id} key={id}/></div>
                })}
            </div>
        </div>
    )
}

export default SignPage
