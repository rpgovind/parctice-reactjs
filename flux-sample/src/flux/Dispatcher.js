export class Dispatcher{
    constructor(){
        this.__listeners = [];
    }

    dispatch(action){
        // debugger;
        this.__listeners.forEach(listener => listener(action));
    }

    register(listener){
        this.__listeners.push(listener);
    }
}