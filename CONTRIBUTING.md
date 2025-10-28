# Contributing to JaldiKaro

First off, thank you for considering contributing to JaldiKaro! 🎉 It's people like you that make JaldiKaro such a great tool for building websites quickly and effortlessly.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Style Guide](#javascript-style-guide)
  - [React Component Guidelines](#react-component-guidelines)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Community](#community)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. By participating, you are expected to uphold the following principles:

- **Be respectful**: Treat everyone with respect. Disagreements happen, but they should be handled professionally.
- **Be inclusive**: We welcome contributors from all backgrounds and experience levels.
- **Be collaborative**: Work together to make JaldiKaro better for everyone.
- **Be constructive**: Provide helpful feedback and be open to receiving it.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as [GitHub issues](https://github.com/samarthnaikk/JaldiKaro/issues). Before creating a bug report, please check if the issue already exists.

**When creating a bug report, include:**

- **Clear and descriptive title**
- **Exact steps to reproduce the problem**
- **Expected behavior** vs. **actual behavior**
- **Screenshots or GIFs** (if applicable)
- **Environment details**:
  - OS and version
  - Node.js version (`node --version`)
  - npm version (`npm --version`)
  - Browser and version (if frontend issue)
- **Additional context**: Any other information that might be relevant

**Example Bug Report:**

```markdown
**Title:** Form elements not saving database mappings

**Description:**
When I add an input field and configure the database table and column names, 
the mapping doesn't appear in the generated output.

**Steps to Reproduce:**
1. Start the application with `npm run dev`
2. Add an input field from the sidebar
3. Configure table name as "users" and column name as "email"
4. Click "Generate Website"
5. Check the generated all_page.txt file

**Expected:** Database mapping should show in the output
**Actual:** No database mapping appears

**Environment:**
- OS: Ubuntu 22.04
- Node: v18.17.0
- Browser: Chrome 118
```

### Suggesting Enhancements

Enhancement suggestions are also tracked as GitHub issues. Before creating an enhancement suggestion, please check if a similar suggestion already exists.

**When creating an enhancement suggestion, include:**

- **Clear and descriptive title**
- **Detailed description** of the suggested enhancement
- **Use cases**: Why would this enhancement be useful?
- **Possible implementation**: If you have ideas on how to implement it
- **Mockups or examples**: Visual aids help a lot!

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good-first-issue` - Good for newcomers
- `help-wanted` - Extra attention needed
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation

### Pull Requests

**Process for submitting a pull request:**

1. **Fork the repository** and create your branch from `master`:
   ```bash
   git clone https://github.com/YOUR_USERNAME/JaldiKaro.git
   cd JaldiKaro
   git checkout -b feature/my-amazing-feature
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Make your changes**:
   - Write clear, readable code
   - Follow the style guides below
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**:
   ```bash
   npm run dev
   ```
   - Test both client and server functionality
   - Verify no console errors
   - Check generated output is correct

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/my-amazing-feature
   ```

7. **Open a Pull Request**:
   - Go to the [JaldiKaro repository](https://github.com/samarthnaikk/JaldiKaro)
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with details

**Pull Request Guidelines:**

- Keep PRs focused on a single issue or feature
- Include a clear description of what the PR does
- Link to related issues using keywords (e.g., "Fixes #123")
- Ensure all checks pass
- Request review from maintainers
- Be responsive to feedback and questions

---

## Style Guides

### Git Commit Messages

Follow these conventions for clear, consistent commit messages:

**Format:**
```
Type: Brief summary (50 chars or less)

More detailed explanation if needed (wrap at 72 chars).
Include motivation for the change and contrast with previous behavior.

- Bullet points are okay
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
```

**Types:**
- `Add:` New feature or functionality
- `Fix:` Bug fix
- `Update:` Modifications to existing features
- `Refactor:` Code restructuring without changing functionality
- `Docs:` Documentation updates
- `Style:` Formatting, missing semicolons, etc. (no code change)
- `Test:` Adding or updating tests
- `Chore:` Maintenance tasks, dependency updates

**Examples:**
```bash
Add: Database validation for form elements

Fix: Dropdown options not rendering correctly

Update: Improve canvas drag performance

Refactor: Extract API logic into separate service

Docs: Add deployment guide to documentation

Style: Format App.js with Prettier

Test: Add unit tests for InputElement component

Chore: Update React Flow to v11.11.5
```

### JavaScript Style Guide

- **ES6+ Standards**: Use modern JavaScript features
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings (except to avoid escaping)
- **Semicolons**: Use semicolons at the end of statements
- **Naming Conventions**:
  - `camelCase` for variables and functions
  - `PascalCase` for React components and classes
  - `UPPER_SNAKE_CASE` for constants
  - Descriptive names (avoid single letters except for loops)

**Example:**

```javascript
// Good
const userName = 'John Doe';
const MAX_RETRIES = 3;

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Avoid
const x = 'John Doe';
const max_retries = 3;

function calc(i) {
  return i.reduce((s, it) => s + it.price, 0);
}
```

### React Component Guidelines

- **Functional Components**: Use functional components with hooks
- **File Organization**: One component per file
- **Component Structure**:
  ```javascript
  import statements
  
  // Constants and helper functions
  
  // Main component
  function ComponentName({ props }) {
    // State declarations
    // useEffect and other hooks
    // Event handlers
    // Helper functions
    // Return JSX
  }
  
  export default ComponentName;
  ```

- **Props**: Destructure props in function parameters
- **State**: Use `useState` for simple state, `useReducer` for complex state
- **Side Effects**: Use `useEffect` with proper dependencies
- **Memoization**: Use `useMemo` and `useCallback` when appropriate
- **Comments**: Add comments for complex logic or non-obvious behavior

**Example:**

```javascript
import React, { useState, useCallback, useMemo } from 'react';

const UserProfile = ({ userId, onUpdate }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize expensive calculations
  const displayName = useMemo(() => {
    if (!userData) return 'Guest';
    return `${userData.firstName} ${userData.lastName}`;
  }, [userData]);

  // Use useCallback for event handlers passed as props
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    onUpdate(userData);
  }, [userData, onUpdate]);

  return (
    <div className="user-profile">
      <h2>{displayName}</h2>
      {/* Component JSX */}
    </div>
  );
};

