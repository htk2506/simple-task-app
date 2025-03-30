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
            const url = `${process.env.REACT_APP_SERVER_BASE_URL}/tasks/${task.task_id}`;
            const body = { title, description, completed };
            const response = await fetch(
                url,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );
            const responseJson = await response.json();

            if (response.ok) {
                // Refresh
                window.location.reload();
            } else {
                // TODO: Handle server error
            }

        } catch (err) {
            console.error(err.message);
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
                onClick={() => discardEdits()}
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
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
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