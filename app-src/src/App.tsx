import { useState, useEffect } from 'react'
import Sign from './Sign';
import UserCollection from './UserCollection';

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [signs, setSigns] = useState<Signs>([])
  const [allCollections, setAllCollections] = useState<Collections>([])
  const [currentCollection, setCurrentCollection] = useState('')

  // timeout to get initial signs, have to wait so the promiseworker is definitely there
  useEffect(() => {
    const msCount = 1000
    const timer = setTimeout(() => {
      console.log(`This will run after ${msCount}ms!`)
      // get initial signs
      window.promiseWorker.postMessage({
        type:'signSearch',
        query:searchValue
      }).then((searchResults:Signs) => {
        console.log(searchResults)
        setSigns(searchResults)
      })

      // get list of collections
      window.promiseWorker.postMessage({
        type:'listCollections'
      }).then((collections: Collections) => {
        setAllCollections(collections)
      })
    }, msCount);
    return () => clearTimeout(timer);
  }, []);

  // search everytime the input changes
  useEffect(() => {
    window.promiseWorker.postMessage({
      type:'signSearch',
      query:searchValue
    }).then((searchResults: Signs) => {
      setSigns(searchResults)
    })
  },[searchValue])

  useEffect(() => {
    console.log(currentCollection)
    window.promiseWorker.postMessage({
      type:'getCollectionById',
      collectionId:currentCollection
    }).then((searchResults: Signs) => {
      console.log(searchResults)
      setSigns(searchResults)
    })
  }, [currentCollection])



  return (
    <div className="App">
      <header>
        <h1 className='heading'>ÍTM</h1>
        <input value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
        <div>
            <select id='currentCollection' onChange={(ev) => setCurrentCollection(ev.target.value)} defaultValue={"Select collection: "}>
              {allCollections.map(collection => {
                return <option key={collection.id} value={collection.id}>{collection.name}</option>
              })}
              </select>
        </div>
      </header>
      {/* <div style={{display:'flex',flexDirection:'row',padding:'0 2rem',margin:'auto',justifyContent:'space-between',width:'100%'}}> */}
        {/* <UserCollection/> */}
        {/* <div> */}
          {signs.map(sign => {
            return <Sign key={sign.id} sign={sign}/>
          })}
        {/* </div> */}
      {/* </div> */}
    </div>
  )
}

export default App
