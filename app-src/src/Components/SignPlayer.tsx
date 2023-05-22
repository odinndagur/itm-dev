import YouTube from 'react-youtube'
import './SignPlayer.css'
import { useEffect, useState } from 'react'

const isSafari =
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1

export function SignPlayer(props: any) {
    const playVideo = () => {
        if (target) {
            target.playVideo()
        } else {
            setTimeout(() => {
                playVideo()
            }, 50)
        }
    }

    const [playerReady, setPlayerReady] = useState(false)
    const [playerReadyCount, setPlayerReadyCount] = useState(0)
    const [showThumbnail, setShowThumbnail] = useState(true)
    const [target, setTarget] = useState()

    const hiResUrl = `https://i.ytimg.com/vi/${props.videoId}/maxresdefault.jpg`
    const mdResUrl = `https://i.ytimg.com/vi/${props.videoId}/mqdefault.jpg`
    const altUrl = `https://img.youtube.com/vi/${props.videoId}/hqdefault.jpg`
    const [thumbnailUrl, setThumbnailUrl] = useState(hiResUrl)

    // src={`https://i.ytimg.com/vi/${props.videoId}/maxresdefault.jpg`}
    // src={`https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`}

    const opts = {
        // height: '390',
        // width: '640',
        width: '853',
        height: '480',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: isSafari ? 0 : 1,
            modestbranding: 1,
            mute: 1,
            rel: 0,
            loop: 1,
            playlist: props.videoId,
            // playsinline: isSafari ? 0 : 1,
            controls: 1,
            // fullscreen: 1,
            // origin: 'https://odinndagur.github.io/itm-dev/',
            origin: window.location.pathname,
        },
    }
    return (
        <>
            {/* {target && (
                <button onClick={() => target.playVideo()}>Play?</button>
            )}
            {target && (
                <button onClick={() => target.pauseVideo()}>Pause?</button>
            )} */}
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
                        onReady={(ev) => {
                            setTarget(ev.target)
                            setPlayerReady(true)
                            setPlayerReadyCount((count) => count + 1)
                        }}
                        onError={() => console.log('ERROR')}
                        style={{
                            visibility: showThumbnail ? 'hidden' : undefined,
                        }}
                    />
                    <img
                        src={thumbnailUrl}
                        // src={`https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`}
                        alt={`Myndband sem sýnir táknið ${props.title}`}
                        // onError={(ev) => (ev.target.src = altUrl)}

                        onLoadCapture={(ev) => {
                            if (ev.currentTarget.naturalHeight <= 90) {
                                setThumbnailUrl(altUrl)
                            } else {
                                setShowThumbnail(true)
                            }
                            // console.log('naturalwidth', ev.target.naturalHeight)
                        }}
                        onClick={() => {
                            if (isSafari) {
                                target.playVideo()
                                setShowThumbnail(false)
                            } else {
                                setShowThumbnail(false)
                                target.playVideo()
                            }
                        }}
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            // display: playerReadyCount >= 2 ? 'none' : undefined,
                            display: showThumbnail ? undefined : 'none',
                        }}
                    />
                </div>
            </div>
        </>
    )
}
// ?mute=1&rel=0&loop=1&playlist=${embedId}&controls=0&playsinline=0&modestbranding=1&origin=https://odinndagur.github.io/itm-dev/
