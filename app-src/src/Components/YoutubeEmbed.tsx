import { useEffect } from 'react'
import './YoutubeEmbed.css'
export const YoutubeEmbed = ({
    embedId,
    title,
}: {
    embedId: string
    title?: string
}) => {
    useEffect(() => {
        fetch(
            `http://www.youtube.com/embed/${embedId}?mute=1&rel=0&loop=1&playlist=${embedId}&controls=0&playsinline=0&modestbranding=1&origin=https://odinndagur.github.io/itm-dev/`,
            { mode: 'no-cors' }
        )
    }, [])
    return (
        <div
            className="video-container"
            style={{ width: '100%', margin: 'auto' }}
        >
            <div className="video-responsive">
                <iframe
                    width="853"
                    height="480"
                    src={`https://www.youtube.com/embed/${embedId}?mute=1&rel=0&loop=1&playlist=${embedId}&controls=0&playsinline=0&modestbranding=1&origin=https://odinndagur.github.io/itm-dev/`}
                    // srcDoc={`
                    // <style>
                    //     * {
                    //         padding:0;
                    //         margin:0;
                    //         overflow:hidden
                    //     }
                    //     html,body {
                    //         height:100%
                    //     }
                    //     img,span {
                    //         position:absolute;
                    //         width:100%;
                    //         top:0;
                    //         bottom:0;
                    //         margin:auto
                    //     }
                    //     span {
                    //         height:1.5em;
                    //         text-align:center;
                    //         font:48px/1.5 sans-serif;
                    //         color:white;
                    //         text-shadow:0 0 0.5em black
                    //     }
                    //     </style>
                    //     <a onclick="window.location.replace(this.href); return false" href='https://www.youtube.com/embed/${embedId}?mute=1&autoplay=1&rel=0&loop=1&playlist=${embedId}&controls=0&playsinline=0&modestbranding=1&origin=https://odinndagur.github.io/itm-dev'/>
                    //     <img style='left: 1rem;
                    //     top: 0;
                    //     height: calc(100% - 2rem);
                    //     width: calc(100% - 2rem);
                    //     object-fit:cover;
                    //     /* padding: 0.5rem; */
                    //     position: absolute;
                    //     border-radius: 10px;' src=https://img.youtube.com/vi/${embedId}/hqdefault.jpg alt='${title}'/><span>▶</span></a>`}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title="Embedded youtube"
                />
            </div>
        </div>
    )
}
