
function formataData(data) {
    return data.split("-").reverse().join("/");
}

const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const inputDate = document.querySelector(".new-task-date");
const inputValue = document.querySelector(".new-task-value");

const tasksContainer = document.querySelector(".tasks-container");

const validateInput = () => inputElement.value.trim().length > 0;
const validateValue = () => inputValue.value.trim().length > 0;



function atualizaValorTotal() {
    let totalDiv = document.querySelector(".total");

    tasks = getTasks()
    let somatorio = 0

    for (i = 0; i < tasks.length; i++) {
        task = tasks[i]
        if (task.isCompleted == false)
            somatorio = somatorio + task.valor
    }

    totalDiv.innerText = somatorio;
}

const handleAddTask = () => {
    const inputIsValid = validateInput();

    console.log(inputIsValid);

    if (!inputIsValid) {
        return inputElement.classList.add("error");
    }




    let newTask = { description: inputElement.value, data: formataData(inputDate.value), valor: parseInt(inputValue.value), isCompleted: false }

    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task-item");

    const taskContent = document.createElement("p");
    taskContent.innerText = newTask.description + " --- data : " + newTask.data + "--- " + newTask.valor + " $";

    taskContent.addEventListener("click", () => handleClick(taskContent));

    const deleteItem = document.createElement("i");
    deleteItem.classList.add("far");
    deleteItem.classList.add("fa-trash-alt");

    deleteItem.addEventListener("click", () =>
        handleDeleteClick(taskItemContainer, taskContent)
    );

    const id = getTasks().length;
    taskItemContainer.setAttribute("id", id)
    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    tasksContainer.appendChild(taskItemContainer);

    inputElement.value = "";
    inputDate.value = "";
    inputValue.value = "";


    updateLocalStorage(newTask);
    atualizaValorTotal()

};

const handleClick = (taskContent) => {
    const tasks = tasksContainer.childNodes;

    for (const task of tasks) {
        const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

        if (currentTaskIsBeingClicked) {
            id = task.getAttribute("id")
            completeTask(id)
            task.firstChild.classList.toggle("completed");
        }
    }

    atualizaValorTotal()
};

const handleDeleteClick = (taskItemContainer, taskContent) => {
    const tasks = tasksContainer.childNodes;

    for (const task of tasks) {
        const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent);

        if (currentTaskIsBeingClicked) {
            console.log(taskItemContainer);
            let id = taskItemContainer.getAttribute("id");
            removeTaskFromLocalStorage(id);
            taskItemContainer.remove();
        }
    }

    atualizaValorTotal()
};

const handleInputChange = () => {
    const inputIsValid = validateInput();

    if (inputIsValid) {
        return inputElement.classList.remove("error");
    }
};

function getTasks() {
    tasksTexto = localStorage.getItem("tasks") || "[]";
    tasks = JSON.parse(tasksTexto);
    return tasks
}


function updateTasks(strategy) {
    tasks = getTasks()
    tasks = strategy(tasks)
    tasksTexto = JSON.stringify(tasks);
    localStorage.setItem("tasks", tasksTexto);

}

function completeTask(id) {
    strategy = tasks => {
        task = tasks[id]
        task.isCompleted = !task.isCompleted
        return tasks
    }

    updateTasks(strategy)
}

const removeTaskFromLocalStorage = (taskId) => {
    strategy = tasks => {
        tasks.splice(taskId, 1)
        return tasks
    }
    updateTasks(strategy)
}

const updateLocalStorage = (task) => {
    strategy = tasks => {
        tasks[tasks.length] = task;
        return tasks;
    }

    updateTasks(strategy)
};

const refreshTasksUsingLocalStorage = () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

    if (!tasksFromLocalStorage) return;

    for (i = 0; i < tasksFromLocalStorage.length; i++) {
        task = tasksFromLocalStorage[i];
        const taskItemContainer = document.createElement("div");
        taskItemContainer.setAttribute("id", i)
        taskItemContainer.classList.add("task-item");

        const taskContent = document.createElement("p");
        taskContent.innerText = task.description + " --- " + task.data + "--- " + "R$ " + task.valor;

        if (task.isCompleted) {
            taskContent.classList.add("completed");
        }

        taskContent.addEventListener("click", () => handleClick(taskContent));

        const deleteItem = document.createElement("i");
        deleteItem.classList.add("far");
        deleteItem.classList.add("fa-trash-alt");

        deleteItem.addEventListener("click", () =>
            handleDeleteClick(taskItemContainer, taskContent)
        );

        taskItemContainer.appendChild(taskContent);
        taskItemContainer.appendChild(deleteItem);

        tasksContainer.appendChild(taskItemContainer);
    }

    atualizaValorTotal()
};

refreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());

inputElement.addEventListener("change", () => handleInputChange());

