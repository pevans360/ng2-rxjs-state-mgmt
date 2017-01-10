import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule }  from '@angular/common';
import {TodoComponent} from './todo/todo.component';
import {TodoList} from './todo-list.component';
import {FilterSelectorComponent} from '../filter-selector/filter-selector.component';
import {FilterLink} from '../filter-selector/filter-link/filter-link.component';
import {AddTodoComponent} from '../add-todo/add-todo.component';


@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [TodoComponent, TodoList, FilterSelectorComponent, FilterLink, AddTodoComponent],
    providers: [],
    exports: [TodoComponent, TodoList, FilterSelectorComponent, FilterLink, AddTodoComponent]
})

export class TodoModule { }

