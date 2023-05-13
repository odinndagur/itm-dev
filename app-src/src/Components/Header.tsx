import { Link } from '@tanstack/react-location'
import { AppNavBar } from './AppNavBar'

export function Header({ children }: { children?: any }) {
    return (
        <header style={{ backgroundColor: 'var(--background-color)' }}>
            <Link
                to={'/'}
                search={(old) => ({ ...old, scroll: 0 })}
                className="heading"
            >
                <b>Íslenskt táknmál</b>
            </Link>
            <AppNavBar type="header" />
            {children}
        </header>
    )
}
