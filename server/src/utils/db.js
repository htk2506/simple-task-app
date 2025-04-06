/**
 * Defines functions for interacting with the Postgres database.
 */

require('dotenv').config();
const pg = require('pg');

// Create the pool
const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URI });

/**
 * Use a pg pool to query the database. Returns a Promise for the result.
 * @param {string} text - Text for the query.
 * @param {[any]} params - Parameters to use in the query.
 * @param {(err: Error, result: QueryResult<R>) => void} callback - Callback function.
 * @returns {Promise}
 * @throws Throws errors related to database queries.
 */
const poolQuery = (text, params, callback) => {
    return pool.query(text, params, callback);
}

// TODO: Use userId for each method

/**
 * Insert a task to the database.
 * @param {string} userId 
 * @param {string} title 
 * @param {string} description 
 * @returns {Promise} Task that was inserted. 
 * @throws Throws errors related to database queries.
 */
const insertTask = async (userId, title, description) => {
    const queryResult = await poolQuery('INSERT INTO tasks (title,description) VALUES($1,$2) RETURNING *', [title, description]);
    return queryResult.rows[0];
}

/**
 * Get all of a user's tasks.
 * @param {string} userId 
 * @returns Array of objects representing user's tasks.
 * @throws Throws errors related to database queries.
 */
const getTaskList = async (userId) => {
    const queryResult = await poolQuery('SELECT * FROM tasks');
    return queryResult.rows;
}

/**
 * Get one of a user's tasks.
 * @param {string} userId - Make sure the task belongs to this user.
 * @param {string} taskId - ID of the task.
 * @returns The task.
 * @throws Throws errors related to database queries.
 */
const getTaskForUser = async (userId, taskId) => {
    const queryResult = await poolQuery('SELECT * FROM tasks WHERE task_id=$1', [taskId]);
    return queryResult.rows[0];
}

/**
 * Update one of a user's tasks.
 * @param {string} userId 
 * @param {string} taskId 
 * @param {string} title - Should not be null. Pass in the old value even if it is unchanged.
 * @param {string} description - Pass in old value if it should not change.
 * @param {boolean} completed - Pass in old value if it should not change.
 * @returns The updated task.
 * @throws Throws errors related to database queries.
 */
const updateTaskForUser = async (userId, taskId, title, description, completed) => {
    const queryResult = await poolQuery('UPDATE tasks SET title=$1,description=$2,completed=$3 WHERE task_id=$4 RETURNING *', [title, description, completed, taskId]);
    return queryResult.rows[0];
}

/**
 * Delete a task.
 * @param {string} userId 
 * @param {string} taskId 
 * @returns The deleted task.
 * @throws Throws errors related to database queries.
 */
const deleteTask = async (userId, taskId) => {
    const queryResult = await poolQuery('DELETE FROM tasks WHERE task_id=$1 RETURNING *', [taskId]);
    return queryResult.rows[0];
}

/**
 * Mark task completion.
 * @param {string} userId 
 * @param {string} taskId 
 * @param {boolean} isCompleted
 * @returns The updated task.
 * @throws Throws errors related to database queries.
 */
const markTaskCompletion = async (userId, taskId, isCompleted) => {
    const queryResult = await poolQuery('UPDATE tasks SET completed=$1 WHERE task_id=$2 RETURNING *', [isCompleted, taskId]);
    return queryResult.rows[0];
}

// Export functions
module.exports = {
    pool,
    poolQuery,
    insertTask,
    getTaskList,
    getTaskForUser,
    updateTaskForUser,
    deleteTask,
    markTaskCompletion
}
