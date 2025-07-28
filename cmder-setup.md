# Cmder Setup Guide for Zalo Mini App Development

## Overview
This guide helps you set up Cmder as your primary terminal for developing the Zalo Mini App healthcare project.

## Installation

### 1. Download Cmder
- Visit [cmder.net](https://cmder.net/)
- Download the **Full version** (includes Git for Windows)
- Extract to a permanent location (e.g., `C:\tools\cmder`)

### 2. Add to PATH (Optional)
Add cmder to your system PATH to launch from anywhere:
1. Open System Properties → Environment Variables
2. Add `C:\tools\cmder` to your PATH
3. Restart your terminal/IDE

## Configuration

### 1. Basic Settings
Open Cmder → Settings (Win + Alt + P):

**General:**
- Startup: Choose startup directory as your project root (`d:\www\zalo`)
- Interface: Enable "Single instance mode"

**Features:**
- Enable "Inject ConEmuHk"
- Enable "ANSI X3.64 / xterm 256 colors"

### 2. Tasks Configuration
Create custom tasks for your development workflow:

**Task: Zalo Dev**
```bash
cmd /k "cd /d d:\www\zalo && echo Zalo Mini App Development Environment Ready"
```

**Task: Zalo Start**
```bash
cmd /k "cd /d d:\www\zalo && yarn start"
```

**Task: Zalo Build**
```bash
cmd /k "cd /d d:\www\zalo && yarn build"
```

### 3. Aliases Setup
Create useful aliases in `config\user_aliases.cmd`:

```cmd
zalo=cd /d d:\www\zalo
start=yarn start
build=yarn build
deploy=yarn deploy
format=yarn format
login=yarn login
install=yarn install
dev=yarn start
test=yarn test
lint=yarn lint
```

## Medical-Themed Customization

### 1. Color Scheme
Apply a medical-themed color scheme:

**Background:** `#f8fffe` (Medical white)
**Text:** `#2c3e50` (Dark blue-gray)
**Accent:** `#0066CC` (Primary medical blue)
**Success:** `#00AA44` (Medical green)

### 2. Custom Prompt
Add to your profile to show medical context:

```cmd
prompt $P$_🏥 Zalo Healthcare $G$S
```

## Development Workflow

### 1. Daily Startup
```bash
# Open cmder in project directory
cmder /start d:\www\zalo

# Or use the custom task
cmder /task "Zalo Dev"
```

### 2. Common Commands
```bash
# Start development server
yarn start

# Format code
yarn format

# Deploy to Zalo platform
yarn deploy

# Install new dependencies
yarn add [package-name]

# Check project status
git status
```

### 3. Multiple Tabs Workflow
- **Tab 1:** Development server (`yarn start`)
- **Tab 2:** Git operations and file management
- **Tab 3:** Package management and builds
- **Tab 4:** Testing and debugging

## Integration with VS Code

### 1. Set Cmder as Default Terminal
In VS Code settings.json:
```json
{
  "terminal.integrated.defaultProfile.windows": "Command Prompt",
  "terminal.integrated.profiles.windows": {
    "Cmder": {
      "path": "C:\\tools\\cmder\\Cmder.exe",
      "args": ["/start", "d:\\www\\zalo"],
      "icon": "terminal-cmd"
    }
  }
}
```

### 2. Keyboard Shortcuts
- `Ctrl + Shift + `` - Open integrated terminal
- `Ctrl + Shift + 5` - Split terminal
- `Ctrl + PageUp/PageDown` - Switch between terminals

## Medical Development Context

### 1. Environment Variables
Set up medical-specific environment variables:
```cmd
set MEDICAL_ENV=development
set HOSPITAL_API=https://benhvienhoabinh.vn
set ZALO_MEDICAL_MODE=true
```

### 2. Quick Medical Commands
```bash
# Quick health check of the app
yarn start --health-check

# Medical data validation
yarn validate-medical-data

# Emergency deployment
yarn deploy --emergency
```

## Troubleshooting

### Common Issues
1. **Path not found:** Ensure cmder is properly installed and PATH is set
2. **Yarn not recognized:** Install Node.js and Yarn globally
3. **Git not working:** Use cmder full version with Git included

### Performance Tips
- Use cmder's tab completion
- Set up custom aliases for frequent commands
- Use multiple tabs for different tasks
- Enable fast startup in settings

## Security Considerations

### Medical Data Protection
- Never commit sensitive medical data
- Use environment variables for API keys
- Enable Git hooks for data validation
- Regular security audits of dependencies

### Access Control
- Set up proper user permissions
- Use secure connection for deployments
- Enable two-factor authentication for Zalo platform
- Regular password updates

## Next Steps

1. Install cmder using the guide above
2. Configure your development environment
3. Set up the medical-themed customizations
4. Test the workflow with your Zalo Mini App
5. Integrate with your existing VS Code setup

For more advanced configurations and medical-specific development practices, refer to the project documentation in the `docs/` directory.
