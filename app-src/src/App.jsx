import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [signs, setSigns] = useState([])

  useEffect(() => {
    window.promiseWorker.postMessage({
      type:'searchValue',
      searchValue:searchValue
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
        return <div key={sign.id}>{sign.phrase}</div>
      })}
    </div>
  )
}

export default App
