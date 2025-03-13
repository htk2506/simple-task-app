/**
 * Defines functions for interacting with the Postgres database.
 */

require('dotenv').config();

// Create the pool
const Pool = require('pg').Pool;
const pool = new Pool({ connectionString: process.env.POSTGRES_URI });

/**
 * Use a pg pool to query the database. Returns a Promise for the result.
 * @param {string} text - Text for the query.
 * @param {[any]} params - Parameters to use in the query.
 * @param {(err: Error, result: QueryResult<R>) => void} callback - Callback function.
 * @returns {Promise}
 */
const poolQuery = (text, params, callback) => {
   return pool.query(text, params, callback);
}

// Export functions
module.exports = {
    poolQuery
}
