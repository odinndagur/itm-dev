//@ts-nocheck
import { useState } from 'react'
import { useParams } from 'react-router'
import { getSignById } from './db'
import { YoutubeEmbed } from './YoutubeEmbed'
import './signpage.css'

function SignPage() {
    const params: any = useParams()
    const [signLoaded, setSignLoaded] = useState(false)
    const [sign, setSign] = useState<Sign>(undefined)
    getSignById(params.id).then((sign) => {
        setSign(sign)
        setSignLoaded(true)
    })

    return signLoaded ? (
        <div className="sign" id={sign.sign_id}>
            <div>
                <YoutubeEmbed embedId={sign.youtube_id} />
            </div>
            <div className="sign-phrase">
                <span>{sign.phrase}</span>
            </div>
        </div>
    ) : (
        ''
    )
}

export default SignPage
