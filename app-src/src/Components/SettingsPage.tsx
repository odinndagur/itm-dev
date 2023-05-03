import { Link, MakeGenerics, useMatch } from '@tanstack/react-location'
import { DarkModeSwitch } from './DarkModeSwitch'
import { AppNavBar } from './AppNavBar'
import { Header } from './Header'

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
            <Header></Header>

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
            </div>
        </>
    )
}
