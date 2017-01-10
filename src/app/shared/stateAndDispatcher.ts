import { OpaqueToken } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';

import { Action, ToggleTodoAction, SetVisibilityFilter, AddTodoAction, SetMarketAreaID, SetPropertyTypeID } from '../appState';
import { initialStateValues, reducers, AppState, combine } from '../appState';

export const initState = new OpaqueToken('initState');
export const dispatcher = new OpaqueToken('dispatcher');
export const state = new OpaqueToken('state');

// This is what is actually injected in the app component when using 'providers: stateAndDispatcher'
export const stateAndDispatcher = [
  {
      provide: initState, 
      useValue: initialStateValues
  }, 
  {
      provide: dispatcher, 
      useValue: new Subject<Action>()
  }, 
  {
      provide: state,
      useFactory: stateFn,
      deps: [initState, dispatcher]
  }
];

// Key function that maintains state based on current state and actions
function stateFn(initState: AppState, actions: Observable<Action>): Observable<AppState> {
    // We need to be able to exec all of the reducer functions
    // and pass them state and action parameters.  The statements
    // to exec the reducers (with parameters) are stored in the exec_reducers array.  
    var exec_reducers = [];
    let i = 0;
    for (i = 0; i < reducers.length; i++)
    {
        exec_reducers.push(reducers[i](initState, actions));
    }

    // This merges the results of the reducer functions together (zip)
    // and, using the combine function, puts them into an object that
    // has attributes correspoding to the state variables.  (see appState.ts - combine)
    // This is returned into an Observable< AppState >
    const appStateObs: Observable<AppState> =
        Observable.zip.apply(null, exec_reducers)
            .map(combine);
            //.do(x => console.log(x));

    // wrapIntoBehavior makes the Observable<AppState> available
    // as a BehaviorSubject.  The key characteristic of a BehaviorSubject
    // is that, unlike an Observable,
    // it stores the latest emitted value and makes it immediately
    // available to subscribers.  
    return wrapIntoBehavior(initState, appStateObs);
}

function wrapIntoBehavior(init, obs) { 
  const res = new BehaviorSubject(init); 
  obs.subscribe(s => res.next(s)); 
  return res; 
}
