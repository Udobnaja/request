export class Request{
    constructor(){
        this._queue = [];
        this._saved = null;
    }

    get(url, resolve, reject) {

        // const url = (Object.prototype.toString.call(options) === '[object Object]') ? options.url : options;
        // YOu can check options via args length
        // Создать абстракцию над всеми методами ?

        this._required(url, resolve, reject)._checkTypes({url, resolve, reject});

        this._queue.push(this._createRequest({url, method: 'GET'}, resolve, reject));

        return this;
    }

    post(url, body, resolve, reject) {

        this._required(url, body, resolve, reject)._checkTypes({url, resolve, reject});

        this._queue.push(this._createRequest({url, method: 'POST', body}, resolve, reject));

        return this;
    }

    put(url, body, resolve, reject) {

        this._required(url, body, resolve, reject)._checkTypes({url, resolve, reject});

        this._queue.push(this._createRequest({url, method: 'PUT', body}, resolve, reject));

        return this;
    }

    patch(url, body, resolve, reject) {
        this._required(url, body, resolve, reject)._checkTypes({url, resolve, reject});

        this._queue.push(this._createRequest({url, method: 'PATCH', body}, resolve, reject));

        return this;
    }

    delete(url, resolve, reject) {
        this._required(url, resolve, reject)._checkTypes({url, resolve, reject});

        this._queue.push(this._createRequest({url, method: 'DELETE'}, resolve, reject));

        return this;
    }

   _createRequest({url, method, body}, resolve, reject){
        const options = (body) ? { method } : { method, body: JSON.stringify(body) };
        return async () => {
            try {
                const response = await fetch(url, options);
                const json = await response.json();
                this._saved = await resolve(json, this._saved);
            } catch (e){
                reject(e);
                throw Error(e);
            }
        }

       // return  function* (last){
       //     try {
       //         const response = yield fetch(url, options);
       //         const json = yield response.json();
       //         return yield resolve(json, last);
       //     } catch (e){
       //         reject(e);
       //         throw Error(e);
       //     }
       // }
    }

    async done() {
        for (const f of this._queue){
            await f();
         //   //  let g = {};
         //   // g[Symbol.iterator] = f;
         //   //  for (let value of g){
         //   //      console.log(value);
         //   //  }
         //
         //    const interator = f();
         //    const promise = interator.next().value;
         //    // console.log(promise);
         //    promise.then((resolved) => {
         //        interator.next(resolved);
         //    }).then(res => {
         //        interator.next(res);
         //    });
         //
         // //
         // //    for ()
         // //    const g = f().next();
         // //
         // // g.value.then(e => console.log(e));

        }

        this._clear();
    }

    _clear() {
        this._queue = [];
        this._saved = null;
    }

    _checkTypes({url, resolve, reject}){
        this._isString(url)
            ._isFunction(resolve)
            ._isFunction(reject);
    }

    _required(...args) {
        for (const arg of args){
            if (typeof arg === 'undefined'){
                throw new Error('All params are required');
            }
        }

        return this;
    }

    _isString(url) {
        if (typeof url !== 'string'){
            console.log(url);
            throw new Error('The url should be a string');
        }

        return this;
    }

    _isFunction(callback) {
        if (typeof callback !== 'function'){
            throw new Error('Callback should be a function');
        }

        return this;
    }

}

// options
// url: string | { url: string, options: { method, headers, body, mode, credentials, cache, redirect, referrer, referrerPolicy, integrity, keepalive, signal }