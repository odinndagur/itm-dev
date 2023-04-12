import SearchableSignList from './SearchableSignList'
import { useEffect, useState } from 'react'
import { query, getCollectionById } from '../db'
import './SignList.css'
import { Link } from 'react-router-dom'
import { AppNavBar } from './AppNavBar'

function Collections() {
    const [searchValue, setSearchValue] = useState('')
    const [collections, setCollections] = useState<any>([])

    useEffect(() => {
        console.log(searchValue)
        const whereClause = searchValue
            ? `where collection.name LIKE "%${searchValue}%"`
            : ''
        query(`
            select collection.name as collection_name,
            collection.id as collection_id,
            user.name as user_name,
            user.id as user_id
            
            from collection
            join user
            ON collection.user_id = user.id
            ${whereClause}
            group by collection.id

        `).then((collections) => {
            setCollections(collections)
        })
    }, [searchValue])

    // return <h1>coll</h1>

    return (
        <div className="flexcol">
            <header>
                <h1 className="heading">
                    <Link to={'/'}>ÍTM</Link>
                </h1>
                <h3>Táknasöfn</h3>
                <div className="search">
                    <input
                        onChange={(event) => setSearchValue(event.target.value)}
                        type="search"
                        placeholder="Leita að safni"
                        style={{ padding: '0.4rem 1rem' }}
                    />
                </div>
            </header>
            <div className="signlist">
                <SearchableSignList
                    items={collections}
                    itemSize={120}
                    itemType="collection"
                />
            </div>
            {/* <AppNavBar/> */}
        </div>
    )
}

export default Collections
