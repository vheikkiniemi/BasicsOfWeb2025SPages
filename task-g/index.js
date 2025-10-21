// index.js
// Author: Ville Heikkiniemi
// Date: 2025-10-06
// Handles adding new course rows with day marks (✅/❌)

document.addEventListener("DOMContentLoaded", () => {
  const CHECK = '✅';
  const CROSS = '❌';
  const dayOrder = ["Fri", "Mon"];

  const form = document.getElementById("addCourseForm");
  const table = document.getElementById("timetable").querySelector("tbody");
  const courseInput = document.getElementById("courseName");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const courseName = courseInput.value.trim();
    if (!courseName) return;

    // Collect checked days into a Set
    const checkedDays = new Set(
      Array.from(form.querySelectorAll('input[name="day"]:checked'))
        .map((cb) => cb.value)
    );

    // Create new table row
    const row = document.createElement("tr");

    // Course cell
    const nameCell = document.createElement("td");
    nameCell.textContent = courseName;
    row.appendChild(nameCell);

    // Day cells
    dayOrder.forEach((day) => {
      const cell = document.createElement("td");
      cell.textContent = checkedDays.has(day) ? CHECK : CROSS;
      cell.dataset.day = day;
      cell.className = "day-cell";
      row.appendChild(cell);
    });

    table.appendChild(row);

    // Reset form and focus
    form.reset();
    courseInput.focus();
  });
});
