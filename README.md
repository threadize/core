# Threadizer

Run code within a worker (or main-thread as fallback).

## Install
The project is [published on npm](https://www.npmjs.com/package/@threadizer/core)
```
npm install @theadizer/core
```

## Quick start
```javascript
import Threadizer from "@threadizer/core";

// ...

const thread = new Threadizer(( thread )=>{

    console.log("Executed within a Worker", thread);

});

```
See more on the [github page](https://threadizer.github.io/core/)

## Class

### Property

 - `worker`: the instance of [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) or a `Function` if `insideMainThread` is set to `true`.
 
### Methods

#### constructor( `application`, `extension`, `insideMainThread` )
Leave `application` empty if you dont want the worker to be automaticaly created.

 - `application`: *(Function|URL)* **Optional** The application (Function) to run within the worker or the worker direct file itself.
 - `extension`: *(Function)* **Optional** Function launched to extends the worker-manager (add global methods, libraries, variables, ...).
 - `insideMainThread`: *(Boolean)* **Optional** Set to `true` if the application must run in main thread (no Worker involved). Default `false`.

#### async compile( `application`, `extension`, `insideMainThread` )
Compile the application, manager and its extension.
That method is called by the constructor if `application` is defined or you can call it at any moment.

 - `application`: *(Function|URL)* **Optional** The application (Function) to run within the worker or the worker direct file itself.
 - `extension`: *(Function)* **Optional** Function launched to extends the worker-manager (add global methods, libraries, variables, ...).
 - `insideMainThread`: *(Boolean)* **Optional** Set to `true` if the application must run in main thread (no Worker involved). Default `false`.

#### async run()
Run the application within a worker or not depending on previously compiled method call.

#### transfer( `type`, `data` )
Send data as event from main thread to application

 - `type`: *(String)* The name of the event to transfer to the worker.
 - `data`: *(Any)* **Optional** Data or content to transfer to the worker.

#### destroy()
Terminate the application.

#### static isTransferable( value )
Return true if value is transferable between main-thread and worker.

#### on( `type`, `action`, `options` )
Add event listener to the class.
 - `type`: *(String)* The name of the event to listen.
 - `action`: *(Function)* The action to run when event is dispatched.
 - `options`: *(Boolean|Object)* Prevent bubbling with `false` or make non-passive with `{ passive: false }` or make it callable once with `{ once: true }`.

#### off( `type`, `action`, `options` )
Remove event listener from the class that match one or all parameters.
 - `type`: *(String)* The name of the event to remove.
 - `action`: *(Function)* **Optional** The action registered to the event.
 - `options`: *(Boolean|Object)* **Optional** The options registered to the event.

#### dispatch( `type`, `options`, `callback` )
Dispatch event that match one or all parameters.
Return a `Promise`.
 - `type`: *(String)* The name of the event to remove.
 - `options`: *(Any)* **Optional** The options passed to the creation of the [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
 - `callback`: *(Function)* **Optional** A callback triggered inside the event action by calling `event.complete()`.

## Application (worker or main thread)

You can access the global variable `thread` within your application code which also contains the methods (reversed) `on()`, `off()`, `dispatch()` and `transfer()` and `static isTransferable()`.
In your application, `self` refer to the current context (`worker` or `window`).

### Property

 - `isWorker`: `true` if a worker, `false` if running on main thread.
