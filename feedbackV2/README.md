# GitHub Pages feedback snippets

Static GitHub Pages version of the feedback snippet selector.

## Files

```text
index.html
static/
  feedback.js
  items.csv
  styles.css
```

## CSV format

Each row uses the full task ID and one feedback text:

```csv
IT00AK35-3005-C1;✅ Sivusto toimii
```

The page filters by the full task ID, but displays it as:

- Course: `IT00AK35-3005`
- Task: `C1`

## Direct task link

```text
index.html?taskid=IT00AK35-3005-C1
```
