import { Link } from '@tanstack/react-location'
import { DarkModeSwitch } from './DarkModeSwitch'
export function SettingsPage() {
    return (
        <>
            <header>
                {/* <Link to={'/'}>
            <h1 className="heading">ÍTM</h1>
        </Link> */}
                {/* <h3>{collectionName}</h3> */}
                {/* <header> */}
                <Link
                    to={'/'}
                    search={(old) => ({ ...old, scroll: 0 })}
                    className="heading"
                >
                    <b>ÍTM</b>
                </Link>
            </header>

            <DarkModeSwitch />
        </>
    )
}
