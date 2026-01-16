// ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");

// Example roles
const role = "admin"; // "reserver" | "admin"

// Will hold a reference to the Create button so we can enable/disable it
let createButton = null;

// ===============================
// 2) Button creation helpers
// ===============================
function addButton({ label, type = "button", value, classes }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `
    w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out
    ${classes}
  `;

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;

  // Add/remove a "disabled look" (Tailwind utility classes)
  btn.classList.toggle("opacity-50", !enabled);
  btn.classList.toggle("cursor-not-allowed", !enabled);
}

function renderActionButtons(currentRole) {
  if (currentRole === "reserver") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      classes: "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft cursor-not-allowed",
    });
  }

  if (currentRole === "admin") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft cursor-not-allowed",
    });

    addButton({
      label: "Update",
      value: "update",
      classes: "border border-brand-blue text-brand-blue hover:bg-brand-dark hover:text-white cursor-not-allowed",
    });

    addButton({
      label: "Delete",
      value: "delete",
      classes: "border border-brand-rose text-brand-rose hover:bg-brand-rose hover:text-white cursor-not-allowed",
    });
  }
}

// ===============================
// 3) Input creation + validation
// ===============================
function createResourceNameInput(container) {
  const input = document.createElement("input");

  // Core attributes
  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";

  // Base Tailwind styling (single source of truth)
  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  container.appendChild(input);
  return input;
}

function isResourceNameValid(value) {
  const trimmed = value.trim();

  // Allowed: letters, numbers, Finnish letters, and space (based on your current regex)
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;

  const lengthValid = trimmed.length >= 5 && trimmed.length <= 30;
  const charactersValid = allowedPattern.test(trimmed);

  return lengthValid && charactersValid;
}

function setInputVisualState(input, state) {
  // Reset to neutral base state (remove only our own validation-related classes)
  input.classList.remove(
    "border-green-500",
    "bg-green-100",
    "focus:ring-green-500/30",
    "border-red-500",
    "bg-red-100",
    "focus:ring-red-500/30",
    "focus:border-brand-blue",
    "focus:ring-brand-blue/30"
  );

  // Ensure base focus style is present when neutral
  // (If we are valid/invalid, we override ring color but keep ring behavior)
  input.classList.add("focus:ring-2");

  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-100", "focus:ring-green-500/30");
  } else if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-100", "focus:ring-red-500/30");
  } else {
    // neutral: keep base border/bg; nothing else needed
  }
}

function attachResourceNameValidation(input) {
  const update = () => {
    const raw = input.value;
    if (raw.trim() === "") {
      setInputVisualState(input, "neutral");
      setButtonEnabled(createButton, false);
      return;
    }

    const valid = isResourceNameValid(raw);

    setInputVisualState(input, valid ? "valid" : "invalid");
    setButtonEnabled(createButton, valid);
  };

  // Real-time validation
  input.addEventListener("input", update);

  // Initialize state on page load (Create disabled until valid)
  update();
}

// ===============================
// 4) Bootstrapping
// ===============================
renderActionButtons(role);

// Create + validate input
const resourceNameInput = createResourceNameInput(resourceNameContainer);
attachResourceNameValidation(resourceNameInput);
