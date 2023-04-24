import { Link, useMatch } from '@tanstack/react-location'
import { DarkModeSwitch } from './DarkModeSwitch'
export function SettingsPage() {
    const userCollections = [
        { name: 'nett tákn', count: 100 },
        { name: 'sponson', count: 25 },
    ]
    const {
        data: {
            // You can access any data merged in from parent loaders as well
            user,
        },
    } = useMatch()

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

            <div className="center pad">
                {user && <h1>{user.name}</h1>}
                {userCollections.map((collection) => {
                    return (
                        <div className="card" key={collection.name}>
                            <h1>{collection.name}</h1>
                            <i>{collection.count} tákn</i>
                        </div>
                    )
                })}
            </div>
            <DarkModeSwitch />
        </>
    )
}
