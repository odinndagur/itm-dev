import './Home.css'
import { Link } from 'react-router-dom'
import SignWikiCredits from './SignWikiCredits'
import { AppNavBar } from './AppNavBar'
function Home() {
    return (
        <div>
            <div className="home">
                <header>
                    <h1 className="heading">Íslenskt táknmál</h1>
                    {/* <nav className="navbar">
                        <Link to={'/signs'}>Öll tákn</Link>
                        <Link to={'/collections'}>Táknasöfn</Link>
                        <Link to={'/leit'}>Leit</Link>
                        <Link to={'/settings'}>Stillingar</Link>
                    </nav> */}
                </header>
                <div>
                    <img
                        src="/assets/images/manifest-icon-512.maskable.png"
                        alt=""
                    />
                </div>
                {/* <AppNavBar/> */}
            </div>

        </div>
    )
}

export default Home
