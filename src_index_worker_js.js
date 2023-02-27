/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.worker.js":
/*!*****************************!*\
  !*** ./src/index.worker.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _jlongster_sql_js_dist_sql_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jlongster/sql.js/dist/sql-wasm */ \"./node_modules/@jlongster/sql.js/dist/sql-wasm.js\");\n/* harmony import */ var _jlongster_sql_js_dist_sql_wasm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jlongster_sql_js_dist_sql_wasm__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var absurd_sql__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! absurd-sql */ \"./node_modules/absurd-sql/dist/index.js\");\n/* harmony import */ var absurd_sql_dist_indexeddb_backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! absurd-sql/dist/indexeddb-backend */ \"./node_modules/absurd-sql/dist/indexeddb-backend.js\");\n\n\n\nlet db\nlet firstRun = true\n\n// onmessage = (e) => {\n//   console.log('Message received from main script');\n//   const workerResult = `Result: ${e.data[0] * e.data[1]}`;\n//   console.log('Posting message back to main script');\n//   postMessage(workerResult);\n// }\n\n\n\n\nasync function run() {\n  let SQL = await _jlongster_sql_js_dist_sql_wasm__WEBPACK_IMPORTED_MODULE_0___default()({ locateFile: file => `${file}` });\n  let sqlFS = new absurd_sql__WEBPACK_IMPORTED_MODULE_1__.SQLiteFS(SQL.FS, new absurd_sql_dist_indexeddb_backend__WEBPACK_IMPORTED_MODULE_2__.default());\n  SQL.register_for_idb(sqlFS);\n\n  SQL.FS.mkdir('/sql');\n  SQL.FS.mount(sqlFS, {}, '/sql');\n\n  const path = '/sql/sign.sqlite';\n  if (typeof SharedArrayBuffer === 'undefined') {\n    let stream = SQL.FS.open(path, 'a+');\n    await stream.node.contents.readIfFallback();\n    SQL.FS.close(stream);\n  }\n\n  let db = new SQL.Database(path, { filename: true });\n  // You might want to try `PRAGMA page_size=8192;` too!\n  // debugger;\n  db.exec(`\n  PRAGMA journal_mode=MEMORY;\n  `);\n  // console.log(db.exec('select * from sign_fts'))\n  // debugger;\n  \n  // try {\n    //   db.exec('select * from sign limit 5')\n    // } catch (error) {\n      let initDB = false\n      try {\n        db.exec('select * from sign_fts limit 5')\n      } catch (error) {\n        initDB = true\n      }\n      if(initDB){\n        for await (let line of splitTextFileBySemicolon('signfts.txt')) {\n          // console.log(line)\n          try{\n            db.exec(line);\n  \n          } catch (error) {\n            console.error(error)\n          }\n        }\n          for await (let line of splitTextFileBySemicolon('signftsdata.txt')) {\n              // console.log(line)\n              try{\n                db.exec(line);\n  \n              } catch (error) {\n                console.error(error)\n              }\n            }\n          for await (let line of splitTextFileBySemicolon('signftstableftsdata.txt')) {\n            // console.log(line)\n            try{\n              db.exec(line);\n    \n            } catch (error) {\n              console.error(error)\n            }\n          }\n      }\n        //   debugger;\n          // for await (let line of splitTextFileBySemicolon('signglitchdata.txt')) {\n          //   // console.log(line)\n          //   try{\n          //     db.exec(line);\n\n          //   } catch (error) {\n          //     console.error(error)\n          //   }\n          // }\n          // debugger;\n        //   // console.error('lol yo',error)\n        // }\n        \n        // for await (let line of makeTextFileLineIterator('data.txt')) {\n        //   // console.log(line)\n        //   try {\n        //     db.exec(line);\n            \n        //   } catch (error) {\n        //     console.log('error lol',error)\n        //   }\n        // }\n        //   console.log(db.exec('select * from sign_fts'))\n\n        // debugger;\n  // console.log(db.exec('select * from sign_fts limit 5'))\n  \n  // Your code\n  //  console.log('all done')\n  onmessage = (query) => {\n    // run()\n    console.log(query.data)\n    let stmt;\n    // if(!query.data){\n    //   stmt = db.prepare(`select * from sign`)\n    // } else {\n    //   stmt = db.prepare(`select * from sign join sign_fts on sign.id = sign_fts.id where sign_fts match \"${query.data}*\" order by rank, phrase asc`)\n    // }\n    let searchValue = query.data\n\n    if(!searchValue){\n        stmt = db.prepare(`select * from sign order by phrase asc`)\n    } if (searchValue[0] === '*'){\n        stmt = db.prepare(`select * from sign where phrase like \"%${searchValue.substring(1)}%\" order by phrase asc`)\n    } \n    if(searchValue && searchValue[0] != '*') {\n        if(searchValue[searchValue.length-1] != '*'){\n            searchValue = searchValue + '*'\n        }\n        stmt = db.prepare(`select * from sign_fts join sign on sign.id = sign_fts.id where sign_fts match \"${searchValue}\" order by rank, phrase asc`)\n    }\n    // let stmt = db.prepare(`select * from sign where phrase like \"%${query.data}%\"`)\n\n    // let stmt = db.prepare(`\n    // select * from sign_fts\n    // where phrase match \"${query.data}*\"\n    // `)\n\n    // stmt.bind({$phrase:query.data})\n    let result = []\n    while (stmt.step()) result.push(stmt.getAsObject());\n    // postMessage(JSON.stringify(result))\n    postMessage(result)\n    // postMessage('lol')\n    // console.log(db.exec(`select * from sign where phrase like \"%${query.data}%\"`))\n  }\n  if(firstRun){\n    firstRun = false;\n    console.log('first run')\n    postMessage('ready')\n  }\n}\n\nrun()\n\nasync function* makeTextFileLineIterator(fileURL) {\n  const utf8Decoder = new TextDecoder(\"utf-8\");\n  let response = await fetch(fileURL);\n  let reader = response.body.getReader();\n  let {value: chunk, done: readerDone} = await reader.read();\n  chunk = chunk ? utf8Decoder.decode(chunk, {stream: true}) : \"\";\n\n  let re = /\\r\\n|\\n|\\r/gm;\n  let startIndex = 0;\n\n  for (;;) {\n    let result = re.exec(chunk);\n    if (!result) {\n      if (readerDone) {\n        break;\n      }\n      let remainder = chunk.substr(startIndex);\n      ({value: chunk, done: readerDone} = await reader.read());\n      chunk = remainder + (chunk ? utf8Decoder.decode(chunk, {stream: true}) : \"\");\n      startIndex = re.lastIndex = 0;\n      continue;\n    }\n    yield chunk.substring(startIndex, result.index);\n    startIndex = re.lastIndex;\n  }\n  if (startIndex < chunk.length) {\n    // last line didn't end in a newline char\n    yield chunk.substr(startIndex);\n  }\n}\n\nfunction processLine(line){\n  console.log(line)\n}\n\nasync function lineDoer(){\n  for await (let line of makeTextFileLineIterator('data.txt')) {\n    processLine(line);\n  }\n}\n\n// lineDoer()\n\nasync function* splitTextFileBySemicolon(fileURL) {\n  const utf8Decoder = new TextDecoder(\"utf-8\");\n  let response = await fetch(fileURL);\n  let reader = response.body.getReader();\n  let {value: chunk, done: readerDone} = await reader.read();\n  chunk = chunk ? utf8Decoder.decode(chunk, {stream: true}) : \"\";\n\n  let re = /;/gm;\n  let startIndex = 0;\n\n  for (;;) {\n    let result = re.exec(chunk);\n    if (!result) {\n      if (readerDone) {\n        break;\n      }\n      let remainder = chunk.substr(startIndex);\n      ({value: chunk, done: readerDone} = await reader.read());\n      chunk = remainder + (chunk ? utf8Decoder.decode(chunk, {stream: true}) : \"\");\n      startIndex = re.lastIndex = 0;\n      continue;\n    }\n    yield chunk.substring(startIndex, result.index);\n    startIndex = re.lastIndex;\n  }\n  if (startIndex < chunk.length) {\n    // last line didn't end in a newline char\n    yield chunk.substr(startIndex);\n  }\n}\n\n//# sourceURL=webpack://absurd-example-project/./src/index.worker.js?");

/***/ }),

/***/ "?6b37":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://absurd-example-project/crypto_(ignored)?");

/***/ }),

/***/ "?180a":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://absurd-example-project/fs_(ignored)?");

/***/ }),

/***/ "?2a46":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://absurd-example-project/path_(ignored)?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_jlongster_sql_js_dist_sql-wasm_js-node_modules_absurd-sql_dist_index_js--b6e0c4"], () => (__webpack_require__("./src/index.worker.js")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_index_worker_js": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkabsurd_example_project"] = self["webpackChunkabsurd_example_project"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e("vendors-node_modules_jlongster_sql_js_dist_sql-wasm_js-node_modules_absurd-sql_dist_index_js--b6e0c4").then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;