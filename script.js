const taskForm = document.querySelector("#task-form");
const taskNameInput = document.querySelector("#task-name");
const courseNameInput = document.querySelector("#course-name");
const topicNameInput = document.querySelector("#topic-name");
const priorityInput = document.querySelector("#priority");
const durationInput = document.querySelector("#duration");
const formMessage = document.querySelector("#form-message");
const pendingList = document.querySelector("#pending-list");
const completedList = document.querySelector("#completed-list");
const pendingCount = document.querySelector("#pending-count");
const completedCount = document.querySelector("#completed-count");
const totalCount = document.querySelector("#total-count");

const tasks = [];
const allowedPriorities = ["Low", "Medium", "High"];
let nextTaskId = 1;

function createEmptyState(message) {
  const item = document.createElement("li");
  item.className = "empty-state";
  item.textContent = message;
  return item;
}

function createTaskCard(task) {
  const item = document.createElement("li");
  const card = document.createElement("article");
  card.className = `task-card${task.completed ? " is-completed" : ""}`;

  const title = document.createElement("h4");
  title.textContent = task.taskName;

  const course = document.createElement("p");
  course.className = "task-course";
  course.append(document.createTextNode(task.courseName));
  const separator = document.createElement("span");
  separator.textContent = "•";
  course.append(separator, document.createTextNode(task.topicName));

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const priority = document.createElement("span");
  priority.className = `priority-tag priority-${task.priority.toLowerCase()}`;
  priority.textContent = `Priority: ${task.priority}`;

  const duration = document.createElement("span");
  duration.className = "duration-tag";
  duration.textContent = `Duration: ${task.duration} min`;

  const status = document.createElement("span");
  status.className = "status-tag";
  status.textContent = task.completed ? "Completed" : "Pending";
  meta.append(priority, duration, status);

  card.append(title, course, meta);

  if (!task.completed) {
    const completeButton = document.createElement("button");
    completeButton.className = "complete-button";
    completeButton.type = "button";
    completeButton.dataset.taskId = String(task.id);
    completeButton.textContent = "Mark complete";
    card.append(completeButton);
  }

  item.append(card);
  return item;
}

function renderTasks() {
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  pendingList.replaceChildren(...pendingTasks.map(createTaskCard));
  completedList.replaceChildren(...completedTasks.map(createTaskCard));

  if (pendingTasks.length === 0) {
    pendingList.append(createEmptyState("No pending tasks. Add one to get started."));
  }
  if (completedTasks.length === 0) {
    completedList.append(createEmptyState("No completed tasks yet."));
  }

  pendingCount.textContent = String(pendingTasks.length);
  completedCount.textContent = String(completedTasks.length);
  totalCount.textContent = String(tasks.length);
}

function validateForm() {
  const fields = [
    [taskNameInput, taskNameInput.value.trim() ? "" : "Task name is required."],
    [courseNameInput, courseNameInput.value.trim() ? "" : "Course name is required."],
    [topicNameInput, topicNameInput.value.trim() ? "" : "Topic name is required."],
    [priorityInput, allowedPriorities.includes(priorityInput.value) ? "" : "Choose Low, Medium, or High priority."],
    [durationInput, Number.isInteger(durationInput.valueAsNumber) && durationInput.valueAsNumber > 0 ? "" : "Duration must be a positive whole number of minutes."]
  ];

  for (const [field, error] of fields) {
    field.setCustomValidity(error);
  }

  const invalidField = fields.find(([field]) => !field.checkValidity());
  if (invalidField) {
    const [, error] = invalidField;
    formMessage.textContent = error;
    invalidField[0].reportValidity();
    return false;
  }

  formMessage.textContent = "";
  return true;
}

taskForm.addEventListener("input", () => {
  formMessage.textContent = "";
  for (const field of taskForm.elements) {
    if (field instanceof HTMLElement && "setCustomValidity" in field) {
      field.setCustomValidity("");
    }
  }
});

taskForm.addEventListener("change", () => {
  formMessage.textContent = "";
  priorityInput.setCustomValidity("");
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  tasks.push({
    id: nextTaskId,
    taskName: taskNameInput.value.trim(),
    courseName: courseNameInput.value.trim(),
    topicName: topicNameInput.value.trim(),
    priority: priorityInput.value,
    duration: durationInput.valueAsNumber,
    completed: false
  });
  nextTaskId += 1;

  taskForm.reset();
  formMessage.textContent = "Task added to your plan.";
  renderTasks();
  taskNameInput.focus();
});

pendingList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-task-id]");
  if (!button) return;

  const task = tasks.find((item) => item.id === Number(button.dataset.taskId));
  if (!task || task.completed) return;

  task.completed = true;
  renderTasks();
});

renderTasks();