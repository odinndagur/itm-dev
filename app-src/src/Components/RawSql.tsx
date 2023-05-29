import { useState } from "react";
import { Header } from "./Header";
import { query } from "../db";

export function RawSql(){
    const [sqlString, setSqlString] = useState('')
    const [results, setResults] = useState([])
    function submitSql(){
        query(sqlString).then(res => {
            setResults(res)
        })
    }
    return <div>
        <Header>
            <form onSubmit={submitSql}>
            <input onChange={ev => setSqlString(ev.target.value)}></input>
<button type="submit">Senda</button>
            </form>
        </Header>
        <div>
            {results.map(result => {
                return <div className="card">
                    {Object.keys(result).map(key => {
                        return <span>
                            <b>{key}</b><br/><p>{result[key]}</p>
                        </span>
                    })}
                </div>
            })}
        </div>
    </div>
}