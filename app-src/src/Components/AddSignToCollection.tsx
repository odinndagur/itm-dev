import { Listbox } from '@headlessui/react'
import { addSignToCollection } from '../db'
export function AddSignToCollection({
    id,
    collections,
}: {
    id: number
    collections: { id: number; name: string }[]
}) {
    return (
        <div>
            <div className="">
                <Listbox value={'nett'}>
                    <div className="">
                        <Listbox.Button className="">
                            <span className="material-icons">add</span>
                        </Listbox.Button>
                        {/* <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        > */}
                        <Listbox.Options
                            style={{
                                position: 'absolute',
                                maxHeight: '60%',
                                width: 'fit-content',
                                backgroundColor: 'var(--background-color)',
                                cursor: 'pointer',
                            }}
                            // className="absolute max-h-60 overflow-auto rounded-md bg-white divide-y"
                        >
                            {collections.map((collection, collectionIdx) => (
                                <Listbox.Option
                                    key={collection.id}
                                    style={{
                                        position: 'relative',
                                        right: '50%',
                                        textAlign: 'center',
                                        backgroundColor:
                                            'var(--background-color)',
                                        borderBottom: '1px solid gray',
                                        padding: '0.5rem 0.5rem',
                                    }}
                                    value={collection.id}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                onClick={() =>
                                                    addSignToCollection({
                                                        signId: id,
                                                        collectionId:
                                                            collection.id,
                                                    })
                                                }
                                                className={`block truncate ${
                                                    selected
                                                        ? 'font-medium'
                                                        : 'font-normal'
                                                }`}
                                            >
                                                {collection.name}
                                            </span>
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                        {/* </Transition> */}
                    </div>
                </Listbox>
            </div>
        </div>
    )
}
