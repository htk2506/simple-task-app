import React, { useState } from "react";

function InputTask() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Callback for submitting new task form
    const onSubmitForm = async (e) => {
        // Prevent refresh
        e.preventDefault();

        // Don't submit empty string for title
        if (!title) { return; }

        try {
            // POST request to the /tasks route
            const url = `${process.env.REACT_APP_API_SERVER_BASE_URL}/tasks`;
            const body = { title, description };
            const response = await fetch(url, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            // Handle server response
            if (response.ok) {
                // Now refresh
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

    // Return the component
    return (
        <div className="input-task mt-5">
            <h2>Input New Task</h2>
            <form onSubmit={onSubmitForm}>
                <label htmlFor="new-task-title-input" className="form-label">Title</label>
                <input
                    id="new-task-title-input"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="form-control"
                />

                <label htmlFor="new-task-description-input" className="form-label">Description</label>
                <textarea
                    id="new-task-description-input"
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Task Description"
                    className="form-control"
                >
                </textarea>

                <button className="btn btn-success">Add</button>

            </form>
        </div>
    )
};

export default InputTask;