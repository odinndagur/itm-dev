import {
    useMatch,
    MakeGenerics,
    Navigate,
    useNavigate,
    Link,
} from '@tanstack/react-location'
import { Header } from './Header'
import { FormEvent, useState } from 'react'
import { createCollection, getUserById } from '../db'
import { useQuery } from '@tanstack/react-query'
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
    const [collectionsKey, setCollectionsKey] = useState(0)
    const navigate = useNavigate()
    function handleSubmit(ev: FormEvent) {
        ev.preventDefault()
        const newCollectionName = ev.target.elements.name.value
        if (!newCollectionName) {
            return
        }
        createCollection({
            userId: user!.id,
            collectionName: newCollectionName,
        })
        setCollectionsKey(collectionsKey + 1)
        console.log(ev.target.elements.name.value)
    }
    const {
        data: { user },
    } = useMatch<UserGenerics>()

    const { data, isPlaceholderData, isLoading, isError } = useQuery({
        queryKey: ['collections', collectionsKey ?? null],
        queryFn: () => getUserById(user!.id),
        keepPreviousData: true,
    })

    if (isLoading) {
        return ''
    }
    if (isError) {
        return 'Error.'
    }
    return (
        <>
            <Header></Header>
            <div className="">
                <h1>{data?.name}</h1>
                <ul className="">
                    {data?.collections.map((collection) => {
                        return (
                            <Link
                                className="card"
                                to={'/collection'}
                                search={(old) => ({
                                    ...old,
                                    scroll: 0,
                                    id: collection.id,
                                })}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <li key={collection.id}>
                                    <div>{collection.name}</div>
                                    {/* <div>{collection[key]}</div> */}
                                </li>
                            </Link>
                        )
                        {
                            /* {Object.keys(collection).map((key) => {
                                    return (
                                        <Link
                                            to={'/collection'}
                                            search={(old) => ({
                                                ...old,
                                                scroll: 0,
                                                id: collection.id,
                                            })}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <div>{key}</div>
                                            <div>{collection[key]}</div>
                                        </Link>
                                    )
                                })} */
                        }
                        {
                            /* <div className="card">{collection.name}</div> */
                        }
                    })}
                </ul>
            </div>
            <form className="pad card" onSubmit={handleSubmit}>
                <label htmlFor="">
                    Nýtt táknasafn{' '}
                    <input type="text" name="" id="name" placeholder="Nafn" />
                </label>
                <button type="submit">Staðfesta</button>
            </form>
        </>
    )
}
