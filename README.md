VueJS Task Manager
==================

Install
-------

`git clone` & `npm install`:

```
git clone https://github.com/neilrussell6/vuejs-task-manager.git
cd vuejs-task-manager
npm install
```

Usage
-----

Run dev server

```bash
make serve
```

Will automatically open `http://localhost:8080/` in your browser.

Local & Server data sync
------------------------

All CRUD operations are processed as follows:

 1. actioned locally (in browser storage)
 2. then a request is sent to server,
    and if the request fails then the it is added to a queue.

Whenever the app sucessfully connects to the server, the app is frozen while the request queue is processed.
This is done before the server request is executed, so local data take preference over server data.
eg.
 * you are offline
 * you create a project called AAA
 * a request to update the project is enqueued
 * you go online
 * you edit project AAA
 * the request queue is processed before the edit request is sent,
   this ensures that project AAA is created on the server before it is edited.

Make commands
-------------

 * **todo** – Lists all TODOs in JavaScript.
 * **jslint** – Lints JavaScript.
 * **jslint-w** – Lints source JavaScript and watches files for change.
 * **sasslint** – Lints SASS.
 * **sasslint-w** – Lints SASS and watches files for change.
 * **test** – Tests the source JavaScript.
 * **test-w** – Tests the source JavaScript and watches files for change.
 * **coverage** – Generates a testing coverage report for source JavaScript.
 * **serve** – Runs webpack-dev-server with live reloading.
 * **build** – Creates a production build for distribution and copies assets directory.
 * **push** – Pushes local repository to GitHub.
 * **publish** – Creates a new GitHub release. [ MESSAGE ]

TODO
----

 * Consolodate multiple enqueued requests on the same resource.
 * Check local and server modified dates when processing data and prioritise most recent (currently all local data gets priority).

Roadmap
-------

 * Save user login state in local storage
 * Add ability to delete projects
 * Add ability to edit project name in mobile view
 * Add pagination for tasks
 * Create build for native mobile
 * Create profile section for managing account
 * Add routing and sync state with url routes (eg. /projects/101/tasks)
 * Create signup for public use

License
-------

[MIT](https://github.com/neilrussell6/vuejs-task-manager/blob/master/LICENSE)
