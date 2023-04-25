import initSqlJs from '@jlongster/sql.js/dist/sql-wasm'
import { SQLiteFS } from 'absurd-sql'
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend'
import registerPromiseWorker from 'promise-worker/register'

function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null))
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator // substitution
            )
        }
    }
    return track[str2.length][str1.length]
}

const commonPrefixLength = (str1 = '', str2 = '') => {
    let i = 0
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
        i += 1
    }
    return i
}

const levenshteinDistanceWithStartPenalty = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null))
    const commonPrefixLen = commonPrefixLength(str1, str2)
    const startPenalty = Math.min(
        commonPrefixLen,
        Math.min(str1.length, str2.length)
    )
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
            let cost = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator // substitution
            )
            if (i - 1 < startPenalty && j - 1 < startPenalty) {
                cost -= startPenalty - Math.min(i - 1, j - 1)
            }
            track[j][i] = cost
        }
    }
    return track[str2.length][str1.length]
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
    db.create_function('levenshtein', (a: string, b: string) =>
        levenshteinDistanceWithStartPenalty(a, b)
    )

    const currentVersion = 4
    let initDB = false
    try {
        console.log('try')
        db.exec('select * from sign_fts limit 5')
        const res = db.query('pragma user_version')
        const user_version = res[0].user_version
        console.log('pragma user version', user_version, currentVersion)
        if (res.length && user_version != currentVersion) {
            initDB = true
            db.exec(`PRAGMA writable_schema = 1;
            delete from sqlite_master where type in ('table', 'index', 'trigger');
            PRAGMA writable_schema = 0;
            VACUUM;
            PRAGMA INTEGRITY_CHECK`)
        }
    } catch (error) {
        console.log('except')
        initDB = true
    }
    if (initDB) {
        let filepathPrefix = `${import.meta.env.BASE_URL}`
        const filepaths = [
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
        db.exec(
            'INSERT INTO collection(id,user_id,name) VALUES(1,1,"Öll tákn")'
        )
        db.exec(
            'INSERT INTO sign_collection(sign_id,collection_id) SELECT sign.id, 1 FROM sign'
        )
        db.exec('INSERT INTO user(name, id) VALUES("User",3);')
        db.exec(
            'INSERT INTO collection(id,user_id,name) VALUES(3,3,"Mín tákn");'
        )
        db.exec(`pragma user_version = ${currentVersion}`)
    }

    registerPromiseWorker(async function (
        message: absurdSqlPromiseWorkerMessage
    ) {
        switch (message.type) {
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
