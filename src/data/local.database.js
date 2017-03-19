import Dexie from 'dexie';

// local
const DB_NAME = 'neilrussell6-vuejs-task-manager';
const DB_VERSION = 8;

// create db

const db = new Dexie(DB_NAME);

db.version(DB_VERSION).stores({
    users: '&uuid',
    projects: '&uuid, user_uuid',
    tasks: '&uuid, user_uuid, project_uuid'
});

db.open()
    .catch('MissingApiError', (e) => {
        console.error("IndexedDB is not supported by your browser");
    })
    .catch((e) => {
        console.error(e.message);
    });

export default db;