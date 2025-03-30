import React, { useState } from "react";

const InputTask = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <div className="input-task mx-5">
            <h1>Input Task</h1>
            <form>
                <label for="new-task-title-input" class="form-label">Title</label>
                <input id="new-task-title-input" type="text" placeholder="Task Title" className="form-control" />

                <label for="new-task-description-input" class="form-label">Description</label>
                <textarea value="" id="new-task-description-input" type="text" placeholder="Task Description" className="form-control" ></textarea>

                <button className="btn btn-success">Add</button>

            </form>
        </div>
    )
};

export default InputTask;