import YouTube from 'react-youtube'
import './YoutubeEmbed.css'
import { useState } from 'react'

export function SignPlayer(props: any) {
    const [playerReady, setPlayerReady] = useState(false)
    const opts = {
        // height: '390',
        // width: '640',
        width: '853',
        height: '480',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            modestbranding: 1,
            mute: 1,
            rel: 0,
            loop: 1,
            playlist: props.videoId,
            playsinline: 0,
            controls: 0,
            // origin: 'https://odinndagur.github.io/itm-dev/',
        },
    }
    return (
        <div
            className="video-container"
            style={{ visibility: playerReady ? undefined : 'hidden' }}
        >
            <YouTube
                className="video-responsive"
                iframeClassName="video-responsive"
                {...props}
                opts={opts}
                onReady={() => setPlayerReady(true)}
                style={{ visibility: playerReady ? undefined : 'hidden' }}
            />
        </div>
    )
}
// ?mute=1&rel=0&loop=1&playlist=${embedId}&controls=0&playsinline=0&modestbranding=1&origin=https://odinndagur.github.io/itm-dev/
