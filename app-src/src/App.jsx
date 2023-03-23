import { useState, useEffect } from 'react'
import Sign from './Sign';

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [signs, setSigns] = useState([])



  useEffect(() => {
    const msCount = 1000
    const timer = setTimeout(() => {
      console.log(`This will run after ${msCount}ms!`)
      window.promiseWorker.postMessage({
        type:'signSearch',
        query:searchValue
      }).then(searchResults => {
        setSigns(searchResults)
      })
    }, msCount);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.promiseWorker.postMessage({
      type:'signSearch',
      query:searchValue
    }).then(searchResults => {
      setSigns(searchResults)
    })
  },[searchValue])

  return (
    <div className="App">
      <header>
        <h1>lolz</h1>
        <input value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
      </header>
      {signs.map(sign => {
        return <Sign key={sign.id} sign={sign}/>
      })}
    </div>
  )
}

export default App
