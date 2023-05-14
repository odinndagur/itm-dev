import { Link, useNavigate } from '@tanstack/react-location'
import { AddSignToCollection } from './AddSignToCollection'
import { deleteSignFromCollection } from '../db'
import { useQueryClient } from '@tanstack/react-query'

export function SignCollectionItem({
    sign,
    user,
    currentCollection,
    queryKey,
}) {
    const queryClient = useQueryClient()

    return (
        <div
            draggable
            style={{
                margin: 'auto',
                // width: '100vw',
                // height: 'max-content',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
            className="card"
            key={sign.sign_id}
        >
            <Link
                draggable
                to={`/itm-dev/signs/${sign.sign_id}`}
                search={(search) => ({
                    lastSearch: {
                        ...search,
                    },
                    scroll: 0,
                })}
                style={{
                    // border: '1px solid red',
                    minHeight: '2rem',
                    flexGrow: 1,
                }}
            >
                {/* <div
            className=""
            style={{
                border: '1px solid red',
                flexGrow: 1,
            }}
        > */}
                <b>{sign.phrase}</b>
                <div>
                    <i>
                        {sign.related_signs
                            ? sign.related_signs.split(',').join(', ')
                            : sign.related_signs}
                    </i>
                </div>
                {/* </div> */}
            </Link>
            <div>
                <div>
                    <AddSignToCollection
                        id={sign.sign_id}
                        collections={user.collections}
                    />

                    {currentCollection != 1 && (
                        <button
                            className=""
                            style={{
                                zIndex: 3,
                                borderRadius: '10px',
                                backgroundColor: 'rgba(255,0,0,0.8)',
                            }}
                            onClick={() => {
                                console.log('deleting sign')
                                deleteSignFromCollection({
                                    signId: sign.sign_id,
                                    collectionId: currentCollection,
                                })
                                queryClient.invalidateQueries(queryKey)
                            }}
                        >
                            <span className="material-icons">remove</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
