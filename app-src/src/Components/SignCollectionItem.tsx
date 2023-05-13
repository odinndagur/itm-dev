import { Link } from '@tanstack/react-location'
import { AddSignToCollection } from './AddSignToCollection'

export function SignCollectionItem({ sign, user }) {
    return (
        <div
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
                <AddSignToCollection
                    id={sign.sign_id}
                    collections={user.collections}
                />
            </div>
        </div>
    )
}
