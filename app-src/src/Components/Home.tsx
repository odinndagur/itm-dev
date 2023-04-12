import './Home.css'
import { Link } from 'react-router-dom'
function Home() {
    return (
        <div className="home">
            <header>
                <h1 className="heading">Íslenskt táknmál</h1>
                <nav className="navbar">
                    <Link to={'/signs'}>Öll tákn</Link>
                    <Link to={'/collections'}>Táknasöfn</Link>
                    <Link to={'/leit'}>Leit</Link>
                    <Link to={'/settings'}>Stillingar</Link>
                </nav>
            </header>
            <div>
                <img
                    src="/assets/images/manifest-icon-512.maskable.png"
                    alt=""
                />
            </div>
            <footer>
                <p>
                    Öll gögn frá{' '}
                    <a href="https://is.signwiki.org/index.php/Forsíða">
                        is.signwiki.org
                    </a>
                </p>
                <p>Óðinn Dagur Bjarnason</p>
            </footer>
        </div>
    )
}

export default Home
