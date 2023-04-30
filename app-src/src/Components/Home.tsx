import { Header } from './Header'
import './Home.css'
export function HomePage() {
    return (
        <div>
            <Header />
            <div className="home">
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
