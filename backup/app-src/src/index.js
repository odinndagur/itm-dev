import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
__webpack_public_path__ = '/itm-dev/';
function init() {
  let worker = new Worker(new URL('./index.worker.js', import.meta.url));
  // This is only required because Safari doesn't support nested
  // workers. This installs a handler that will proxy creating web
  // workers through the main thread
  initBackend(worker);
  window.worker = worker;
  worker.onmessage = (ev) => {
    if(ev.data == 'ready'){
      window.updateSearch()
    } else {
      let div = document.getElementById('results')
      console.log('fyrir json parse')
      // let signs;
      // if(ev){
      //   signs = JSON.parse(ev.data)
      // } else {
      //   signs = []
      // }
      // let signs = JSON.parse(ev.data) || []
      let signs = ev.data || [];
      // console.log(signs)
      // console.log('eftir json parse')
      // div.textContent = 
      if(signs.length){
        div.innerHTML = signs.map(sign => {
          return `<div class="sign" onclick="showYoutube(this)" id="${sign.id}" youtube_id="${sign.youtube_id}">
                      <div class="sign-phrase">
                          <span>${sign.phrase}</span>
                          <span class="addToListIcon" onclick="addToList(${sign.id})">
                      </div>
                  </div>`
      }).join('')
      }
      // JSON.parse(ev.data).map(sign => {
      //   let signDiv = document.createElement('div')
      //   signDiv.textContent = sign.phrase
      //   div.appendChild(signDiv)
      //   // return sign.phrase
      // })
      document.body.appendChild(div)
      // console.log(ev.data)
    }

    }
}

init();
