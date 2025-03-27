
# simple-task-app-server
Server for the back-end of the app.
* routes/tasks-router.js - Routes for handling task requests.
* index.js - Creates the Express server.
* db.js - Provides functions for database interactions.

## Route  Test Cases (TODO: automate)

### All Routes 
| Test Case | Expected Result |
| --- | --- |
| Database can't be used | Error message returned |

### POST /tasks
| Test Case | Expected Result |
| --- | --- |
| Provide title and description | New task inserted into database and returned |
| Provide only a title | New task inserted into database and returned |
| Don't provide a title | Error message returned |

### GET /tasks
| Test Case | Expected Result |
| --- | --- |
| Request | All tasks are returned |

### GET /tasks/:taskId
| Test Case | Expected Result |
| --- | --- |
| Request taskId | Specified task is returned |
| Request taskId that isn't in database | Error message returned |

### PUT /tasks/:taskId
| Test Case | Expected Result |
| --- | --- |
| Request taskId, provide title and description | Specified task is updated with new title and description and is returned |
| Request taskId, provide only title | Specified task is updated with new title, null description, and is returned |
| Request taskId, don't provide title | Error message returned |
| Request taskId not in database | Error message returned |

### DELETE /tasks/:taskId
| Test Case | Expected Result |
| --- | --- |
| Request taskId | Specified task is deleted and returned |
| Request taskId not in database | Error message returned |

### PUT /tasks/:taskId/completion?completed=\<true or false\>
| Test Case | Expected Result |
| --- | --- |
| Request taskId and no query param | Error message returned |
| Request taskId and completed query param is not true or false| Error message returned |
| Request taskId and query param completed is set to either true or false | Task is updated appropriately and returned |
| Request taskId not in database | Error message returned |