import { Link, NavLink } from "react-router-dom";
import './AppNavBar.css'

function NavItem({route,icon,name}:{route:string,icon:string,name:string}){
    return (
      <NavLink className="nav-item" to={route} style={({ isActive, isPending }) => {
          return {
            fontWeight: isActive ? "bold" : "",
            color: isPending ? "red" : "black",
          };
      }}>
        <div className="material-symbols-outlined">{icon}</div>
        <div className="nav-text">{name}</div>
      </NavLink>
    )
}

export function AppNavBar() {
    return (
        <footer className="footer">
            <nav>
              <NavItem route="/" icon="home" name="Heim"/>
              <NavItem route="/signs" icon="sign_language" name="Öll tákn"/>
              <NavItem route="/leit" icon="search" name="Leit"/>
              <NavItem route="/collections" icon="list" name="Táknasöfn"/>
              <NavItem route="/settings" icon="account_box" name="Stillingar"/>
            </nav>
        </footer>
    )
}