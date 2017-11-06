import {createStore, combineReducers, applyMiddleware} from 'redux';
import createLogger from 'redux-logger'

export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const OFFLINE = 'OFFLINE';
export const BUSY = 'BUSY';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';


const logger = createLogger({
    // ...options 
    collapsed: (getState, action, logEntry) => !logEntry.error
    
  });
const statusUpdateAction =(value)=>{
    return {
        type : UPDATE_STATUS,
        value
    }
}

const createNewMessageAction = (content, postedBy)=>{
    const date = new Date();
    return {
        type : CREATE_NEW_MESSAGE,
        value : content,
        postedBy,
        date
    }
}
const defaultState = {
    messages :[{
        date : new Date(),
        postedBy : `Stan`,
        content :`I<3 the new productivity app!`
    }],
    userStatus :  'ONLINE'
}

const reducer = ((state=defaultState , {type, value})=>{
    switch(type){
        case UPDATE_STATUS :
        //return copy of state
        return {...state, userStatus:value};
    } 
    return state;
});

const userStatusReducer = ((state = defaultState.userStatus,{type, value})=>{
    switch(type){
        case UPDATE_STATUS :
        //return copy of state
        return value;
    } 
    return state;
});

const messageReducer = ((state = defaultState.messages,{type, value, postedBy, date})=>{
    debugger;
    switch(type){
        case CREATE_NEW_MESSAGE :
            const newState = [{date, postedBy, content:value}, ...state];
            return newState;
    } 
    return state;
});

const combineReducer = combineReducers({
    userStatus : userStatusReducer,
    messages : messageReducer
})
const  store = createStore(combineReducer , applyMiddleware(logger));

const render = () =>{
    const {messages , userStatus} = store.getState();

    document.getElementById('messages').innerHTML = messages
    .sort((a,b) => a.date  - b.date)
    .map(message =>(`
        <div>
        ${message.postedBy} :  ${message.content}
        </div>`))
    .join("");

}

document.forms.newMessage.addEventListener('submit', (e)=>{
    // debugger;
    e.preventDefault();
    store.dispatch(createNewMessageAction(e.target.newMessage.value ,'ishan'));
    document.forms.newMessage.newMessage.value = "";
})
document.forms.selectStatus.status.addEventListener('change', (e)=>{
    // debugger;
    store.dispatch(statusUpdateAction(e.target.value));
})

render();

store.subscribe(render);