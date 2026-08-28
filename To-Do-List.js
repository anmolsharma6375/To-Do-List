
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








// 2. Bulk Delete Bar & Logic (Tere code ke sath sync kiya hua)

// Event delegation poori list par
document.getElementById('todo-list').addEventListener('change', (e) => {
    if (e.target && e.target.type === 'checkbox') {
        updateBulkDeleteBar();
    }
});

function updateBulkDeleteBar() {
    const checkboxes = document.querySelectorAll('#todo-list input[type="checkbox"]');
    const bulkBar = document.getElementById('bulk-delete-container');
    const selectedCountText = document.getElementById('selected-count');
    
    let checkedCount = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
    });
    
    if (bulkBar) {
        if (checkedCount > 0) {
            bulkBar.style.display = 'flex'; 
            setTimeout(() => {
                bulkBar.classList.add('show'); 
            }, 10);
            if (selectedCountText) {
                selectedCountText.innerText = `${checkedCount} item${checkedCount > 1 ? 's' : ''} selected`;
            }
        } else {
            bulkBar.classList.remove('show');
            setTimeout(() => {
                const currentChecked = document.querySelectorAll('#todo-list input[type="checkbox"]:checked').length;
                if (currentChecked === 0) {
                    bulkBar.style.display = 'none'; 
                }
            }, 300);
        }
    }
}

// Delete Selected Button ka click event (Direct Array se splice karega, no [object Object] error!)
const deleteSelectedBtn = document.getElementById('delete-selected-btn');
if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#todo-list input[type="checkbox"]:checked');
        
        // Indexes nikal lo jo-jo tick hain
        const indexesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        
        // Indices ko reverse sort karte hain taaki array splice karte waqt index shift hone ki problem na aaye
        indexesToDelete.sort((a, b) => b - a);
        
        indexesToDelete.forEach(index => {
            todos.splice(index, 1);
        });

        saveTodos();
        render(); // Dubara list render hogi, sab kuch ekdum clean rahega
    });
}

// Initial render call
render();

