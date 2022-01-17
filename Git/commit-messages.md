# Structure
* ```<type>(<scope>): <subject>```

### Message subject allowed <type> values: 
* feat
  * for a new feature for the user, not a new feature for build script. Such a commit will trigger a release bumping a MINOR version.
* fix
  * for a bug fix for the user, not a fix to a build script. Such a commit will trigger a release bumping a PATCH version. 
* perf
  * for performance improvements. Such a commit will trigger a release bumping a PATCH version. 
* docs
  * for changes to the documentation. 
* style
  * for formatting changes, missing semicolons, etc. 
* refactor
  * for refactoring production code, e.g. renaming a variable. 
* test
  * for adding missing tests, refactoring tests; no production code change. 
* build
  * for updating build configuration, development tools or other changes irrelevant to the user.

Example:

```fix(middleware): ensure Range headers adhere more closely to RFC 2616```
