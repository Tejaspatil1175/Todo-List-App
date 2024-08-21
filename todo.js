const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  document.querySelectorAll('main').forEach(main => main.classList.toggle('dark-mode'));
  document.querySelectorAll('input, select').forEach(input => input.classList.toggle('dark-mode'));
  document.querySelectorAll('.todo-item').forEach(item => item.classList.toggle('dark-mode', darkModeToggle.checked));
});

function getTodos() {
  const todos = localStorage.getItem('todoList');
  return todos ? JSON.parse(todos) : [];
}

function saveTodos(todos) {
  localStorage.setItem('todoList', JSON.stringify(todos));
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.innerText = message;
  document.getElementById('alert-container').appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

function renderTodos() {
  const container = document.querySelector('.todo-container');
  container.innerHTML = '';
  const todoList = getTodos();
  todoList.forEach(todo => {
    const todoDiv = document.createElement('div');
    todoDiv.className = `todo-item ${todo.priority}-priority ${todo.completed ? 'completed' : ''}`;
    todoDiv.innerHTML = `
      <span>${todo.item} - ${todo.dueDate}</span>
      <div>
        <button class="btn btn-edit" onclick="editTodo('${todo.item}')">Edit</button>
        <button class="btn btn-delete" onclick="deleteTodo('${todo.item}')">Delete</button>
        <button class="btn btn-toggle" onclick="toggleComplete('${todo.item}')">${todo.completed ? 'Undo' : 'Complete'}</button>
      </div>
    `;
    container.appendChild(todoDiv);
  });
}

function addTodo() {
  const item = document.getElementById('todo-input').value;
  const dueDate = document.getElementById('todo-date').value;
  const priority = document.getElementById('todo-priority').value;
  const category = document.getElementById('todo-category').value;

  if (!item || !dueDate) {
    showAlert('Please fill in all required fields.', 'warning');
    return;
  }

  const todoList = getTodos();
  todoList.push({ item, dueDate, priority, category, completed: false });
  saveTodos(todoList);
  renderTodos();
  showAlert('Todo added successfully!', 'success');
}

function editTodo(item) {
  const newItem = prompt('Edit todo item:', item);
  if (newItem) {
    const todoList = getTodos();
    const todo = todoList.find(todo => todo.item === item);
    todo.item = newItem;
    saveTodos(todoList);
    renderTodos();
    showAlert('Todo updated successfully!', 'info');
  }
}

function deleteTodo(item) {
  let todoList = getTodos();
  todoList = todoList.filter(todo => todo.item !== item);
  saveTodos(todoList);
  renderTodos();
  showAlert('Todo deleted successfully!', 'danger');
}

function toggleComplete(item) {
  const todoList = getTodos();
  const todo = todoList.find(todo => todo.item === item);
  todo.completed = !todo.completed;
  saveTodos(todoList);
  renderTodos();
  showAlert(todo.completed ? 'Todo marked as complete!' : 'Todo marked as incomplete!', 'info');
}

document.addEventListener('DOMContentLoaded', () => {
  renderTodos();  // Initial render of todos
});