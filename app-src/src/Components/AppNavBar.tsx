import { Link } from '@tanstack/react-location'
import './AppNavBar.css'

function NavItem({
    route,
    icon,
    name,
}: {
    route: string
    icon: string
    name: string
}) {
    return (
        <Link className="nav-item" to={route}>
            <div className="material-symbols-outlined">{icon}</div>
            <div className="nav-text">{name}</div>
        </Link>
    )
}

export function AppNavBar({ type }: { type: 'mobile' | 'desktop' }) {
    return (
        <div className="nav-container">
            <nav
                className={type === 'mobile' ? 'app-navbar' : 'desktop-navbar'}
            >
                <NavItem route="/" icon="home" name="Heim" />
                <NavItem route="/signs" icon="sign_language" name="Öll tákn" />
                <NavItem route="/leit" icon="search" name="Leit" />
                <NavItem route="/collections" icon="list" name="Táknasöfn" />
                <NavItem
                    route="/settings"
                    icon="account_box"
                    name="Stillingar"
                />
            </nav>
        </div>
    )
}
