import { Link } from "react-router-dom";
import './AppNavBar.css'

export function AppNavBar() {
    return (
        <footer className="footer">
            <nav>
                <Link className="nav-item" to="/"><span className="material-symbols-outlined">home</span><span className="nav-text">Heim</span></Link>
                <Link className="nav-item" to="/signs"><span className="material-symbols-outlined">sign_language</span><span className="nav-text">Öll tákn</span></Link>
                <Link className="nav-item" to="/leit"><span className="material-symbols-outlined">search</span><span className="nav-text">Leit</span></Link>
                <Link className="nav-item" to="/collections"><span className="material-symbols-outlined">list</span><span className="nav-text">Táknasöfn</span></Link>
                <Link className="nav-item" to="/settings"><span className="material-symbols-outlined">account_box</span><span className="nav-text">Stillingar</span></Link>
            </nav>
        </footer>
    )
}