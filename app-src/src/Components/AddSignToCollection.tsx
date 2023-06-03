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
                <Listbox value={'nett'}>
                    <div className="">
                        <Listbox.Button
                            className="button-17"
                            style={{
                                // borderRadius: '10px',
                                backgroundColor: 'var(--secondary-color)',
                                maxWidth: '2rem',
                            }}
                            onClick={(ev) => {
                                // ev.stopPropagation()
                                // return null
                            }}
                        >
                            <span className="material-icons">{icon}</span>
                        </Listbox.Button>
                        {/* <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        > */}
                        <Listbox.Options
                            style={{
                                position: 'absolute',
                                width: 'fit-content',
                                transform: 'translateX(-100%)',
                                zIndex: 9999,

                                // flexDirection: 'column',
                                // alignSelf: 'center',
                                // padding: '0 1rem 0 0',
                                // marginRight: '1rem',
                                // maxHeight: '40vh',
                                // overflowY: 'scroll',
                                // right: 0,
                                // backgroundColor: 'var(--background-color)',
                                // backgroundColor: 'blue',
                                cursor: 'pointer',
                            }}
                            // className="absolute max-h-60 overflow-auto rounded-md bg-white divide-y"
                        >
                            {collections
                                .filter((collection) => collection.id != 1)
                                .map((collection, collectionIdx) => (
                                    <Listbox.Option
                                        key={collection.id}
                                        style={{
                                            position: 'relative',
                                            // backgroundColor: 'red',
                                            width: '100%',

                                            // right: '50%',
                                            textAlign: 'center',
                                            backgroundColor:
                                                'var(--background-color)',

                                            borderBottom:
                                                collectionIdx !=
                                                collections.length - 2
                                                    ? '1px solid gray'
                                                    : undefined,
                                            padding: '0.8rem 0.8rem',
                                            // borderRadius: '10px',
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
                                                } else {
                                                    setIcon('error')
                                                }
                                            })
                                        }}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    onClick={() => {
                                                        addSignToCollection({
                                                            signId: id,
                                                            collectionId:
                                                                collection.id,
                                                        })
                                                        setIcon('check')
                                                    }}
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                    style={
                                                        {
                                                            // backgroundColor: 'red',
                                                        }
                                                    }
                                                >
                                                    {collection.name}
                                                </span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            <Listbox.Option
                                style={{
                                    position: 'relative',
                                    // backgroundColor: 'red',
                                    width: '100%',

                                    // right: '50%',
                                    textAlign: 'center',
                                    backgroundColor: 'var(--background-color)',

                                    padding: '0.8rem 0.8rem',
                                    outline: '1px solid var(--main-text-color)',
                                    boxShadow: 'var(--card-box-shadow)',
                                }}
                                value={'lol'}
                                // onClick={() => {
                                //     setIcon('rotate_right')
                                //     addSignToCollection({
                                //         signId: id,
                                //         collectionId: collection.id,
                                //     }).then((res) => {
                                //         if (res.status == 'OK') {
                                //             setIcon('check')
                                //         } else {
                                //             setIcon('error')
                                //         }
                                //     })
                                // }}
                            >
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
                            </Listbox.Option>
                        </Listbox.Options>
                        {/* </Transition> */}
                    </div>
                </Listbox>
            </div>
            <dialog
                style={{ border: '1px solid black', borderRadius: '10px' }}
                onClick={(ev) => {
                    const dialog = document.getElementById(
                        'new-collection-modal'
                    )
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
