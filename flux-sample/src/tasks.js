import { generate as id} from 'shortid';
import {Dispatcher, ReduceStore} from  './flux';
const tasksDispatcher = new Dispatcher();

const CREATE_TASK    = 'CREATE_TASK';
const SHOW_TASK      = 'SHOW_TASK';
const COMPLETE_TASK  = 'COMPLETE_TASK';

const createNewTaskAction = (content) =>{
    return {
        type :  CREATE_TASK,
        value : content
    }
}

const showTaskAction = (show) =>{
    return {
        type :  SHOW_TASK,
        value : show
    }
}

const completeTaskAction = (id, content) =>{
    return {
        type :  COMPLETE_TASK,
        id,
        value : content
    }
}

class TasksStore extends ReduceStore {
    getInitialState(){
        return {
            tasks : [
                {
                    id : id(),
                    content : 'Update CSS class',
                    complete : false,
                },
                {
                    id : id(),
                    content : 'Add  Unit test cases',
                    complete : false,
                }
            ]
        }

    }
    reduce(state,action){
        let newState;
        console.log("Processing action",action.type);
        switch(action.type) {
            case CREATE_TASK:
                newState = { ...state, tasks: [ ... state.tasks ]};
                newState.tasks.push({
                    id:id(),
                    content:action.value,
                    complete: false
                });
                return newState;
            case COMPLETE_TASK:
                newState = { ... state, tasks: [ ... state.tasks ]};
                const affectedElementIndex = newState.tasks.findIndex(t=>t.id === action.id);
                newState.tasks[affectedElementIndex] = { ... state.tasks[affectedElementIndex], complete: action.value }
                return newState;
            case SHOW_TASK:
                newState = { ... state, showComplete: action.value };
                return newState;
        }
        return state;
    }
    getState(){
        return this.__state;
    }
}
const tasksStore = new TasksStore(tasksDispatcher);
const render = () => {
    
        const TaskComponent = ({content,complete,id})=>(
            `<section>
            ${content} <input type="checkbox" name="taskCompleteCheck" data-taskid=${id} ${complete ? "checked" : ""}> 
        </section>`
        )
    
        const tasksSection = document.getElementById(`tasks`);
        const state = tasksStore.getState();
        const rendered = tasksStore.getState().tasks
            .filter(task=>state.showComplete ? true : !task.complete)
            .map(TaskComponent).join("");
        tasksSection.innerHTML = rendered;
    
        /* Add listeners to newly generated checkboxes */
        document.getElementsByName('taskCompleteCheck').forEach(element=>{
            element.addEventListener('change',(e)=>{
                const id = e.target.attributes['data-taskid'].value;
                const checked= e.target.checked;
                tasksDispatcher.dispatch(completeTaskAction(id,checked));
            })
        });
    };
    document.forms.newTask.addEventListener('submit',(e)=>{
        e.preventDefault();
        const name = e.target.newTaskName.value;
        if (name) {
            tasksDispatcher.dispatch(createNewTaskAction(name));
            e.target.newTaskName.value = null;
        }
    });
    
    document.forms.undo.addEventListener('submit',(e)=>{
        e.preventDefault();
        tasksStore.revertLastState();
    })
    
    document.getElementById(`showComplete`).addEventListener('change',({target})=>{
        const showComplete = target.checked;
        tasksDispatcher.dispatch(showTaskAction(showComplete));
    });
    
    tasksStore.addListener(()=>{
        render();
    });
    
    render();


// taskDispatcher.dispatch('TEST_DISPATCH');