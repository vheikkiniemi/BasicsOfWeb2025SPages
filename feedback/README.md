# GitHub Pages feedback snippets

This is a static GitHub Pages version of the original Handlebars feedback page.

## Files

```text
.
├── index.html
├── README.md
└── static/
    ├── feedback.js
    ├── items.csv
    └── styles.css
```

## How to use

1. Replace `static/items.csv` with your real feedback rows.
2. Keep this CSV format:

```csv
taskid;feedback text
```

3. Open the page with URL parameters, for example:

```text
index.html?taskid=task-a&course=Basics%20of%20Web%20Development&task=Task%20A
```

## GitHub Pages setup

1. Push these files to a GitHub repository.
2. In GitHub, open **Settings → Pages**.
3. Select deployment from the main branch and root folder.
4. Open the generated GitHub Pages URL.

## Notes

The original server-side Handlebars variables were replaced with browser-side URL parameters. Static assets use relative paths so the page also works from project-style GitHub Pages URLs such as `https://username.github.io/repository-name/`.
