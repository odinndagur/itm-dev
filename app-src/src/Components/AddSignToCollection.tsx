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
        <div style={{ zIndex: 500 }}>
            <div className="">
                <Listbox value={'nett'}>
                    <div className="">
                        <Listbox.Button
                            className=""
                            style={{
                                borderRadius: '10px',
                                backgroundColor: 'var(--secondary-color)',
                            }}
                        >
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
                                width: 'fit-content',

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
                                            transform: 'translateX(-100%)',
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
                                            // outline: '1px solid black',
                                            boxShadow: 'var(--card-box-shadow)',
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
