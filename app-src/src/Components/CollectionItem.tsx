import { Link } from 'react-router-dom'

function CollectionListItem({ collection }) {
    return (
        <Link to={`/collections/${collection.collection_id}`}>
            <div className="card">
                <h2>{collection.collection_name}</h2>
                <span>{collection.user_name}</span>
            </div>
        </Link>
    )
}

export default CollectionListItem
