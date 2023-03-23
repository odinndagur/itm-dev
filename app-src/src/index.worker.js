import initSqlJs from '@jlongster/sql.js/dist/sql-wasm';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
import registerPromiseWorker from 'promise-worker/register'

async function run() {
  console.log('yo')
  let SQL = await initSqlJs({ locateFile: file => `${import.meta.env.BASE_URL}/assets/${file}` });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  const path = '/sql/sign.sqlite';
  if (typeof SharedArrayBuffer === 'undefined') {
    let stream = SQL.FS.open(path, 'a+');
    await stream.node.contents.readIfFallback();
    SQL.FS.close(stream);
  }

  let db = new SQL.Database(path, { filename: true });
  // You might want to try `PRAGMA page_size=8192;` too!
  db.exec(`
  PRAGMA journal_mode=MEMORY;
  `);
  let initDB = false
  try {
    console.log('try')
    db.exec('select * from sign_fts limit 5')
  } catch (error) {
    console.log('except')
    initDB = true
  }
  if(initDB){
    const filepaths = ['/assets/signfts.txt','/assets/signftsdata.txt','/assets/signftstableftsdata.txt']
    for(let filepath of filepaths){
      for await (let line of splitTextFileBySemicolon(filepath)){
        // console.log(line)
        try {
          db.exec(line);
        } catch (error) {
          console.error(error)
        }
      }
    }
    // for await (let line of splitTextFileBySemicolon('/assets/signfts.txt')) {
    //   // console.log(line)
    //   try {
    //     db.exec(line);
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // for await (let line of splitTextFileBySemicolon('/assets/signftsdata.txt')) {
    //     // console.log(line)
    //     try{
    //       db.exec(line);
    //     } catch (error) {
    //       console.error(error)
    //     }
    //   }
    // for await (let line of splitTextFileBySemicolon('/assets/signftstableftsdata.txt')) {
    //   // console.log(line)
    //   try{
    //     db.exec(line);
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
  } 

registerPromiseWorker( async function (message) {
  // console.log(message)
  let stmt;
  if(message.type == 'searchValue'){
    // let searchValue = message.searchValue
    let { searchValue } = message
    if(!searchValue){
        stmt = db.prepare(`select * from sign order by phrase asc limit 500`)
    } if (searchValue[0] === '*'){
        stmt = db.prepare(`select * from sign where phrase like "%${searchValue.substring(1)}%" order by phrase asc`)
    } 
    if(searchValue && searchValue[0] != '*') {
        if(searchValue[searchValue.length-1] != '*'){
            searchValue = searchValue + '*'
        }
        stmt = db.prepare(`select * from sign_fts join sign on sign.id = sign_fts.id where sign_fts match "${searchValue}" order by rank, phrase asc`)
    }
    let result = []
    while (stmt.step()) result.push(stmt.getAsObject());
    // postMessage({type:'signs',signs:result})
    return result
  }

  if(message.type === 'exec'){
    stmt = db.prepare(message.command)
    let res = []
    while (stmt.step()){res.push(stmt.getAsObject())}
    return res
  }

  if(message.type === 'user-collections'){
    try {
      db.exec(`SELECT * FROM user WHERE NAME = "default_user"`)
    } catch (error) {
      console.error(error)
    }
    let stmt = db.prepare(`SELECT * FROM collection WHERE user_id IN (select id from user where user.name = "default_user")`)
    let user_collections = []
    while (stmt.step()){user_collections.push(stmt.getAsObject())}
    // postMessage({type:'user-collections',user_collections})
  }

  if(message.type === 'new-collection'){
    try {
      db.exec(`INSERT INTO collection (name, user_id) SELECT "${message.newCollectionName}", id from (select id from user where name = "default_user")`)
    } catch (error) {
      console.error(error)
    }
    let stmt = db.prepare(`SELECT * FROM collection WHERE user_id IN (select id from user where user.name = "default_user")`)
    let user_collections = []
    while (stmt.step()){user_collections.push(stmt.getAsObject())}
    // stmt.step()
    // user_collections.push(stmt.getAsObject());
    // postMessage({type:'user-collection',user_collections:user_collections})
    return user_collections
  }
  // return 'pong';
});
}

run()

async function* makeTextFileLineIterator(fileURL) {
  const utf8Decoder = new TextDecoder("utf-8");
  let response = await fetch(fileURL);
  let reader = response.body.getReader();
  let {value: chunk, done: readerDone} = await reader.read();
  chunk = chunk ? utf8Decoder.decode(chunk, {stream: true}) : "";

  let re = /\r\n|\n|\r/gm;
  let startIndex = 0;

  for (;;) {
    let result = re.exec(chunk);
    if (!result) {
      if (readerDone) {
        break;
      }
      let remainder = chunk.substr(startIndex);
      ({value: chunk, done: readerDone} = await reader.read());
      chunk = remainder + (chunk ? utf8Decoder.decode(chunk, {stream: true}) : "");
      startIndex = re.lastIndex = 0;
      continue;
    }
    yield chunk.substring(startIndex, result.index);
    startIndex = re.lastIndex;
  }
  if (startIndex < chunk.length) {
    // last line didn't end in a newline char
    yield chunk.substr(startIndex);
  }
}

function processLine(line){
  console.log(line)
}

async function lineDoer(){
  for await (let line of makeTextFileLineIterator('data.txt')) {
    processLine(line);
  }
}

// lineDoer()

async function* splitTextFileBySemicolon(fileURL) {
  const utf8Decoder = new TextDecoder("utf-8");
  let response = await fetch(fileURL);
  let reader = response.body.getReader();
  let {value: chunk, done: readerDone} = await reader.read();
  chunk = chunk ? utf8Decoder.decode(chunk, {stream: true}) : "";

  let re = /;/gm;
  let startIndex = 0;

  for (;;) {
    let result = re.exec(chunk);
    if (!result) {
      if (readerDone) {
        break;
      }
      let remainder = chunk.substr(startIndex);
      ({value: chunk, done: readerDone} = await reader.read());
      chunk = remainder + (chunk ? utf8Decoder.decode(chunk, {stream: true}) : "");
      startIndex = re.lastIndex = 0;
      continue;
    }
    yield chunk.substring(startIndex, result.index);
    startIndex = re.lastIndex;
  }
  if (startIndex < chunk.length) {
    // last line didn't end in a newline char
    yield chunk.substr(startIndex);
  }
}