import { Link } from '@tanstack/react-location'
import './AppNavBar.css'

function NavItem({
    route,
    icon,
    name,
    type,
}: {
    route: string
    icon: string
    name: string
    type: 'mobile' | 'desktop'
}) {
    return (
        <Link
            className={'nav-item nav-item-' + type}
            to={route}
            getActiveProps={() => ({
                style: { fontWeight: 'bold' },
            })}
        >
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
                <NavItem route="/" icon="home" name="Heim" type={type} />
                <NavItem
                    route="/signs"
                    icon="sign_language"
                    name="Öll tákn"
                    type={type}
                />
                <NavItem route="/leit" icon="search" name="Leit" type={type} />
                <NavItem
                    route="/collections"
                    icon="list"
                    name="Táknasöfn"
                    type={type}
                />
                <NavItem
                    route="/settings"
                    icon="account_box"
                    name="Stillingar"
                    type={type}
                />
            </nav>
        </div>
    )
}
