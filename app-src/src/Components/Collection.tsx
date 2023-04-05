import SearchableSignList from './SearchableSignList'
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { query, getCollectionById } from '../db'
import './SignList.css'

function Collection() {
    const params: any = useParams()
    const collectionId = params.collectionId
    
    const [searchValue, setSearchValue] = useState('')  
    const [signs, setSigns] = useState<Signs>([])
    const [collectionName, setCollectionName] = useState('')

    useEffect(() => {
        console.log(searchValue)
        getCollectionById(searchValue, collectionId).then((signs: Signs) => {
            setSigns(signs)
            setCollectionName(signs[0]!.collection_name)
            console.log(signs)
        })
    },[searchValue])


    return (
        <div className='flexcol'>
            <header>
                <h1 className="heading">ÍTM</h1>
                <h3>{collectionName}</h3>
                <div className="search">
                    <input
                        onChange={(event) => setSearchValue(event.target.value)}
                        type="search"
                        placeholder='Leita að tákni'
                        style={{padding:'0.4rem 1rem'}}
                    />
                </div>
            </header>
            <div className="signlist">
                    <SearchableSignList
                        signs={signs}
                    />
            </div>
            <footer style={{ margin: 'auto' }}></footer>
        </div>
    )
}

export default Collection
