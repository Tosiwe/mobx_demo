import {observable, action, computed, autorun, reaction, when} from 'mobx';
import commonStore from './commonStore';

class mainStoreClass {
    constructor(){
        when(() => this.hasNotFinished.length === 0, () => {
            this.disposer();
            this.reaction();
        });
    }
    @observable todos = [
        {'id': 1, 'taskName': 'task1', 'finished': true},
        {'id': 2, 'taskName': 'task2', 'finished': false},
        {'id': 3, 'taskName': 'task3', 'finished': true},
        {'id': 4, 'taskName': 'task4', 'finished': false},
        {'id': 5, 'taskName': 'task5', 'finished': true},
        {'id': 6, 'taskName': 'task6', 'finished': false},
    ];
    activeItem = observable.box(1);
    @computed get activeTodo(){
        const activeTodoData = this.todos.filter(item => item.id === this.activeItem.get());
        if(activeTodoData.length){
            return activeTodoData[0];
        }
        return activeTodoData;
    }
    @computed get hasNotFinished(){
        return this.todos.filter(item => item.finished === false);
    }
    disposer = autorun(() => {
        console.log(`autorun : Now the active ID is ${this.activeItem.get()}`);
    });
    reaction = reaction(() => this.todos.filter(item => item.finished === false), notFinished => {
        if(notFinished.length === 0){
            console.log('All tasks have been completed, and autorun and reaction are no longer executed.');
            // 直接调用commonStore的action
            commonStore.stopTime();
        }else {
            console.log(`reaction : Now the active ID is ${this.activeItem.get()}`);
        }
    });

    @action changeActiveItem(activeId){
        this.activeItem.set(activeId);
    }
    @action handleFinished(finished){
        this.activeTodo.finished = finished;
    }
    @action handleAddTask(state){
        const newTask = {'id': this.todos.length + 1, 'taskName': `task${this.todos.length + 1}`, 'finished': state};
        this.todos.push(newTask);
    }
}
const mainStore = new mainStoreClass();

export default mainStore;