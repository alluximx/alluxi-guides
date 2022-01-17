## Branches control
* Each project will have at leas two branches for control
  * main / master
  * develop
  
* Each branch will follow the ```gitflow``` structure
## Branch naming
  * Type: feature
    * Any code changes for a new module or use case should be done on a feature branch.
    * This branch is created based on the current development branch. 
    * When all changes are Done, a Pull Request/Merge Request is needed to put all of these to the development branch.
    * Use all lower caps letters and hyphen (-) to separate words unless it is a specific item name or ID.
    * Use underscore (_) to separate the ID and description.
    
    ```
    feature/JIRA-1234
    feature/JIRA-1234_support-dark-theme
    ```
  
  * Type: bugfix
    * If the code changes made from the feature branch were rejected after a release, sprint or demo, any necessary fixes after that should be done on the bugfix branch.
    * When all changes are Done, a Pull Request/Merge Request is needed to put all of these to the development branch.
    ```
    bugfix/more-gray-shades
    bugfix/JIRA-1444_gray-on-blur-fix
    ```

  * Type: hotfix
    * If there is a need to fix a blocker, do a temporary patch, apply a critical framework or configuration change that should be handled immediately.
    * It does not follow the scheduled integration of code and could be merged directly to the production branch, then on the development branch later.
    
    ```
    hotfix/disable-endpoint-zero-day-exploit
    hotfix/increase-scaling-threshold
    ```
    
  * Type: experimental
    * Any new feature or idea that is not part of a release or a sprint. A branch for playing around.
    * This branch won't be merged to master or develop
    ```
    experimental/dark-theme-support
    ```
