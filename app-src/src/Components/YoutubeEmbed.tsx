import './YoutubeEmbed.css'
export const YoutubeEmbed = ({ embedId }: { embedId: string }) => (
    <div className="video-container" style={{ width: '100%', margin: 'auto' }}>
        <div className="video-responsive">
            <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/${embedId}?mute=1&rel=0&loop=1&playlist=${embedId}&controls=0&playsinline=0&modestbranding=1&origin=https://odinndagur.github.io/itm-dev/`}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    </div>
)
