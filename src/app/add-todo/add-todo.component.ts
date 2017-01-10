import { Component, Inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

import { stateAndDispatcher, dispatcher, state } from '../shared';
import { AppState, Action, AddTodoAction } from '../appState';

@Component({
    selector: 'add-todo',
    template: `
        <input [(ngModel)]="text" (keydown.Enter)="addTodo()">
        <button [disabled]="isTextEmpty" (click)="addTodo()">Add Todo</button>
    `,
    providers: stateAndDispatcher,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTodoComponent implements OnInit {
    private nextId: number = 0;
    private text: string;

    constructor(
        @Inject(state) private state: Observable<AppState>,
        @Inject(dispatcher) private dispatcher: Observer<Action>,
        private chgDet: ChangeDetectorRef) {
        // nothing to do here
    }

    public ngOnInit(): void {
        this.resetText();
        this.state.forEach(s => {
            this.nextId = s.todos.length;
        }); 
    }

    public get isTextEmpty(): boolean {
        return this.text === '';
    }

    public addTodo(): void {
        this.chgDet.markForCheck();
        if (this.isTextEmpty === false) {
            const action: AddTodoAction = new AddTodoAction(this.nextId++, this.text); 

            this.dispatcher.next(action);

            this.resetText();
        }
    }

    private resetText(): void {
        this.text = '';
    }
}