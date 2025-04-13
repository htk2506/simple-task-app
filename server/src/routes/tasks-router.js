/**
 * Router for the task routes.
 */

// Import modules
require('dotenv').config();
const express = require('express');
const db = require('../utils/db');
const { checkAuth } = require('../utils/auth');

// Create the router
const router = express.Router();

//#region '/'
router.route('/')
    // GET test route
    .get(async (req, res) => {
        const msg = 'Hello World';
        res.send(msg);
    });
//#endregion

//#region '/tasks'
router.route('/tasks')
    // POST a new task
    .post(checkAuth, async (req, res) => {
        try {
            // Get user ID
            const userId = req.user.user_id;

            // Parse request
            const { description, title } = req.body;

            // Query database
            const insertedTask = await db.insertTask(null, title, description);

            // Send inserted task
            res.status(201);
            res.json(insertedTask);
        } catch (err) {
            // Send error
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    })
    // GET all tasks
    .get(checkAuth, async (req, res) => {
        try {
            // Get user ID
            const userId = req.user.user_id;

            // Query database
            const tasks = await db.getTaskList(null);

            // Send tasks
            res.status(200);
            res.json(tasks);
        } catch (err) {
            // Send error
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    });
//#endregion

//#region '/tasks/:taskId'
router.route('/tasks/:taskId')
    // GET specific task
    .get(checkAuth, async (req, res) => {
        try {
            // Get user ID
            const userId = req.user.user_id;
            
            // Parse request
            const { taskId } = req.params;

            // Query database
            const task = await db.getTaskForUser(null, taskId);

            // Send results
            if (!!task) {
                // Return the found task
                res.status(200);
                res.json(task);
            } else {
                // No task found
                res.status(404);
                res.send('Task not found');
            }
        } catch (err) {
            // Send error
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    })
    // PUT an update to specific task
    .put(checkAuth, async (req, res) => {
        try {
            // Get user ID
            const userId = req.user.user_id;
            
            // Parse request
            const { taskId } = req.params;
            const { title, description, completed } = req.body;

            // Query database
            const updatedTask = await db.updateTaskForUser(null, taskId, title, description, completed);

            // Send results
            if (!!updatedTask) {
                // Return the updated task
                res.status(200);
                res.json(updatedTask);
            } else {
                // No task updated
                res.status(500);
                res.send('No task updated');
            }
        } catch (err) {
            // Send error
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    })
    // Delete specific task
    .delete(checkAuth, async (req, res) => {
        try {
            // Get user ID
            const userId = req.user.user_id;
            
            // Parse request
            const { taskId } = req.params;

            // Query database
            const deletedTask = await db.deleteTask(null, taskId);

            // Send results
            if (!!deletedTask) {
                // Return the updated task
                res.status(200);
                res.json(deletedTask);
            } else {
                // No task deleted
                res.status(500);
                res.send('No task deleted');
            }
        } catch (err) {
            // Send error
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    });
//#endregion

//#region '/tasks/:taskId/completion'
router.route('/tasks/:taskId/completion')
    // Put a completion update to a specific task
    .put(checkAuth, async (req, res) => {
        try {
            // Get user ID
            const userId = req.user.user_id;
            
            // Parse request
            const { taskId } = req.params;
            const completedQuery = (req.query.completed ?? '').toLowerCase();
            let isCompleted;
            if (completedQuery === 'true') {
                isCompleted = true;
            } else if (completedQuery === 'false') {
                isCompleted = false;
            }

            if (isCompleted !== undefined) {
                // Query database if query param was valid and parsed into isCompleted
                const updatedTask = await db.markTaskCompletion(null, taskId, isCompleted);

                // Send results
                if (!!updatedTask) {
                    // Return the updated task
                    res.status(200);
                    res.json(updatedTask);
                } else {
                    // No task updated
                    res.status(500);
                    res.send('No task updated');
                }
            } else {
                // Send error message about invalid query param
                res.status(400);
                res.send('Provide "completed" query param that is either "true" or "false"');
            }
        } catch (err) {
            // Send error
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    });
//#endregion

// Export the router
module.exports = router;