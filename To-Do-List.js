
// 1. Tera Original Code (Jismein sab kuch sahi chal raha hai)
const input = document.getElementById('todo-input');
const addbtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodonoe(todo, index) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    // Bulk delete ke liye yeh dataset index jodna zaroori hai taaki pata chale kaun sa item hai
    checkbox.dataset.index = index; 
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        textspan.style.textDecoration = todo.completed ? 'line-through' : "";
        saveTodos();
        updateBulkDeleteBar(); // Checkbox hilne par bar update ho
    })

    const textspan = document.createElement("span");
    textspan.textContent = todo.text;
    textspan.style.margin = '0 8px';
    if (todo.completed) {
        textspan.style.textDecoration = 'line-through';
    }

    textspan.addEventListener("dblclick", () => {
        const newText = prompt("Edit todo", todo.text);
        if (newText !== null) {
            todo.text = newText.trim();
            textspan.textContent = todo.text;
            saveTodos();
        }
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        render();
        saveTodos();
        updateBulkDeleteBar();
    })

    li.appendChild(checkbox);
    li.appendChild(textspan);
    li.appendChild(delBtn);
    return li;
}

function render() {
    list.innerHTML = '';
    todos.forEach((todo, index) => {
        const node = createTodonoe(todo, index);
        list.appendChild(node);
    });
    updateBulkDeleteBar(); // Render hone ke baad bar check karega
}

function addTodo() {
    const text = input.value.trim();
    if (!text) {
        return;
    }
    todos.push({ text, completed: false });
    input.value = '';
    render();
    saveTodos();
}

addbtn.addEventListener("click", addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        addTodo();
    }
});







