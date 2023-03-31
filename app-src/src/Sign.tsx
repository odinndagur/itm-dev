import { Button } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { checkSignInCollection } from './db'

function Sign({ sign }: { sign: Sign }) {
  const [inCollection, setInCollection] = useState(
    Boolean(sign.in_collection)
  )
  const toggleUserCollection = async () => {
    const collection_id = 3
    const sign_id = sign.sign_id
    const exists = await checkSignInCollection({
      sign_id: sign_id,
      collection_id: collection_id,
    })
    setInCollection(!exists)
    if (exists) {
      window.promiseWorker.postMessage({
        type: 'sql',
        query: `delete from sign_collection
                where sign_id = ${sign_id}
                and collection_id = ${collection_id}`,
      } satisfies absurdSqlPromiseWorkerMessage)
    } else {
      window.promiseWorker.postMessage({
        type: 'sql',
        query: `insert into sign_collection(sign_id, collection_id) values(${sign_id},${collection_id})`,
      } satisfies absurdSqlPromiseWorkerMessage)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        // justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 2rem',
        // maxWidth: '500px',
      }}
    >
      <div>
        <Button
          onClick={toggleUserCollection}
          variant="outlined"
          size="small"
          sx={{}}
        >
          {!inCollection ? <Add /> : <Remove />}
        </Button>
      </div>
      <Link
        to={`${import.meta.env.BASE_URL}signs/${sign.sign_id}`}
        style={{ paddingLeft: '2rem' }}
      >
        {sign.phrase}
      </Link>
    </div>

    // <div className="sign" onClick={() => showYt()} id={sign.id}>
    //     <div className="sign-phrase">
    //         <span>{sign.phrase}</span>
    //     </div>

    //     {youtubeShowing && <YoutubeEmbed embedId={sign.youtube_id} />}
    // </div>
  )
}

export default Sign
