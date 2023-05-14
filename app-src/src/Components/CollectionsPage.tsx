import {
    useMatch,
    MakeGenerics,
    Navigate,
    useNavigate,
    Link,
} from '@tanstack/react-location'
import { Header } from './Header'
import { FormEvent, useState } from 'react'
import { createCollection, deleteCollection, getUserById } from '../db'
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
        console.log(ev)
        ev.preventDefault()
        //@ts-ignore
        const newCollectionName = ev.target.elements.name.value
        //@ts-ignore
        ev.target.elements.name.value = ''
        if (!newCollectionName) {
            return
        }
        createCollection({
            userId: user!.id,
            collectionName: newCollectionName,
        })
        setCollectionsKey(collectionsKey + 1)
        //@ts-ignore
        console.log(ev.target.elements.name.value)
    }

    function handleDeleteCollection(id: number) {
        deleteCollection({ collectionId: id })
        setCollectionsKey(collectionsKey + 1)
    }

    const {
        data: { user },
    } = useMatch<UserGenerics>()

    const { data, isPlaceholderData, isLoading, isError } = useQuery({
        queryKey: ['collections', collectionsKey ?? null, collectionsKey],
        queryFn: () => getUserById(user!.id),
        keepPreviousData: true,
        staleTime: 0,
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
            <div className="temp-card" key={collectionsKey}>
                <h1>{data?.name}</h1>
                <ul className="">
                    {data?.collections
                        ?.filter((collection) => collection.id != 1)
                        .map((collection) => {
                            return (
                                collection.id && (
                                    <li
                                        key={collection.id}
                                        className="card"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Link
                                            to={'/collection'}
                                            search={(old) => ({
                                                ...old,
                                                scroll: 0,
                                                id: collection.id,
                                            })}
                                            style={{
                                                display: 'flex',
                                                flexGrow: 1,
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <div>{collection.name}</div>
                                            {/* <div>{collection[key]}</div> */}
                                        </Link>
                                        <button
                                            style={{
                                                display: 'flex',
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '10px',
                                            }}
                                            onClick={() =>
                                                handleDeleteCollection(
                                                    collection.id
                                                )
                                            }
                                        >
                                            <span
                                                className="material-icons"
                                                style={{
                                                    color: 'var(--accent-color)',
                                                }}
                                            >
                                                delete
                                            </span>
                                            <span
                                                style={{
                                                    alignSelf: 'center',
                                                }}
                                            >
                                                Eyða
                                            </span>
                                        </button>
                                    </li>
                                )
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
            <form className="card" onSubmit={handleSubmit}>
                <label htmlFor="">
                    <h3>Nýtt táknasafn</h3>
                    <input
                        type="text"
                        name=""
                        id="name"
                        placeholder="Nafn"
                        style={{ minWidth: '50%' }}
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        borderRadius: '10px',
                        fontSize: '1rem',
                        padding: '0.5rem',
                        margin: '0 0.5rem',
                    }}
                >
                    Staðfesta
                </button>
            </form>
        </>
    )
}
