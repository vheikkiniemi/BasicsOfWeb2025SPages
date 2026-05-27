# GitHub Pages feedback snippets

Static GitHub Pages version of the feedback snippet selector.

## Files

```text
index.html
static/
  feedback.js
  styles.css
  items.csv
```

## CSV format

Each row in `static/items.csv` uses one combined task ID and one feedback text:

```csv
IT00AK35-3005-C1;✅ Sivusto toimii
IT00AK35-3005-C1;❌ Sivusto ei toimi
```

The page automatically reads all unique task IDs from the CSV and shows them in the task selector.

## Direct task links

You can link directly to a task with a query parameter:

```text
https://your-user.github.io/your-repo/?taskid=IT00AK35-3005-C1
```

## GitHub Pages

1. Commit these files to your repository.
2. Go to **Settings → Pages**.
3. Select the branch and root folder.
4. Open the published GitHub Pages URL.
