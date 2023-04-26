import { useMatch, MakeGenerics } from '@tanstack/react-location'
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

export function CollectionsPage() {
    const {
        data: { user },
    } = useMatch<UserGenerics>()
    return (
        <>
            <Header></Header>
            <div className="card">
                <h1>{user?.name}</h1>
                <ul className="">
                    {user?.collections.map((collection) => {
                        return <li key={collection.id}>{collection.name}</li>
                    })}
                </ul>
            </div>
            <div className="pad card">
                <label htmlFor="">
                    Nýtt táknasafn{' '}
                    <input type="text" name="" id="" placeholder="Nafn" />
                </label>
            </div>
        </>
    )
}
