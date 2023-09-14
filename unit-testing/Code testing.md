What is the goals of testing code?
To make sure no regressions in behavior happens when code change.

Code change: Ideally when we change the old code by adding new behavior or refactor, then existing tests should not change.

When part of the code change includes new dependencies or design of the code is changed, it will also change the unit tests.

To not have to change the tests every time the code changes ideally tests should be written to not depend on the function implementation, meaning the function signature and its references to global variables and other functions.

The big 1 million dollar problem here is impure functions. Functions that have side effects and reference global variables. Modifying objects is also related but not necessarily bad when it comes to unit testing.

Renaming is relatively cheap to do and is not the problem that makes tests unmanageable. Simple search and replace, or IDE rename features makes this a non problem.

Adding an optional parameter to a function is also not a problem to our tests maintenance.

Changing a parameter, including removing it, is however a breaking change in terms of unit testing.

Return value and type can be a breaking change but is a rare occurrence and would likely mean that many other things are changing too as part of a rewrite or part of 
a bigger change.

Looking at the body. The implementation of the function. When the function is a pure implementation, the testing is easy and straight forward.

Impure functions is not so easy. Especially when running multiple tests. If one test updates a global variable, it may break another test.

Each time a global variable is used, a test must setup the global variable state before the test runs, and potentially teardown afterwards again. Problem is tracking when a function is using a global variable or a new one is added. It might not be immediately obvious that a test has been broken, since it might become dependent on execution order.

Similar to global variables, having other side effects like making a fetch request or reading from the file system requires a setup and teardown/cleanup to make sure the test can run without problems.

With side-effects its not always possible to setup and teardown though, and sometimes it requires a lot of effort. For this reason, we might have to write our code in a special way to make it testable, for example by using dependency injection.

```ts
import fs from 'fs';

function getLogs(): string[] {
	return await fs.readAllFiles('/path/to/logs', 'utf8');
}

// dependency injection
function getLogs(fs: FileSystem): string[] {
	return await fs.readAllFiles('/path/to/logs', 'utf8');
}
```

With this approach we can swap out the FileSystem with an in memory implementation for our test.

Another approach is mocking. Mocking has a similar problem as global variables though: Its not always easy to keep track of which impure functions are mocked and which isn't.

Also how much of the fs module should be mocked? It can be quite a big task to make an in-memory replacement. Many mock just the functions used inside the implementation. Problem is that we now tie the in memory implementation with the function implementation.

At this point it becomes clear that no matter the approach, our tests will either depend on the internals of the function, or the function will have to be written specifically to be testable, by exposing the impure internals in the code signature as dependencies.

Alternatively if the code could throw an error while running inside tests because the side effects needs to be "setup", that would work too, as we don't have to manually track it.

Now if we want to avoid changing tests often, we will need to keep our code testable or setup test environment to error when side-effects are triggered.



TODO:
- Arrange act assert, and having well structured tests
- Naming tests
- Compound functions