export default UserProfile;
```

---

## Development Setup

### Prerequisites

- **Node.js**: v14.0 or higher
- **npm**: v6.0 or higher
- **Git**: Latest version

### Local Setup

1. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/JaldiKaro.git
   cd JaldiKaro
   ```

2. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/samarthnaikk/JaldiKaro.git
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```
   This starts both client (port 3000) and server (port 3001)

5. **Verify setup**:
   - Open http://localhost:3000 in your browser
   - Check console for any errors
   - Try adding elements to the canvas

### Project Structure

```
JaldiKaro/
├── client/                   # React frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   └── index.js        # Entry point
│   └── package.json
├── server/                  # Express backend
│   ├── index.js            # API endpoints
│   └── package.json
├── package.json            # Root package (dev scripts)
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Keep your branch updated**:
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

3. **Make incremental commits**:
   - Commit early and often
   - Each commit should be a logical unit
   - Write clear commit messages

4. **Test thoroughly**:
   - Test all affected functionality
   - Check both client and server
   - Verify no console errors or warnings

---

## Testing

Currently, JaldiKaro doesn't have automated tests, but here's how to manually test:

### Frontend Testing

1. **UI Elements**:
   - Test adding each type of element (input, dropdown, button, etc.)
   - Verify properties and styling
   - Check drag and drop functionality

2. **Configuration**:
   - Test the input configuration modal
   - Verify database mappings appear correctly
   - Check required field indicators

3. **Canvas**:
   - Test zooming and panning
   - Verify mini-map functionality
   - Check element positioning

4. **Connections**:
   - Test connecting elements
   - Verify edge rendering
   - Check connection logic

### Backend Testing

1. **API Endpoints**:
   - Test the `/generate` endpoint
   - Verify request/response format
   - Check error handling

2. **Output Generation**:
   - Test with various node/edge configurations
   - Verify `all_page.txt` format
   - Check SQL schema generation

3. **Edge Cases**:
   - Empty canvas
   - No database mappings
   - Large numbers of elements

### Browser Testing

Test in major browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

---

## Community

### Where to Get Help

- **GitHub Issues**: [Report bugs or ask questions](https://github.com/samarthnaikk/JaldiKaro/issues)
- **Discussions**: Use GitHub Discussions for general questions
- **Pull Request Comments**: Get feedback on your contributions

### Recognition

All contributors will be recognized in:
- GitHub's contributors page
- Release notes (for significant contributions)
- Future CONTRIBUTORS.md file

---

## Areas We Need Help With

We're especially looking for contributions in these areas:

### High Priority
- 🧪 **Testing Infrastructure**: Set up Jest, React Testing Library
- 📱 **Mobile Responsiveness**: Make the canvas mobile-friendly
- ♿ **Accessibility**: ARIA labels, keyboard navigation
- 🎨 **UI/UX Improvements**: Better styling, animations, user experience

### Medium Priority
- 🔌 **Database Connectors**: MongoDB, PostgreSQL support
- 📊 **Code Generation**: Export actual React components
- 🔐 **Authentication**: User accounts and saved projects
- 📝 **Documentation**: API docs, tutorials, examples

### Nice to Have
- 🌐 **Internationalization**: Multi-language support
- 🎯 **Templates**: Pre-built component templates
- 🔄 **Real-time Collaboration**: Multi-user editing
- 📦 **Plugin System**: Extensibility for custom elements

---

## Questions?

Don't hesitate to ask! We're here to help:

- Open an issue with the `question` label
- Tag maintainers in discussions
- Ask in pull request comments

---

**Thank you for contributing to JaldiKaro! 🚀**

Together, we're building a tool that makes web development faster and more accessible for everyone.
