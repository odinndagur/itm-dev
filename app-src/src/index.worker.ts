import initSqlJs from '@jlongster/sql.js/dist/sql-wasm'
import { SQLiteFS } from 'absurd-sql'
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend'
import registerPromiseWorker from 'promise-worker/register'

function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

async function run() {
    console.log('yo')
    let SQL
    // if (import.meta.env.MODE === 'development') {
    //     SQL = await initSqlJs({
    //         locateFile: (file: String) => `/assets/${file}`,
    //     })
    // } else {
    SQL = await initSqlJs({
        locateFile: (file: String) =>
            `${import.meta.env.BASE_URL}assets/${file}`,
    })
    // }
    let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend())
    SQL.register_for_idb(sqlFS)

    SQL.FS.mkdir('/sql')
    SQL.FS.mount(sqlFS, {}, '/sql')
    const path = '/sql/sign.sqlite'
    if (typeof SharedArrayBuffer === 'undefined') {
        let stream = SQL.FS.open(path, 'a+')
        await stream.node.contents.readIfFallback()
        SQL.FS.close(stream)
    }

    let db = new SQL.Database(path, { filename: true })
    // You might want to try `PRAGMA page_size=8192;` too!
    db.exec(`
  PRAGMA journal_mode=MEMORY;
  `)

    function toObjects(res: any) {
        return res.flatMap((r: any) =>
            r.values.map((v: any) => {
                const o: any = {}
                for (let i = 0; i < r.columns.length; i++) {
                    o[r.columns[i]] = v[i]
                }
                return o
            })
        )
    }
    db.query = (...args: any[]) => toObjects(db!.exec(...args))

    let initDB = false
    try {
        console.log('try')
        db.exec('select * from sign_fts limit 5')
    } catch (error) {
        console.log('except')
        initDB = true
    }
    if (initDB) {
        // let filepathPrefix = ''
        // if (import.meta.env.MODE != 'development') {
        let filepathPrefix = `${import.meta.env.BASE_URL}`
        // }
        const filepaths = [
            // `${filepathPrefix}assets/signfts.txt`,
            // `${filepathPrefix}assets/signftsdata.txt`,
            // `${filepathPrefix}assets/sign-nytt-tables.txt`,
            // `${filepathPrefix}assets/sign-nytt.txt`,
            `${filepathPrefix}assets/sign_tables.txt`,
            `${filepathPrefix}assets/sign_db_data.txt`,
            `${filepathPrefix}assets/signftstableftsdata.txt`,
        ]
        for (let filepath of filepaths) {
            if (filepath.includes('db_data')) {
                for await (let line of makeTextFileLineIterator(filepath)) {
                    // console.log(line)
                    try {
                        db.exec(line)
                    } catch (error) {
                        console.error(error)
                    }
                }
            } else {
                for await (let line of splitTextFileBySemicolon(filepath)) {
                    // console.log(line)
                    try {
                        db.exec(line)
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        }
        // db.exec()
        db.exec('INSERT INTO user(name,id) VALUES("ÍTM",1)')
        db.exec('INSERT INTO collection(id,user_id,name) VALUES(1,1,"Öll tákn")')
        db.exec('INSERT INTO sign_collection(sign_id,collection_id) SELECT sign.id, 1 FROM sign')
        db.exec('INSERT INTO user(name, id) VALUES("default_user",3);')
        db.exec(
            'INSERT INTO collection(id,user_id,name) VALUES(3,3,"default_collection");'
        )
    }

    registerPromiseWorker(async function (
        message: absurdSqlPromiseWorkerMessage
    ) {
        let stmt, user_collection, offset, limit, query
        query = message.query
        if (typeof query === 'string') {
            query = message.query.trim()
        }
        offset = message.signOffset || 0
        limit = message.signLimit || 500
        const collectionId = message.collectionId ?? 3
        switch (message.type) {
            case 'signSearch':
                console.log('signsearch')
                // let searchValue = message.searchValue
                if (!query) {
                    stmt = `select distinct sign.id as sign_id,
                        sign.phrase as phrase,
                        sign_video.video_id as youtube_id,
                        sign_fts.related_signs as related_signs,
                        CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
                        from sign
                        join sign_fts
                        on sign.id = sign_fts.id
                        LEFT JOIN sign_collection
                        ON sign_collection.sign_id = sign.id
                        LEFT JOIN sign_video
                        ON sign.id = sign_video.sign_id
                        group by sign.id
                        order by phrase asc
                        limit ${limit}
                        offset ${offset}`
                }
                if (query[0] === '*') {
                    stmt = `select distinct sign.id as sign_id,
                        sign.phrase as phrase,
                        sign_video.video_id as youtube_id,
                        sign_fts.related_signs as related_signs,
                        CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
                        from sign
                        join sign_fts
                        on sign.id = sign_fts.id
                        LEFT JOIN sign_collection
                        ON sign_collection.sign_id = sign.id
                        LEFT JOIN sign_video
                        ON sign.id = sign_video.sign_id
                        where sign.phrase like "%${query.substring(1)}%"
                        group by sign.id
                        order by sign.phrase asc
                        limit ${limit}
                        offset ${offset}`
                }
                if (query && query[0] != '*') {
                    if (query[query.length - 1] != '*') {
                        query = query + '*'
                    }
                    stmt = `select distinct sign.id as sign_id,
                        sign.phrase as phrase,
                        sign_video.video_id as youtube_id,
                        sign_fts.related_signs as related_signs,
                        CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
                        from sign_fts
                        join sign on sign.id = sign_fts.id
                        LEFT JOIN sign_collection
                        ON sign_collection.sign_id = sign.id
                        LEFT JOIN sign_video
                        ON sign.id = sign_video.sign_id
                        where sign_fts match "${query}"
                        group by sign.id
                        order by sign_fts.rank, sign.phrase asc
                        limit ${limit}
                        offset ${offset}`
                }
                let result: Signs = db.query(stmt)
                return result
                break

            case 'sql':
                return db.query(query)
                break

            case 'listCollections':
                stmt = `select collection.id as id,
                          user.id as user_id,
                          collection.name as name,
                          user.name as user_name 
                          from collection
                          join user
                          on collection.user_id = user.id`
                let all_collections: Collections = db.query(stmt)
                return all_collections
                break

            case 'getDefaultUserCollection':
                stmt = db.prepare(
                    `SELECT * from sign where sign.id in (select sign_collection.sign_id from sign_collection where sign_collection.collection_id = 3)`
                )
                user_collection = []
                while (stmt.step()) {
                    user_collection.push(stmt.getAsObject())
                }
                console.log(user_collection)
                return user_collection
                break
            case 'addToDefaultUserCollection':
                db.exec(
                    `INSERT INTO sign_collection(sign_id,collection_id) VALUES(${query},3)`
                )
                console.log(query)
            case 'getCollectionById':
                console.log('getCollectionById')
                // let searchValue = message.searchValue
                if (!query) {
                    stmt = `select distinct sign.id as sign_id,
                        sign.phrase as phrase,
                        sign_video.video_id as youtube_id,
                        sign_fts.related_signs as related_signs,
                        collection.id as collection_id,
                        collection.name as collection_name
                        from sign
                        join sign_fts
                        on sign.id = sign_fts.id
                        left join sign_collection
                        on sign.id = sign_collection.sign_id
                        left join collection
                        on collection.id = sign_collection.collection_id
                        LEFT JOIN sign_video
                        ON sign.id = sign_video.sign_id
                        where collection.id = ${collectionId}
                        group by sign.id
                        order by sign.phrase asc
                        limit ${limit}
                        offset ${offset}`
                }
                if (query[0] === '*') {
                    stmt = `select distinct sign.id as sign_id,
                        sign.phrase as phrase,
                        sign_video.video_id as youtube_id,
                        sign_fts.related_signs as related_signs,
                        collection.id as collection_id,
                        collection.name as collection_name
                        from sign
                        join sign_fts
                        on sign.id = sign_fts.id
                        left join sign_collection
                        on sign.id = sign_collection.sign_id
                        left join collection
                        on collection.id = sign_collection.collection_id
                        LEFT JOIN sign_video
                        ON sign.id = sign_video.sign_id
                        where sign.phrase like "%${query.substring(1)}%"
                        and collection.id = ${collectionId}
                        group by sign.id
                        order by sign.phrase asc
                        limit ${limit}
                        offset ${offset}`
                }
                if (query && query[0] != '*') {
                    if (query[query.length - 1] != '*') {
                        query = query + '*'
                    }
                    stmt = `select distinct sign.id as sign_id,
                        sign.phrase as phrase,
                        sign_video.video_id as youtube_id,
                        sign_fts.related_signs as related_signs,
                        collection.id as collection_id,
                        collection.name as collection_name
                        from sign_fts
                        join sign on sign.id = sign_fts.id
                        left join sign_collection
                        on sign.id = sign_collection.sign_id
                        left join collection
                        on collection.id = sign_collection.collection_id
                        LEFT JOIN sign_video
                        ON sign.id = sign_video.sign_id
                        where sign_fts match "${query}"
                        and collection.id = ${collectionId}
                        group by sign.id
                        order by sign_fts.rank, sign.phrase asc
                        limit ${limit}
                        offset ${offset}`
                }
                let signCollection: Signs = db.query(stmt)
                return signCollection
                break
            case 'signSearchWithCollectionId':
                console.log('signSearchWithCollectionId')
                // let searchValue = message.searchValue
                if (!query) {
                    stmt = `
                        select distinct
                        sign.id as sign_id,
                        sign.phrase as phrase,
                        sign_video.video_id as youtube_id,
                        sign_fts.related_signs as related_signs,
                            case when sign_collection.collection_id is not null then true else false end as in_collection
                        from sign
                        join sign_fts
                        on sign.id = sign_fts.id
                        left join sign_collection
                        on sign.id = sign_collection.sign_id
                        and sign_collection.collection_id = ${collectionId}
                        LEFT JOIN sign_video
                        ON sign.id = sign_video.sign_id
                        order by sign.phrase asc
                        limit ${limit}
                        offset ${offset}`
                }
                let allSignsWithCollectionBool: Signs = db.query(stmt)
                return allSignsWithCollectionBool
                break
            case 'checkSignInCollection':
                const { sign_id, collection_id } = query
                let res = db.query(`
                select case when exists
                    (select *
                    from sign_collection
                    where sign_id = ${sign_id}
                    and collection_id = ${collection_id}
                    )
                    then true
                    else false
                    end
                    as in_collection;
                `)[0]
                return Boolean(res.in_collection)
        }
        // console.log(message)
        // let stmt;
        // if(message.type == 'signSearch'){
        //   // let searchValue = message.searchValue
        //   let query  = message.query.trim()
        //   if(!query){
        //       stmt = db.prepare(`select * from sign order by phrase asc limit 500`)
        //   } if (query[0] === '*'){
        //       stmt = db.prepare(`select * from sign where phrase like "%${query.substring(1)}%" order by phrase asc`)
        //   }
        //   if(query && query[0] != '*') {
        //       if(query[query.length-1] != '*'){
        //           query = query + '*'
        //       }
        //       stmt = db.prepare(`select * from sign_fts join sign on sign.id = sign_fts.id where sign_fts match "${query}" order by sign_fts.rank, phrase asc`)
        //   }
        //   let result = []
        //   while (stmt.step()) result.push(stmt.getAsObject());
        //   // postMessage({type:'signs',signs:result})
        //   return result
        // }

        // if(message.type === 'sql'){
        //   stmt = db.prepare(message.query)
        //   let res = []
        //   while (stmt.step()){res.push(stmt.getAsObject())}
        //   return res
        // }

        // if(message.type === 'listCollections'){
        //   let stmt = db.prepare(`select collection.id as collection_id,
        //                         user.id as user_id,
        //                         collection.name as collection_name,
        //                         user.name as user_name
        //                         from collection
        //                         join user
        //                         on collection.user_id = user.id`)
        //   let all_collections = []
        //   while (stmt.step()){all_collections.push(stmt.getAsObject())}
        //   console.log(all_collections)
        //   return all_collections
        // }

        // if(message.type === 'getDefaultUserCollection'){
        //     let stmt = db.prepare(`SELECT * from sign where sign.id in (select sign_collection.sign_id from sign_collection where sign_collection.collection_id = 3)`)
        //     let user_collection = []
        //     while (stmt.step()){user_collection.push(stmt.getAsObject())}
        //     console.log(user_collection)
        //     return user_collection
        // }

        // if(message.type === 'addToDefaultUserCollection'){
        //   db.exec(`INSERT INTO sign_collection(sign_id,collection_id) VALUES(${message.query},3)`)
        //   console.log(message.query)
        // }

        // if(message.type === 'getCollectionById'){
        //     let stmt = db.prepare(`SELECT * from sign where sign.id in (select sign_collection.sign_id from sign_collection where sign_collection.collection_id = ${message.collectionId})`)
        //     let user_collection = []
        //     while (stmt.step()){user_collection.push(stmt.getAsObject())}
        //     console.log(user_collection)
        //     return user_collection
        // }

        // if(message.type === 'user-collections'){
        //   try {
        //     db.exec(`SELECT * FROM user WHERE NAME = "default_user"`)
        //   } catch (error) {
        //     console.error(error)
        //   }
        //   let stmt = db.prepare(`SELECT * FROM collection WHERE user_id IN (select id from user where user.name = "default_user")`)
        //   let user_collections = []
        //   while (stmt.step()){user_collections.push(stmt.getAsObject())}
        //   // postMessage({type:'user-collections',user_collections})
        // }

        // if(message.type === 'new-collection'){
        //   try {
        //     db.exec(`INSERT INTO collection (name, user_id) SELECT "${message.newCollectionName}", id from (select id from user where name = "default_user")`)
        //   } catch (error) {
        //     console.error(error)
        //   }
        //   let stmt = db.prepare(`SELECT * FROM collection WHERE user_id IN (select id from user where user.name = "default_user")`)
        //   let user_collections = []
        //   while (stmt.step()){user_collections.push(stmt.getAsObject())}
        //   // stmt.step()
        //   // user_collections.push(stmt.getAsObject());
        //   // postMessage({type:'user-collection',user_collections:user_collections})
        //   return user_collections
        // }
    })
}

run()

async function* makeTextFileLineIterator(fileURL: string) {
    const utf8Decoder = new TextDecoder('utf-8')
    let response = await fetch(fileURL)
    let reader = response!.body!.getReader()
    let { value: chunk, done: readerDone } = await reader.read()
    chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : ''

    let re = /\r\n|\n|\r/gm
    let startIndex = 0

    for (;;) {
        let result = re.exec(chunk)
        if (!result) {
            if (readerDone) {
                break
            }
            let remainder = chunk.substr(startIndex)
            ;({ value: chunk, done: readerDone } = await reader.read())
            chunk =
                remainder +
                (chunk ? utf8Decoder.decode(chunk, { stream: true }) : '')
            startIndex = re.lastIndex = 0
            continue
        }
        yield chunk.substring(startIndex, result.index)
        startIndex = re.lastIndex
    }
    if (startIndex < chunk.length) {
        // last line didn't end in a newline char
        yield chunk.substr(startIndex)
    }
}
async function lineDoer() {
    for await (let line of makeTextFileLineIterator('data.txt')) {
        processLine(line)
    }
}

// lineDoer()

async function* splitTextFileBySemicolon(fileURL: string) {
    const utf8Decoder = new TextDecoder('utf-8')
    let response = await fetch(fileURL)
    let reader = response!.body!.getReader()
    let { value: chunk, done: readerDone } = await reader.read()
    chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : ''

    let re = /;/gm
    let startIndex = 0

    for (;;) {
        let result = re.exec(chunk)
        if (!result) {
            if (readerDone) {
                break
            }
            let remainder = chunk.substr(startIndex)
            ;({ value: chunk, done: readerDone } = await reader.read())
            chunk =
                remainder +
                (chunk ? utf8Decoder.decode(chunk, { stream: true }) : '')
            startIndex = re.lastIndex = 0
            continue
        }
        yield chunk.substring(startIndex, result.index)
        startIndex = re.lastIndex
    }
    if (startIndex < chunk.length) {
        // last line didn't end in a newline char
        yield chunk.substr(startIndex)
    }
}
