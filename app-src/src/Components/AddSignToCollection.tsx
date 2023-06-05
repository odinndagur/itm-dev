import { Listbox } from '@headlessui/react'
import { addSignToCollection, createCollection } from '../db'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-location'
export function AddSignToCollection({
    id,
    collections,
    zIndex,
}: {
    id: number
    collections: { id: number; name: string }[]
    zIndex?: number
}) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [icon, setIcon] = useState('add')
    return (
        <div style={{ zIndex: zIndex ?? undefined }}>
            <div className="">
                <Listbox>
                    <div className="">
                        <Listbox.Button
                            style={{
                                maxWidth: '2rem',
                            }}
                        >
                            <span className="material-icons">{icon}</span>
                        </Listbox.Button>
                        <Listbox.Options
                            style={{
                                position: 'absolute',
                                width: 'fit-content',
                                transform: 'translateX(-100%)',
                                zIndex: 9999,
                                cursor: 'pointer',
                            }}
                        >
                            {collections
                                .filter((collection) => collection.id != 1)
                                .map((collection, collectionIdx) => (
                                    <Listbox.Option
                                        key={collection.id}
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            textAlign: 'center',
                                            backgroundColor:
                                                'var(--background-color)',

                                            borderBottom:
                                                collectionIdx !=
                                                collections.length - 2
                                                    ? '1px solid gray'
                                                    : undefined,
                                            padding: '0.8rem 0.8rem',
                                            outline:
                                                '1px solid var(--main-text-color)',
                                            boxShadow: 'var(--card-box-shadow)',
                                        }}
                                        value={collection.id}
                                        onClick={() => {
                                            setIcon('rotate_right')
                                            addSignToCollection({
                                                signId: id,
                                                collectionId: collection.id,
                                            }).then((res) => {
                                                if (res.status == 'OK') {
                                                    setIcon('check')
                                                    // setTimeout(() => {
                                                    //     setIcon('add')
                                                    // }, 5000)
                                                } else {
                                                    setIcon('error')
                                                }
                                            })
                                        }}
                                    >
                                        {collection.name}
                                    </Listbox.Option>
                                ))}
                            {/* <Listbox.Option value={'lol'}>
                                {({ selected }) => (
                                    <>
                                        <span
                                            onClick={() => {
                                                const el =
                                                    document.getElementById(
                                                        'new-collection-modal'
                                                    )
                                                el!.showModal()
                                            }}
                                        >
                                            Nýtt táknasafn
                                        </span>
                                    </>
                                )}
                            </Listbox.Option> */}
                        </Listbox.Options>
                    </div>
                </Listbox>
            </div>
            <dialog
                style={{ border: '1px solid black', borderRadius: '10px' }}
                onClick={(ev) => {
                    const dialog = document.getElementById(
                        'new-collection-modal'
                    ) as HTMLDialogElement
                    if (ev.target == dialog) {
                        dialog.close()
                    }
                }}
                id="new-collection-modal"
            >
                <form method="dialog">
                    <button>x</button>
                </form>
                <h3>Nýtt táknasafn</h3>
                <form
                    onSubmit={(ev) => {
                        createCollection({
                            userId: 3,
                            collectionName: ev.currentTarget.name.value,
                        })
                        navigate({ search: (old) => ({ ...old }) })

                        // queryClient.invalidateQueries()
                        // queryClient.invalidateQueries({
                        //     queryKey: ['user'],
                        // })
                        // ev.preventDefault()
                        // console.log('form!', ev.currentTarget.name.value)
                    }}
                >
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Nafn"
                    />
                    <button type="submit">Staðfesta</button>
                </form>
            </dialog>
        </div>
    )
}
