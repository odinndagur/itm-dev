import { Button } from '@mui/material'
import { Add } from '@mui/icons-material'
import { YoutubeEmbed } from './YoutubeEmbed'
import { useState } from 'react'

function Sign({ sign }: { sign: Sign }) {
    const [youtubeShowing, setYoutubeShowing] = useState(false)
    function showYt() {
        console.log('showyoutube')
        setYoutubeShowing(!youtubeShowing)
    }

    return (
        <div
            style={{
                display: 'flex',
                // justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 2rem',
                // maxWidth: '500px',
            }}
        >
            <div>
                <Button
                    onClick={() => {
                        window.promiseWorker.postMessage({
                            type: 'addToDefaultUserCollection',
                            query: sign.id,
                        })
                    }}
                    variant="outlined"
                    size="small"
                    sx={{}}
                >
                    <Add />
                </Button>
            </div>
            <div style={{ paddingLeft: '2rem' }}>{sign.phrase}</div>
        </div>

        // <div className="sign" onClick={() => showYt()} id={sign.id}>
        //     <div className="sign-phrase">
        //         <span>{sign.phrase}</span>
        //     </div>

        //     {youtubeShowing && <YoutubeEmbed embedId={sign.youtube_id} />}
        // </div>
    )
}

export default Sign
