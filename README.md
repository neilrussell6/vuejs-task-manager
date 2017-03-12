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
