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
    SQL = await initSqlJs({
        locateFile: (file: String) =>
            `${import.meta.env.BASE_URL}assets/${file}`,
    })
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
        switch (message.type){
            case 'sql':
                return db.query(message.query)
            case 'exec':
                db.exec(message.query)
        }
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
