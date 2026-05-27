document.addEventListener("DOMContentLoaded", () => {
  const taskIdEl = document.getElementById("taskid");
  const taskForm = document.getElementById("task-form");
  const listEl = document.getElementById("feedback-list");
  const copyButton = document.getElementById("copy-feedback-button");
  const clearButton = document.getElementById("clear-selection-button");
  const statusEl = document.getElementById("feedback-copy-status");
  const courseNameEl = document.getElementById("course-name");
  const taskNameEl = document.getElementById("task-name");

  if (!taskIdEl || !taskForm || !listEl || !copyButton || !clearButton || !statusEl) {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  if (params.has("taskid")) {
    taskIdEl.value = params.get("taskid").trim();
  }

  if (courseNameEl && params.has("course")) {
    courseNameEl.textContent = params.get("course").trim();
  }

  if (taskNameEl && params.has("task")) {
    taskNameEl.textContent = params.get("task").trim();
  }

  function getTaskId() {
    return taskIdEl.value.trim();
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseCsvLine(line) {
    const result = [];
    let current = "";
    let quote = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];

      if (char === '"') {
        if (quote && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          quote = !quote;
        }
        continue;
      }

      if (!quote && (char === ";" || char === "," || char === "\t")) {
        result.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    result.push(current.trim());
    return result;
  }

  async function loadFeedbackRows() {
    const taskId = getTaskId();

    if (!taskId) {
      listEl.innerHTML = '<div class="alert alert-error"><strong>Error:</strong> Please enter a task id.</div>';
      setStatus("");
      return;
    }

    try {
      const response = await fetch("static/items.csv", { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Failed to load static/items.csv (${response.status})`);
      }

      const text = await response.text();

      const rows = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith("#"))
        .map(parseCsvLine)
        .filter(cols => cols.length >= 2)
        .map(cols => ({
          key: cols[0],
          text: cols.slice(1).join(" ").trim(),
        }))
        .filter(row => row.key === taskId);

      renderRows(rows, taskId);
    } catch (error) {
      listEl.innerHTML = `<div class="alert alert-error"><strong>Error:</strong> ${escapeHtml(error.message)}</div>`;
      setStatus("");
    }
  }

  function createFeedbackCard(row, index) {
    const label = document.createElement("label");
    label.className = "feedback-card";
    label.setAttribute("for", `feedback-${index}`);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "feedback-checkbox visually-hidden";
    checkbox.value = row.text;
    checkbox.id = `feedback-${index}`;

    const content = document.createElement("div");
    content.className = "feedback-card-content";

    const marker = document.createElement("span");
    marker.className = "feedback-marker";
    marker.textContent = "✓";

    const text = document.createElement("span");
    text.className = "feedback-text";
    text.textContent = row.text;

    content.appendChild(marker);
    content.appendChild(text);

    checkbox.addEventListener("change", () => {
      label.classList.toggle("selected", checkbox.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(content);

    return label;
  }

  function renderRows(rows, taskId) {
    listEl.innerHTML = "";

    if (!rows.length) {
      listEl.innerHTML = `<div class="alert alert-error"><strong>No rows found:</strong> No feedback snippets matched task id ${escapeHtml(taskId)}.</div>`;
      setStatus("");
      return;
    }

    rows.forEach((row, index) => {
      listEl.appendChild(createFeedbackCard(row, index));
    });

    setStatus(`${rows.length} row(s) loaded.`);
  }

  copyButton.addEventListener("click", async () => {
    const selected = [...document.querySelectorAll(".feedback-checkbox:checked")]
      .map(el => el.value)
      .join("\n");

    if (!selected) {
      setStatus("No rows selected.");
      return;
    }

    try {
      await navigator.clipboard.writeText(selected);
      setStatus("Selected rows copied.");
    } catch (error) {
      setStatus(`Copy failed: ${error.message}`);
    }
  });

  clearButton.addEventListener("click", () => {
    document.querySelectorAll(".feedback-checkbox:checked").forEach(el => {
      el.checked = false;
    });

    document.querySelectorAll(".feedback-card.selected").forEach(card => {
      card.classList.remove("selected");
    });

    setStatus("Selection cleared.");
  });

  taskForm.addEventListener("submit", event => {
    event.preventDefault();
    loadFeedbackRows();
  });

  loadFeedbackRows();
});
