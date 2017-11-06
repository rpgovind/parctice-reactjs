import {Store} from './Store';


export class ReduceStore extends Store {
    constructor(dispatcher){
        super(dispatcher);
    }

    reduce (action ,state){
        throw new Error('Sub class must implement reduce method of a Flux reduxe store');
    }

    __onDispatch(action){
        const newState = this.reduce(this.__state, action);

        if(newState !== this.__state){
            this.__state = newState;
            this.__emitChange();
        }
    }
}