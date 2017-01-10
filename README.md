# another-ng2-rxjs-state-todo-app
Update of code from Milea Razvan based on Tackling State blog post by Victor Savkin: 

https://vsavkin.com/managing-state-in-angular-2-applications-caf78d123d02#.f8r5puje5

Runs on versions: 
 - node: 6.3.0
 - npm: 3.10
 - angular: 2.3.1
 - angular-cli: 1.0.0-beta.24

Made the following changes: 
 - Updated to run on production release of Angular including modules.
 - Moved all application-specific code related to state to a separate file (appState.ts).  This leaves stateAndDispatcher.cs with generic state-handling logic only.  
 - Changed stateFn function to use an array of "reducer" functions rather than specifying each one individually.  Makes it a little more extensible.  
 - Using ChangeDetectionStrategy = OnPush in key components.  This inhibits the whole component tree from getting updated every time a character is added to a new todo name.  
 - Added in a class (Criteria) to test maintaining state as attributes of a class.  Should help in organizing state data.  
 - Added comments esp. in stateAndDispatcher and appState.  
