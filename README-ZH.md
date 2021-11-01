## Quick Start
### install

+ create sandbox
```
const sandbox = new ProxySandbox();
```
+ active sandbox and run your code
```
sandbox.activate();
(function(window){
    // your code
}(sandbox.proxy))
```

+ please deactivate the sandbox after not using it
```
sandbox.deactivete();
```
