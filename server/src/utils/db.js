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

/**
 * Insert a task to the database.
 * @param {string} userId 
 * @param {string} title 
 * @param {string} description 
 * @returns {Promise} Task that was inserted. 
 * @throws Throws errors related to database queries.
 */
const insertTask = async (userId, title, description) => {
    const queryResult = await poolQuery(
        'INSERT INTO tasks (title,description,user_id) VALUES($1,$2,$3) RETURNING *',
        [title, description, userId]);

    return queryResult.rows[0];
}

/**
 * Get all of a user's tasks.
 * @param {string} userId 
 * @returns {Promise} Array of objects representing user's tasks.
 * @throws Throws errors related to database queries.
 */
const getTaskList = async (userId) => {
    const queryResult = await poolQuery(
        'SELECT * FROM tasks WHERE user_id=$1',
        [userId]);

    return queryResult.rows;
}

/**
 * Get one of a user's tasks.
 * @param {string} userId 
 * @param {string} taskId
 * @returns {Promise} The task.
 * @throws Throws errors related to database queries.
 */
const getTask = async (userId, taskId) => {
    const queryResult = await poolQuery(
        'SELECT * FROM tasks WHERE (task_id=$1 AND user_id=$2)',
        [taskId, userId]);

    return queryResult.rows[0];
}

/**
 * Update a task to the passed in values. Pass in old values if they should not change.
 * @param {string} userId 
 * @param {string} taskId 
 * @param {string} title - Should not be null. Pass in the old value even if it is unchanged.
 * @param {string} description - Pass in old value if it should not change.
 * @param {boolean} completed - Pass in old value if it should not change.
 * @returns {Promise} The updated task.
 * @throws Throws errors related to database queries.
 */
const updateTask = async (userId, taskId, title, description, completed) => {
    const queryResult = await poolQuery(
        'UPDATE tasks SET title=$1,description=$2,completed=$3 WHERE (task_id=$4 AND user_id=$5) RETURNING *',
        [title, description, completed, taskId, userId]);

    return queryResult.rows[0];
}

/**
 * Delete a task.
 * @param {string} userId 
 * @param {string} taskId 
 * @returns {Promise} The deleted task.
 * @throws Throws errors related to database queries.
 */
const deleteTask = async (userId, taskId) => {
    const queryResult = await poolQuery(
        'DELETE FROM tasks WHERE (task_id=$1 AND user_id=$2) RETURNING *',
        [taskId, userId]);

    return queryResult.rows[0];
}

/**
 * Mark task completion.
 * @param {string} userId 
 * @param {string} taskId 
 * @param {boolean} isCompleted
 * @returns {Promise} The updated task.
 * @throws Throws errors related to database queries.
 */
const markTaskCompletion = async (userId, taskId, isCompleted) => {
    const queryResult = await poolQuery(
        'UPDATE tasks SET completed=$1 WHERE (task_id=$2 AND user_id=$3) RETURNING *',
        [isCompleted, taskId, userId]);

    return queryResult.rows[0];
}

/**
 * Get a user.
 * @param {string} userId
 * @returns {Promise} The user.
 * @throws Throws errors related to database queries.
 */
const getUser = async (userId) => {
    const queryResult = await poolQuery(
        'SELECT user_id,name FROM users WHERE user_id=$1',
        [userId])

    return queryResult.rows[0];
}

/**
 * Get a user by Google ID.
 * @param {string} googleId
 * @returns {Promise} The user.
 * @throws Throws errors related to database queries.
 */
const getUserWithGoogleId = async (googleId) => {
    const queryResult = await poolQuery(
        'SELECT user_id,name FROM users WHERE google_id=$1',
        [googleId]);

    return queryResult.rows[0];
}

/**
 * Insert a new user with a Google ID.
 * @param {string} name
 * @param {string} googleId
 * @returns {Promise} The user.
 * @throws Throws errors related to database queries.
 */
const insertUserWithGoogleId = async (name, googleId) => {
    const queryResult = await poolQuery(
        'INSERT INTO users (name,google_id) VALUES ($1,$2) RETURNING user_id,name',
        [name, googleId]);

    return queryResult.rows[0];
}

// Export pool and functions
module.exports = {
    pool,
    poolQuery,
    insertTask,
    getTaskList,
    getTask,
    updateTask,
    deleteTask,
    markTaskCompletion,
    getUser,
    getUserWithGoogleId,
    insertUserWithGoogleId
}
