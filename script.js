
document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const prioritySelect = document.getElementById('prioritySelect');
  const showAllBtn = document.getElementById('showAllBtn');
  const showActiveBtn = document.getElementById('showActiveBtn');
  const showCompletedBtn = document.getElementById('showCompletedBtn');
  const totalCount = document.getElementById('totalCount');
  const completedCount = document.getElementById('completedCount');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function init() {
    renderTasks();
    updateStats();
    addEventListeners();
  }

  function addEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') addTask();
    });

    showAllBtn.addEventListener('click', () => filterTasks('all'));
    showActiveBtn.addEventListener('click', () => filterTasks('active'));
    showCompletedBtn.addEventListener('click', () => filterTasks('completed'));
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      priority: prioritySelect.value,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();

    taskInput.value = '';
    taskInput.focus();
  }

  function renderTasks(filter = 'all') {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'active') {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
      taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
      return;
    }

    filteredTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      if (task.completed) taskItem.classList.add('completed');

      taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
        <span class="task-text">${task.text}</span>
        <span class="task-priority priority-${task.priority}">${task.priority}</span>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      `;

      taskList.appendChild(taskItem);
    });

    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', toggleTask);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', deleteTask);
    });
  }

  function toggleTask(e) {
    const taskId = parseInt(e.target.dataset.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex].completed = e.target.checked;
      saveTasks();
      renderTasks();
      updateStats();
    }
  }

  function deleteTask(e) {
    const taskId = parseInt(e.target.dataset.id);
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateStats();
  }

  function filterTasks(filter) {
    renderTasks(filter);
  }

  function updateStats() {
    totalCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  init();
});


document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (name === "" || email === "" || message === "") {
    alert("Please fill in all fields.");
    return;
  }

  if (!email.match(emailPattern)) {
    alert("Please enter a valid email.");
    return;
  }

  alert("Form submitted successfully!");
  document.getElementById("contactForm").reset();
});
