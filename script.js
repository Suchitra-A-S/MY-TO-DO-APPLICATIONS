const airtableBaseUrl = 'https://api.airtable.com/v0/YOUR_BASE_ID/Tasks';
const airtableApiKey = 'YOUR_API_KEY';

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

const headers = {
    Authorization: `Bearer ${airtableApiKey}`,
    'Content-Type': 'application/json'
};

// Function to fetch tasks from Airtable
async function fetchTasks() {
    const response = await fetch(airtableBaseUrl, { headers });
    const data = await response.json();
    renderTasks(data.records);
}

// Function to render tasks
function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text">${task.fields.Task}</span>
            <button class="complete-btn" onclick="completeTask('${task.id}')">Complete</button>
        `;
        taskList.appendChild(li);
    });
}

// Function to add a new task
async function addTask() {
    const task = taskInput.value.trim();
    if (!task) return;
    
    const response = await fetch(airtableBaseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            fields: {
                Task: task,
                Completed: false
            }
        })
    });
    
    const data = await response.json();
    taskInput.value = '';
    fetchTasks(); // Refresh the task list
}

// Function to mark task as complete
async function completeTask(id) {
    await fetch(`${airtableBaseUrl}/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            fields: {
                Completed: true
            }
        })
    });
    
    fetchTasks(); // Refresh the task list
}

addTaskBtn.addEventListener('click', addTask);

// Initial fetch
fetchTasks();