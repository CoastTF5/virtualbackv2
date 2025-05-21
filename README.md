# Virtual Backlot Repository

This repository contains a React-based prototype for the Virtual Backlot project.
The environment running this repository does not have network access after setup,
so dependencies must be installed during the initial setup phase.

## Setup Script

A setup script has been added under `.codex/setup.sh`. It installs Node.js,
`pnpm`, and the required packages for the React template. Codex automatically
executes this script when the environment is created. You can also run it
manually:

```bash
bash .codex/setup.sh
```

After running the script, all dependencies will be available offline.

