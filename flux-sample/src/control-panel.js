import { Dispatcher, Store } from './flux';

const controlPanelDispatcher = new Dispatcher();
const UPDATE_USERNAME = 'UPDATE_USERNAME';
const userNameUpdateAction = (name) =>{
    return {
        type : UPDATE_USERNAME,
        value : name
    };
}

const UPDATE_FONTSIZE = 'UPDATE_FONTSIZE';
const fontSizeUpdateAction = (fontSize) =>{
    return {
        type : UPDATE_FONTSIZE,
        value : fontSize
    };
}

document.getElementById('userNameInput')
    .addEventListener('input', (target)=>{
        const name = target.currentTarget.value;
        console.log('Dispatching ...' + name);
        controlPanelDispatcher.dispatch(userNameUpdateAction(name));
    });

document.forms.fontSizeForm.fontSize.forEach(element=>{
    element.addEventListener('change', (target)=>{
        let fontSize = target.currentTarget.value;
        console.log('Dispatching ...' + fontSize);
        controlPanelDispatcher.dispatch(fontSizeUpdateAction(fontSize));
    });
})

class UserPreferenceStore  extends Store{
    getInitialState(){
        return {
            userName : 'George',
            fontSize : 'small'
        };
    }

    __onDispatch(action){
        switch(action.type){
            case UPDATE_FONTSIZE:
                this.__state.fontSize = action.value;
                this.__emitChange();
                break;
            case UPDATE_USERNAME:
                this.__state.userName = action.value;
                this.__emitChange();
                break;
        }
        console.log('Store received dispatch ', action);
    }
}

const userPreferenceStore = new UserPreferenceStore(controlPanelDispatcher);
userPreferenceStore.addListener((state)=>{
    console.info('current state is ', state);
    render(state);
})

const render = ({userName, fontSize})=>{
    document.getElementById('userName').innerText = userName;
    document.getElementsByClassName('container') [0].style.fontSize =  (fontSize === "small" ? "12px" : "24px");
    document.forms.fontSizeForm.fontSize.value = fontSize;

};
controlPanelDispatcher.register(action => {
    // debugger;
    console.info('Received action ...', action);
});