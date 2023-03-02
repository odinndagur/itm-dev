import initSqlJs from '@jlongster/sql.js/dist/sql-wasm';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
let db
let firstRun = true

// onmessage = (e) => {
//   console.log('Message received from main script');
//   const workerResult = `Result: ${e.data[0] * e.data[1]}`;
//   console.log('Posting message back to main script');
//   postMessage(workerResult);
// }




async function run() {
  let SQL = await initSqlJs({ locateFile: file => `${file}` });
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
  // debugger;
  db.exec(`
  PRAGMA journal_mode=MEMORY;
  `);
  // console.log(db.exec('select * from sign_fts'))
  // debugger;
  
  // try {
    //   db.exec('select * from sign limit 5')
    // } catch (error) {
      let initDB = false
      try {
        db.exec('select * from sign_fts limit 5')
      } catch (error) {
        initDB = true
      }
      if(initDB){
        for await (let line of splitTextFileBySemicolon('signfts.txt')) {
          // console.log(line)
          try{
            db.exec(line);
  
          } catch (error) {
            console.error(error)
          }
        }
          for await (let line of splitTextFileBySemicolon('signftsdata.txt')) {
              // console.log(line)
              try{
                db.exec(line);
  
              } catch (error) {
                console.error(error)
              }
            }
          for await (let line of splitTextFileBySemicolon('signftstableftsdata.txt')) {
            // console.log(line)
            try{
              db.exec(line);
    
            } catch (error) {
              console.error(error)
            }
          }
      }
        //   debugger;
          // for await (let line of splitTextFileBySemicolon('signglitchdata.txt')) {
          //   // console.log(line)
          //   try{
          //     db.exec(line);

          //   } catch (error) {
          //     console.error(error)
          //   }
          // }
          // debugger;
        //   // console.error('lol yo',error)
        // }
        
        // for await (let line of makeTextFileLineIterator('data.txt')) {
        //   // console.log(line)
        //   try {
        //     db.exec(line);
            
        //   } catch (error) {
        //     console.log('error lol',error)
        //   }
        // }
        //   console.log(db.exec('select * from sign_fts'))

        // debugger;
  // console.log(db.exec('select * from sign_fts limit 5'))
  
  // Your code
  //  console.log('all done')
  onmessage = (query) => {
    // run()
    console.log(query.data)
    let stmt;
    // if(!query.data){
    //   stmt = db.prepare(`select * from sign`)
    // } else {
    //   stmt = db.prepare(`select * from sign join sign_fts on sign.id = sign_fts.id where sign_fts match "${query.data}*" order by rank, phrase asc`)
    // }
    let searchValue = query.data

    if(!searchValue){
        stmt = db.prepare(`select * from sign order by phrase asc`)
    } if (searchValue[0] === '*'){
        stmt = db.prepare(`select * from sign where phrase like "%${searchValue.substring(1)}%" order by phrase asc`)
    } 
    if(searchValue && searchValue[0] != '*') {
        if(searchValue[searchValue.length-1] != '*'){
            searchValue = searchValue + '*'
        }
        stmt = db.prepare(`select * from sign_fts join sign on sign.id = sign_fts.id where sign_fts match "${searchValue}" order by rank, phrase asc`)
    }
    // let stmt = db.prepare(`select * from sign where phrase like "%${query.data}%"`)

    // let stmt = db.prepare(`
    // select * from sign_fts
    // where phrase match "${query.data}*"
    // `)

    // stmt.bind({$phrase:query.data})
    let result = []
    while (stmt.step()) result.push(stmt.getAsObject());
    // postMessage(JSON.stringify(result))
    postMessage(result)
    // postMessage('lol')
    // console.log(db.exec(`select * from sign where phrase like "%${query.data}%"`))
  }
  if(firstRun){
    firstRun = false;
    console.log('first run')
    postMessage('ready')
  }
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