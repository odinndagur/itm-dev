import { Listbox } from '@headlessui/react'
import { Link, useNavigate } from '@tanstack/react-location'

export function SelectCollection({ currentCollection, collections }) {
    const navigate = useNavigate()
    return (
        <div style={{ zIndex: 50 }}>
            <Listbox value={currentCollection}>
                <Listbox.Button
                    className=""
                    as="div"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {currentCollection && <h2>{currentCollection}</h2>}
                </Listbox.Button>
                <Listbox.Options
                    style={{
                        // position: 'absolute',
                        width: 'fit-content',
                        margin: 'auto',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                >
                    {collections.map((collection) => (
                        <Listbox.Option
                            key={collection.id}
                            style={{
                                position: 'relative',
                                textAlign: 'center',
                                backgroundColor: 'var(--background-color)',
                                borderBottom: '1px solid gray',
                                padding: '0.5rem 0.5rem',
                            }}
                            value={collection.id}
                            onClick={() => {
                                navigate({
                                    search: (search) => ({
                                        ...search,
                                        id: collection.id,
                                        scroll: 0,
                                    }),
                                })
                            }}
                        >
                            {({ selected }) => (
                                <>
                                    <span>{collection.name}</span>
                                </>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
                {/* </Transition> */}
            </Listbox>
        </div>
    )
}

{
    /* <div>
collections to select
{currentCollection && <h1>{currentCollection}</h1>}
{collections?.map((collection) => {
    return (
        <Link
            to={`/collection`}
            search={(search) => ({
                // lastSearch: {
                //     ...search,
                // },
                scroll: 0,
                id: collection.id,
            })}
        >
            {collection.name}
        </Link>
    )
})}
</div> */
}
