import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './index.css'
// import './App.css'
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
import PromiseWorker from 'promise-worker'
let worker = new Worker(new URL('./index.worker.js', import.meta.url),{
  type:'module'
});
let promiseWorker = new PromiseWorker(worker)
initBackend(worker);
window.worker = worker
window.promiseWorker = promiseWorker

document.addEventListener("keydown", function(e) {
  if (e.code == "Enter") {
      document.activeElement.click();
}});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
