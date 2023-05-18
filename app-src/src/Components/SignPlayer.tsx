import YouTube from 'react-youtube'
import './SignPlayer.css'
import { useState } from 'react'

export function SignPlayer(props: any) {
    const [playerReady, setPlayerReady] = useState(false)
    const [playerReadyCount, setPlayerReadyCount] = useState(0)
    const opts = {
        // height: '390',
        // width: '640',
        width: '853',
        height: '480',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            modestbranding: 1,
            mute: 1,
            rel: 0,
            loop: 1,
            playlist: props.videoId,
            playsinline: 0,
            controls: 0,
            // origin: 'https://odinndagur.github.io/itm-dev/',
            origin: window.location.pathname,
        },
    }
    return (
        <>
            <div
                className="video-container"
                // style={{ visibility: playerReady ? undefined : 'hidden' }}
                key={playerReady ? 'playerReady' : 'playerNotReady'}
            >
                <div className="video-responsive" style={{}}>
                    <YouTube
                        // className="video-responsive"
                        iframeClassName="video-responsive"
                        {...props}
                        opts={opts}
                        onReady={() => {
                            setPlayerReady(true)
                            setPlayerReadyCount((count) => count + 1)
                        }}
                        onError={() => console.log('ERROR')}
                        style={{ display: playerReady ? undefined : 'none' }}
                    />
                    <img
                        src={`https://i.ytimg.com/vi/${props.videoId}/maxresdefault.jpg`}
                        alt={`Myndband sem sýnir táknið ${props.title}`}
                        style={{
                            objectFit: 'cover',
                            display: playerReadyCount >= 2 ? 'none' : undefined,
                        }}
                    />
                </div>
            </div>
        </>
    )
}
// ?mute=1&rel=0&loop=1&playlist=${embedId}&controls=0&playsinline=0&modestbranding=1&origin=https://odinndagur.github.io/itm-dev/
