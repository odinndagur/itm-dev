import { Link, NavLink } from "react-router-dom";
import './AppNavBar.css'

export function AppNavBar() {
    return (
        <footer className="footer">
            <nav>
                <NavLink className="nav-item" to="/" style={({ isActive, isPending }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
    };
  }}>
                    <div className="material-symbols-outlined">home</div>
                    <div className="nav-text">Heim</div>
                </NavLink>
                <NavLink className="nav-item" to="/signs" style={({ isActive, isPending }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
    };
  }}>
                    <div className="material-symbols-outlined">sign_language</div>
                    <div className="nav-text">Öll tákn</div>
                </NavLink>
                <NavLink className="nav-item" to="/leit" style={({ isActive, isPending }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
    };
  }}>
                    <div className="material-symbols-outlined">search</div>
                    <div className="nav-text">Leit</div>
                </NavLink>
                <NavLink className="nav-item" to="/collections" style={({ isActive, isPending }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
    };
  }}>
                    <div className="material-symbols-outlined">list</div>
                    <div className="nav-text">Táknasöfn</div>
                </NavLink>
                <NavLink className="nav-item" to="/settings" style={({ isActive, isPending }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
    };
  }}>
                    <div className="material-symbols-outlined">account_box</div>
                    <div className="nav-text">Stillingar</div>
                </NavLink>
            </nav>
        </footer>
    )
}