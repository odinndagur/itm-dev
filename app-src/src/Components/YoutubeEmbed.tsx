import './YoutubeEmbed.css'
export const YoutubeEmbed = ({ embedId }: { embedId: string }) => (
    <div className="video-container" style={{ width: '100%', margin: 'auto' }}>
        <div className="video-responsive">
            <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/${embedId}?mute=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    </div>
)
