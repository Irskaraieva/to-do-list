const input = document.getElementById('input');
const addBtn = document.getElementById('button-addon2');
const mainContainer = document.getElementById('mainContainer');
const trash = document.getElementById('trashContainer');
const isEmpty = document.getElementById('isEmpty');
const done = document.getElementById('done');

let tasksList = [];


if (localStorage.getItem("tasksList")) {

    tasksList = JSON.parse(localStorage.getItem("tasksList"));
    tasksList.forEach((task) => renderNote(task));
    ifFinishedTasks();
}


function ifFinishedTasks() {
    const hasUnfinishedTasks = tasksList.find((task) => task.done == false);
    const hasFinishedTasks = tasksList.find((task) => task.done == true);

    isEmpty.style.display = hasUnfinishedTasks ? 'none' : 'inline-block';
    done.style.display = hasFinishedTasks ? 'block' : 'none';
}


input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter')
        addItem();
})

mainContainer.addEventListener('click', deleteNote);
mainContainer.addEventListener('click', ifDone);
trash.addEventListener('click', deleteNote);
trash.addEventListener('click', ifDone);

function addItem() {

    const newTask = {
        id: Date.now(),
        text: input.value,
        done: false
    }

    tasksList.push(newTask);

    renderNote(newTask);

    input.value = '';
    input.focus();

    saveToLocalStorage();
    ifFinishedTasks();

}

function deleteNote(event) {
    if (event.target.classList.contains('delete')) {

        const parent = event.target.closest('.note');
        const id = Number(parent.id);

        parent.classList.remove('appear');
        tasksList = tasksList.filter((task) => task.id !== id);

        parent.style.animationPlayState = 'running';
        parent.addEventListener('animationend', () => {
            parent.remove();

        });

        saveToLocalStorage();
        ifFinishedTasks();
    }
}

function ifDone(event) {
    if (event.target.classList.contains('form-check-input')) {
        const parent = event.target.closest('div.form-check');
        const noteContent = parent.querySelector('.form-check-label');

        const id = Number(parent.id);
        const task = tasksList.find((e) => e.id === id);
        task.done = !task.done;

        if (task.done) {
            noteContent.classList.add('opacity-75', 'fw-lighter', 'fst-italic', 'strikethrough');
            trash.appendChild(parent);
        } else {
            noteContent.classList.remove('opacity-75', 'fw-lighter', 'fst-italic', 'strikethrough');
            mainContainer.appendChild(parent);
        }

        saveToLocalStorage();
        ifFinishedTasks();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasksList', JSON.stringify(tasksList));
}

function renderNote(newTask) {

    const cssClass = newTask.done 
    ? 'form-check-label ms-3 w-75 word-break opacity-100 fw-lighter fst-italic text-wrap strikethrough' 
    : 'form-check-label ms-3 word-break text-wrap w-100';
    const ifCheck = newTask.done ? 'checked' : '';

    const noteHTML = `
        <div id='${newTask.id}' class="form-check overflow-hidden position-relative rounded-1 note d-flex">
            <input
            class="form-check-input ms-1 form-check-input-hover "
            type="checkbox"
            value=""
            id="flexCheck${newTask.id}"
            ${ifCheck}
            />
            <label class="${cssClass}" for="flexCheck${newTask.id}">
            ${newTask.text}
            </label>
            <i class="fa-solid position-absolute top-50 end-0 translate-middle delete"> &#10007;</i>
        </div>`

    newTask.done ? trash.insertAdjacentHTML('beforeend', noteHTML) : mainContainer.insertAdjacentHTML('beforeend', noteHTML);
} 
