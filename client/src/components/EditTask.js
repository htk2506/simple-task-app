import React, { useState } from "react";

function EditTask({ task }) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [completed, setCompleted] = useState(task.completed);

    const modalId = `edit-modal-${task.task_id}`

    // Restore state to what's already in the task
    const discardEdits = async () => {
        setTitle(task.title);
        setDescription(task.description);
        setCompleted(task.completed);
    }

    // Make PUT request to the /tasks/:id route
    const updateTask = async e => {
        e.preventDefault();
        try {
            const url = `${process.env.REACT_APP_API_SERVER_BASE_URL}/tasks/${task.task_id}`;
            const body = { title, description, completed };
            const response = await fetch(url, {
                method: "PUT",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

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
    };

    // Return the component
    return (
        <>
            <button
                type="button"
                className="btn btn-warning"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`}
            >
                Edit
            </button>

            <div
                className="modal"
                id={modalId}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Task</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                onClick={() => discardEdits()}
                            >
                            </button>
                        </div>

                        <div className="modal-body">

                            <label htmlFor="task-title-input" className="form-label">Title</label>
                            <input
                                id="task-title-input"
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Task Title"
                                className="form-control"
                            />

                            <label htmlFor="task-description-input" className="form-label">Description</label>
                            <textarea
                                id="task-description-input"
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Task Description"
                                className="form-control"
                            >
                            </textarea>

                            <div className="form-group">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="task-completed-checkbox"
                                    defaultChecked={completed}
                                    onChange={(e) => setCompleted(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="task-completed-checkbox">
                                    Completed
                                </label>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-warning"
                                data-bs-dismiss="modal"
                                onClick={e => updateTask(e)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};

export default EditTask;