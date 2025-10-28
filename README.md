# JaldiKaro

**JaldiKaro** (Hindi: "Do It Quickly") is a visual, no-code website builder that enables developers and designers to rapidly prototype and generate full-stack web applications through an intuitive drag-and-drop interface.

---

## Project Overview

JaldiKaro combines the visual design capabilities of tools like Figma with the backend flow orchestration of platforms like n8n, providing a unified canvas for building complete web applications. The platform allows you to:

- **Design UI visually**: Drag and drop form elements, buttons, text, images, and containers onto a canvas
- **Configure database mappings**: Connect form fields directly to database tables and columns
- **Build backend flows**: Create API endpoints, validation rules, and database connections
- **Generate code automatically**: Export complete website specifications with database schemas and element mappings

### Key Features

- **Visual Design Canvas**: Figma-style drag-and-drop interface for UI elements
- **Rich Form Elements**: Input fields, dropdowns, radio buttons, checkboxes, and text areas
- **Database Integration**: Map form elements to database tables and columns
- **API Flow Builder**: Define backend endpoints and data flows
- **Auto-generate Schema**: Automatically create SQL database schemas from form mappings
- **Multi-page Support**: Design multiple pages and define navigation flows
- **Export Reports**: Generate detailed reports with element specifications and connections

### Technology Stack

**Frontend:**
- React 18.2.0
- React Flow 11.11.4 (visual canvas)
- React Scripts 5.0.1

**Backend:**
- Node.js
- Express 4.18.2
- CORS support

**Development:**
- Concurrently (run client and server simultaneously)

---

## Upcoming Features

JaldiKaro is actively evolving. Here are some of the major features planned for upcoming releases:

- **Multi-language coding support**: Generate and manage code in multiple programming languages, enabling broader deployment and customization.
- **Hosting assistance**: Step-by-step guidance for deploying websites on popular platforms such as Vercel, Netlify, and Render.
- **Vulnerability checks**: Automated identification and reporting of known vulnerabilities in project dependencies.
- **Security insights**: Information and recommendations about potential security concerns and best practices for secure deployment.
- **Offline coding support**: Local code generation and editing powered by LLMs such as Ollama and Hugging Face models, enabling development without an internet connection.

Stay tuned for updates as these features are released!

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/samarthnaikk/JaldiKaro.git
   cd JaldiKaro
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```
   
   This will automatically install dependencies for both the client and server using the postinstall script.

### Running the Application

#### Development Mode (Recommended)

Run both the client and server concurrently:

```bash
npm run dev
```

This will start:
- **Client** on `http://localhost:3000`
- **Server** on `http://localhost:3001`

#### Run Individually

**Client only:**
```bash
npm start --prefix client
```

**Server only:**
```bash
npm start --prefix server
```

---

## Usage Guide

### Creating a Website

1. **Start the application** using `npm run dev`
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Choose your mode**:
   - **Design Tab**: Add and configure UI elements
   - **Backend Flow Tab**: Define API endpoints and database connections

### Adding UI Elements

1. Click on any element from the sidebar (Input Field, Dropdown, Button, etc.)
2. Configure the element properties in the modal dialog
3. Drag elements to position them on the canvas
4. Connect elements by dragging from the connection handle

### Database Mapping

When adding form elements:
1. Enter the **Table Name** (e.g., `users`, `products`)
2. Enter the **Column Name** (e.g., `username`, `email`)
3. Mark as **Required** if the field is mandatory

### Generating Output

1. Design your pages and add form elements
2. Configure database mappings and backend flows
3. Click the **"Generate Website"** button
4. Check the server terminal for the output report
5. Find the generated `all_page.txt` file in the `server/` directory

### Output Format

The generated report includes:
- **Pages Overview**: All pages with dimensions and positions
- **Form Elements**: Complete list of inputs, dropdowns, checkboxes, etc.
- **UI Elements**: Buttons, text, images, and containers
- **API Endpoints**: Backend routes and methods
- **Database Connections**: Connection strings and mappings
- **Element Connections**: Relationships between frontend and backend
- **Auto-generated SQL Schema**: CREATE TABLE statements based on form mappings
- **Statistics Summary**: Count of all elements and connections

---

## Project Structure

```
JaldiKaro/
├── client/                    # React frontend application
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── App.js            # Main React component with visual canvas
│   │   └── index.js          # React entry point
│   └── package.json          # Client dependencies
├── server/                    # Express backend server
│   ├── index.js              # API endpoints and report generation
│   └── package.json          # Server dependencies
├── package.json              # Root package with dev scripts
└── README.md                 # This file
```

---

## Contributing Guidelines

We welcome contributions to JaldiKaro! Here's how you can help:

### How to Contribute

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/JaldiKaro.git
   cd JaldiKaro
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** on the main repository

### Commit Message Convention

Use clear and descriptive commit messages:
- `Add: New feature or functionality`
- `Fix: Bug fix`
- `Update: Modifications to existing features`
- `Refactor: Code restructuring without changing functionality`
- `Docs: Documentation updates`

### Code Style Guidelines

- **JavaScript**: Follow ES6+ standards
- **React**: Use functional components with hooks
- **Formatting**: Use consistent indentation (2 spaces)
- **Comments**: Add comments for complex logic
- **Naming**: Use camelCase for variables and functions, PascalCase for components

### Areas for Contribution

We especially welcome contributions in these areas:
- New UI element types (tables, tabs, modals)
- Backend integrations (MongoDB, PostgreSQL, GraphQL)
- Enhanced code generation (React components, API routes)
- Testing infrastructure (unit tests, integration tests)
- Documentation improvements
- Bug fixes and performance optimizations
- Internationalization (i18n)

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists in the GitHub Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Screenshots if applicable
   - Your environment (OS, Node version, browser)

### Development Setup

After cloning and installing dependencies:
1. Make sure both client and server are running
2. Test your changes thoroughly
3. Ensure no console errors in browser or terminal
4. Check that generated output is correct

---

## License Information

### MIT License

Copyright (c) 2025 Samarth Naik (samarthnaikk)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.**

### Third-Party Licenses

This project uses several open-source libraries:
- **React** (MIT License)
- **React Flow** (MIT License)
- **Express** (MIT License)
- **CORS** (MIT License)

---

## Acknowledgments

- Built with [React](https://reactjs.org/) and [React Flow](https://reactflow.dev/)
- Inspired by visual design tools like Figma and no-code platforms like n8n
- Thanks to all contributors and the open-source community

---

## Support

For questions, suggestions, or issues:
- **GitHub Issues**: [Create an issue](https://github.com/samarthnaikk/JaldiKaro/issues)
- **Repository**: [JaldiKaro on GitHub](https://github.com/samarthnaikk/JaldiKaro)

---

## Roadmap

Future enhancements planned:
- [ ] Real-time collaboration features
- [ ] Template library with pre-built components
- [ ] Export to React/Vue/Angular code
- [ ] Database connection testing
- [ ] Authentication and user management
- [ ] Custom styling and theming
- [ ] Mobile-responsive preview
- [ ] Version control and history
- [ ] Plugin/extension system

---

Happy Building!

*JaldiKaro - Build websites quickly, visually, and effortlessly.*
