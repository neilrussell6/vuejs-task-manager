// ---------------------------
// public
// ---------------------------

export function filterTasks (tasks, value) {
    return tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(value.toLowerCase()) > -1; // TODO: replace with Array.prototype.includes
    });
}
