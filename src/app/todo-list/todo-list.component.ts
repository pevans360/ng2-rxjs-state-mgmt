import { Component, Inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Observable, BehaviorSubject, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import {AppState, ToDoItem} from '../appState';
import { stateAndDispatcher, state, dispatcher } from '../shared/stateAndDispatcher';
import { Action, ToggleTodoAction, SetMarketAreaID, SetPropertyTypeID } from '../appState';
import { TodoComponent } from './todo';

@Component({
    selector: 'todo-list',
    template: `
        <todo *ngFor="let t of filtered | async" 
                [text]="t.text" 
                [completed]="t.completed"
                [id]="t.id"
                (toggle)="emitToggle($event)">
        </todo>
        <br /><br />
        <span>Test setting state in attribute of a class:</span><br />
        <button (click)="emitPropertyType()">Toggle Prop Type</button>
        <span>Prop type: {{sPropType}}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
    //directives: [TodoComponent],
})
export class TodoList {
    constructor( @Inject(state) private state: Observable<AppState>,
        @Inject(dispatcher) private dispatcher: Observer<Action>,
        private chgDet: ChangeDetectorRef) {
    }

    sPropType: string = 'InitVal';

    setPropType = this.state.subscribe(x =>
        this.sPropType = x.criteria.propertyTypeID.toString()
    );

    public get filtered() {
        return this.state.map(s => this.getVisibleTodos(s.todos, s.visibilityFilter));
    }

    public emitToggle(data) {
        const action: ToggleTodoAction = new ToggleTodoAction(data.id);
        this.dispatcher.next(action);
    }

    public emitPropertyType() {
        let newPropType = this.sPropType == '1' ? 0 : 1;
        const action: SetPropertyTypeID = new SetPropertyTypeID(newPropType);
        this.dispatcher.next(action);
    }

    private getVisibleTodos(todoList: Array<ToDoItem>, visibilityFilter: string): Array<ToDoItem> {
        let items = [];
        todoList.forEach(item => {
            let ok: boolean = false;
            switch (visibilityFilter) {
                case 'SHOW_ALL':
                    ok = true;
                    break;
                case 'SHOW_ACTIVE':
                    ok = item.completed === false;
                    break;
                case 'SHOW_COMPLETED':
                    ok = item.completed === true;
                    break;
                default:
                    ok = false;
            }

            if (ok) {
                items.push(item);
            }
        });

        return items;
    }
}