import { Observable } from 'rxjs/Rx';

// Define data required to maintain application state.  
// This includes state variables e.g. basic types, classes, arrays, etc.

// The initialState of each variable must be defined.  

// Also, actions that define possible changes to state an associated payloads.
// For example, if marketAreaID is defined as a state variable, there may be
// an action SETMARKETAREAID that is invoked when the user selects a
// new market area.  The associated payload will be the new marketAreaID.  

// Also, a function for each state variable which: 
// - accepts the current value (state) of the variable and an 
//   Observable of type Action (Observable<Action>)
//   with information about how the state will be changed i.e. new value of 
//   the variable.  
// - return an Observable with the same type as the state variable.  
//   That is, if the state variable is a string, the function must
//   return Observable<string>.  If the state variable is a class, 
//   the function must return an Observable with the type of the class
//   e.g. if there is a state variable of type Criteria, the
//   function must return Observable<Criteria>

export class ActionClass {
    constructor() {
        let x = 1;
    }
}

// Class
// !!!!! State actually has an ARRAY of ToDoItems

export class ToDoItem {
    constructor(public id: number, public text: string, public completed: boolean = false) { }
}

// Class
//
// This tests storing state as properties in an object
// Change one property at a time
// Is this easier than just storing everything independently?
//
export class Criteria {
    constructor(public marketAreaID: number, public propertyTypeID: number) { }
}


// A reducer function accepts 2 parameters:
// - the current state of a state variable
// - an Observable of type action (Observable<Action>).  An action is a class that may contain "payload" attributes. 

// It returns an Observable.  The type of the Observable is the same type as the state variable.  
// So if the state variable is a string, it returns Observable<string>.  If the state variable
// is a class, it returns an Observable typed to that class e.g. Observable(Criteria)

// There is generally one reducer function for each combination of action and state variable. 

// ALL reducer functions are stored in the 'reducers' array.  In the following sections, 
// each state variable pushes it's reducer function into the array.  

export const reducers = [];


// ----------------------------------------------------------------
// TODO

// Actions/Reducers

// Add ToDo
export class AddTodoAction extends ActionClass {
    // super() calls the parent constructor
    constructor(public todoId: number, public text: string) {
        super();
    }
}

reducers.push(function todos(initState: any, actions: Observable<Action>): Observable<ToDoItem> {
    return actions.scan((state, action) => {
        if (action instanceof AddTodoAction) {
            const newTodo = {
                id: action.todoId,
                text: action.text,
                completed: false
            };
            return [...state, newTodo];
        } else {
            return state.map(t => updateTodo(t, action));
        }
    }, initState.todos);
});

// Toggle ToDo
export class ToggleTodoAction extends ActionClass {
    constructor(public id: number) { super(); }
}

var updateTodo = function updateTodo(todo: ToDoItem, action: Action): ToDoItem {
    if (action instanceof ToggleTodoAction) {
        return (action.id !== todo.id) ? todo : merge(todo, { completed: !todo.completed });
    } else {
        return todo;
    }
}

function merge(todo: ToDoItem, props: any): any {
    return Object.assign({}, todo, props);
}
// ----------------------------------------------------------------
// VISIBILITY

// Actions/Reducers
export class SetVisibilityFilter extends ActionClass {
    constructor(public filter: string) {
        super();
    }
}

//reducers.push(function filter(initState: string, actions: Observable<Action>): Observable<string> {
reducers.push(function filter(initState: any, actions: Observable<Action>): Observable<string> {
    return actions.scan((state, action) => {
        if (action instanceof SetVisibilityFilter) {
            return action.filter;
        } else {
            return state;
        }
    }, initState.visibilityFilter);
});



// ----------------------------------------------------------------
// CRITERIA

// Actions/Reducers

export class SetPropertyTypeID extends ActionClass {
    constructor(public propertyTypeID: number) {
        super();
    }
}
 
reducers.push(function setPropertyType(initState: any, actions: Observable<Action>): Observable<Criteria> {
    return actions.scan((state, action) => {
        if (action instanceof SetPropertyTypeID) {
            let crit: Criteria;
            crit = state as Criteria;
            crit.propertyTypeID = action.propertyTypeID;
            crit.marketAreaID = -1;

            return crit;
            //return new Criteria(0, 1);
        } else {
            return state;
        }
    }, initState.criteria);
});

export class SetMarketAreaID extends ActionClass {
    constructor(public marketAreaID: number) { super(); }
}

// setMarketArea reducer here ... 

// ----------------------------------------------------------------

// APPSTATE
export class AppState {
    public todos: Array<ToDoItem>;
    public visibilityFilter;
    public criteria: Criteria;
    constructor() { }
}

// INITIAL VALUES
export const initialStateValues = {
    todos: [
        new ToDoItem(0, 'Exercise', false),
    ],
    visibilityFilter: 'SHOW_ALL',
    criteria: new Criteria(0, 0)
}

// ACTIONS
export type Action = AddTodoAction | ToggleTodoAction | SetVisibilityFilter
    | SetMarketAreaID | SetPropertyTypeID;

// COMBINE
export const combine = s => ({ todos: s[0], visibilityFilter: s[1], criteria: s[2] });     // combine takes the result of zip and creates modified state
