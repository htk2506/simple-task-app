import React, { useEffect, useState } from "react";
import EditTask from "./EditTask";

function ListTasks() {
    const [tasks, setTasks] = useState([]);
    const [hideCompleted, setHideCompleted] = useState(false);

    // Make GET request to the /tasks route
    const getTasks = async () => {
        try {
            const url = `${process.env.REACT_APP_SERVER_BASE_URL}/tasks`;
            const response = await fetch(url);
            const responseJson = await response.json();

            console.log(responseJson);

            // Handle server response
            if (response.ok) {
                setTasks(responseJson);
            } else {
                const responseText = await response.text();
                alert(responseText);
            }
        } catch (err) {
            console.error(err.message);
            alert(err.message);
        }
    }

    // Make DELETE request to the /tasks/:Id route
    const deleteTask = async (id) => {
        try {
            const url = `${process.env.REACT_APP_SERVER_BASE_URL}/tasks/${id}`;
            const response = await fetch(url, { method: "DELETE" });

            // Handle server response
            if (response.ok) {
                // Remove the deleted task from the list
                setTasks(tasks.filter(task => task.task_id !== id));
            } else {
                const responseText = await response.text();
                alert(responseText);
            }
        } catch (err) {
            console.error(err.message);
            alert(err.message);
        }
    }

    // Update the completion of a task
    const updateTaskCompletion = async (e, id) => {
        try {
            const completed = e.target.checked;
            const url = `${process.env.REACT_APP_SERVER_BASE_URL}/tasks/${id}/completion?completed=${completed}`;
            const response = await fetch(url, { method: "PUT" });

            // Handle server response
            if (response.ok) {
                // Refresh
                window.location.reload();
            } else {
                const responseText = await response.text();
                alert(responseText);
            }
        } catch (err) {
            console.error(err.message);
            alert(err.message);
        }
    }

    // Call when first rendered
    useEffect(() => {
        getTasks();
    }, []);

    // Return component
    return (
        <div className="list-tasks mt-5">
            <h2>Tasks</h2>

            <div className="form-group justify-content-start align-items-start">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="hide-completed-checkbox"
                    checkedDefault={hideCompleted}
                    onChange={(e) => setHideCompleted(e.target.checked)}
                />
                <label className="form-check-label" for="hide-completed-checkbox">
                    Hide completed tasks
                </label>
            </div>

            <table className="table text-center">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Completed</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {tasks
                        .filter(task => {
                            if (hideCompleted) {
                                return !task.completed;
                            } else {
                                return true;
                            }
                        })
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map(task => (
                            <tr key={task.task_id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        defaultChecked={task.completed}
                                        onChange={(e) => updateTaskCompletion(e, task.task_id)}
                                    />
                                </td>
                                <td>
                                    <EditTask task={task} />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteTask(task.task_id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                </tbody>
            </table>
        </div>
    );
}

export default ListTasks;