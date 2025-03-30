import React, { useEffect, useState } from "react";

function ListTasks() {
    const [tasks, setTasks] = useState([]);

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
                // TODO: Handle server error
            }

        } catch (err) {
            console.error(err.message);
        }
    }

    // Make DELETE request to the /tasks/:taskId route
    const deleteTask = async (taskId) => {
        try {
            const url = `${process.env.REACT_APP_SERVER_BASE_URL}/tasks/${taskId}`;
            const response = await fetch(url, { method: "DELETE" });
            const responseJson = await response.json();

            console.log(responseJson);

            // Handle server response
            if (response.ok) {
                // Remove the deleted task from the list
                setTasks(tasks.filter(task => task.task_id !== taskId));
            } else {
                // TODO: Handle server error
            }
        } catch (err) {
            console.error(err.message);
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
            <table className="table text-center">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {tasks.map(task => (
                        <tr key={task.task_id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>
                                {/* <EditTodo task={task} /> */}
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