import { Link, MakeGenerics, useMatch } from '@tanstack/react-location'
import { DarkModeSwitch } from './DarkModeSwitch'

type UserGenerics = MakeGenerics<{
    LoaderData: {
        user?: {
            name: string
            id: number
            collections: [{ name: string; id: number }]
        }
    }
}>

export function SettingsPage() {
    const {
        data: {
            // You can access any data merged in from parent loaders as well
            user,
        },
    } = useMatch<UserGenerics>()

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

            <div className="">
                {user ? (
                    <div className="card">
                        <h1>{user.name}</h1>
                        {user.collections.map((collection) => {
                            return (
                                <div key={collection.id}>
                                    <b>{collection.name} </b>
                                    <i>{collection.id}</i>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    ''
                )}
                <input type="text" className="card" />
                {/* {userCollections.map((collection) => {
                    return (
                        <div className="card" key={collection.name}>
                            <h1>{collection.name}</h1>
                            <i>{collection.count} tákn</i>
                        </div>
                    )
                })} */}
            </div>
            <DarkModeSwitch />
        </>
    )
}
