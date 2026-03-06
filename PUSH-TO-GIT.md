# Push This Project to GitHub – Step by Step

Your repo is already set to: **https://github.com/Bhaveshbade10/AI-Resume-Analyzer**

---

## Step 1: Open a terminal

Open a terminal (in Cursor, VS Code, or your system terminal) and go to the project folder:

```bash
cd "/home/Robin1002/AI Resume Project/ai-resume-analyzer"
```

Or if you're already in `AI Resume Project`:

```bash
cd ai-resume-analyzer
```

---

## Step 2: See what will be pushed

Check which files are new or changed:

```bash
git status
```

- **Modified** = already tracked, changes not committed
- **Untracked** = new files (e.g. `backend/railway.json`)

---

## Step 3: Stage all changes

Add everything (new + modified) to the next commit:

```bash
git add .
```

To add only specific files instead:

```bash
git add backend/railway.json backend/package.json DEPLOYMENT.md DEPLOY-NOW.md
```

---

## Step 4: Commit

Create a commit with a short message:

```bash
git commit -m "Add Railway config and update deployment docs"
```

Use any message you like, e.g.:

- `"Railway deployment support"`
- `"Update for Railway deploy"`

---

## Step 5: Push to GitHub

Send your commits to GitHub:

```bash
git push -u origin main
```

- First time: Git may ask for your **GitHub username** and **password**.
- **Password** = use a **Personal Access Token (PAT)**, not your GitHub account password.

---

## If Git asks for credentials

### Option A: Personal Access Token (recommended)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. **Generate new token** → give it a name, set expiry, tick **repo**.
3. Copy the token and **paste it when Git asks for a password** (username = your GitHub username).

### Option B: GitHub CLI

```bash
gh auth login
```

Follow the prompts, then run again:

```bash
git push -u origin main
```

### Option C: SSH instead of HTTPS

1. Add an SSH key to GitHub (Settings → SSH and GPG keys).
2. Change the remote to SSH and push:

```bash
git remote set-url origin git@github.com:Bhaveshbade10/AI-Resume-Analyzer.git
git push -u origin main
```

---

## Later: push new changes again

Whenever you change code and want to update GitHub:

```bash
cd "/home/Robin1002/AI Resume Project/ai-resume-analyzer"
git add .
git commit -m "Describe your change here"
git push
```

---

## Quick copy-paste (one go)

From the project folder:

```bash
cd "/home/Robin1002/AI Resume Project/ai-resume-analyzer"
git add .
git commit -m "Add Railway config and update deployment docs"
git push -u origin main
```

If `git push` asks for username/password, use your GitHub username and a **Personal Access Token** as the password.
