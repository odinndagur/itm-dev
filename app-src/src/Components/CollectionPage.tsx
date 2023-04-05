import SearchableSignList from './SearchableSignList'
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { query, getCollectionById } from '../db'
import './SignList.css'
import { Link } from 'react-router-dom'

function CollectionPage() {
    const params: any = useParams()
    const collectionId = params.collectionId

    const [searchValue, setSearchValue] = useState('')
    const [signs, setSigns] = useState<any>([])
    const [collectionName, setCollectionName] = useState('')

    useEffect(() => {
        console.log(searchValue)
        getCollectionById(searchValue, collectionId).then((signs) => {
            setSigns(signs)
            setCollectionName(signs[0]?.collection_name)
            console.log(signs)
        })
    }, [searchValue])

    return (
        <div className="flexcol">
            <header>
                <Link to={'/'}>
                    <h1 className="heading">ÍTM</h1>
                </Link>
                <h3>{collectionName}</h3>
                <div className="search">
                    <input
                        onChange={(event) => setSearchValue(event.target.value)}
                        type="search"
                        placeholder="Leita að tákni"
                        style={{ padding: '0.4rem 1rem' }}
                    />
                </div>
            </header>
            <div className="signlist">
                <SearchableSignList
                    items={signs}
                    itemSize={50}
                    itemType="sign"
                />
            </div>
            <footer style={{ margin: 'auto' }}></footer>
        </div>
    )
}

export default CollectionPage
