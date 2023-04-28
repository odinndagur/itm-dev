import './Home.css'
export function HomePage() {
    return (
        <div>
            <div className="home">
                <header>
                    <h1 className="heading">Íslenskt táknmál</h1>
                </header>
                <div>
                    <img
                        src="/assets/images/manifest-icon-512.maskable.png"
                        alt=""
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <div className="card">lol</div>
                    <div className="card">nett</div>
                    <div className="card">yo</div>
                    <div className="card">what</div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
