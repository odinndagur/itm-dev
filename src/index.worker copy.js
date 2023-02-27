import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
let db

async function run() {
  let SQL = await initSqlJs({ locateFile: file => file });
  // let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  // SQL.register_for_idb(sqlFS);

  // SQL.FS.mkdir('/sql');
  // SQL.FS.mount(sqlFS, {}, '/sql');

  // const path = '/sql/db.sqlite';
  // if (typeof SharedArrayBuffer === 'undefined') {
  //   let stream = SQL.FS.open(path, 'a+');
  //   await stream.node.contents.readIfFallback();
  //   SQL.FS.close(stream);
  // }
  fetch('signtest.sqlite3').then(res => {
    // console.log(res)
    res.arrayBuffer().then(buf => {
      db = new SQL.Database(new Uint8Array(buf));
      console.log(db.exec('select * from sqlite_master'))
    })
  })
  // let db = new SQL.Database(path, { filename: true });
  // You might want to try `PRAGMA page_size=8192;` too!
  // db.exec(`
  //   PRAGMA journal_mode=MEMORY;
  // `);

  // console.log(db.exec('select * from sign limit 5').getAsObject())

   // Your code
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

lineDoer()