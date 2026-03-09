# KodeX Frontend

Frontend for **KodeX**, a browser-based cloud IDE that allows users to write, run, and manage projects entirely from the web. The application provides a development environment with a file explorer, code editor, terminal access, and persistent project storage.

## Overview

KodeX enables users to work on coding projects without installing local tooling. Each user gets an isolated environment where code can be edited, executed, and managed directly in the browser.

This repository contains the **React-based frontend** responsible for:

- User authentication and session management
- Project workspace UI
- File explorer and editor
- Terminal interface connected to remote containers
- Communication with backend APIs and WebSocket services

---

## Tech Stack

- **React**
- **React Router**
- **Axios**
- **CodeMirror** (code editor)
- **XTerm** (web terminal)
- **WebSockets**
- **React Arborist** (file explorer)

---

## Key Features

### Protected Routes

The application implements **route guards** to ensure that only authenticated users can access protected sections such as the project workspace.

Routes are protected using custom components like:

- `RequiredAuth`
- `RequiredOAuth`

These components validate authentication state before rendering sensitive pages.

---

### Automatic Token Refresh (Axios Interceptors)

Axios interceptors are used to automatically handle **expired access tokens**.

When a request fails due to an expired token:

1. The interceptor triggers a **refresh token request**.
2. A new access token is obtained from the backend.
3. The original request is retried automatically.

This allows users to remain logged in without manual reauthentication.

---

### WebSocket Communication

WebSockets are used for **real-time communication** between the frontend and backend.

This is primarily used for:

- Streaming terminal input/output
- Real-time shell interaction
- Low-latency data transfer between the browser and backend services

---

### Remote Shell Access

Each authenticated user is assigned a **dedicated Docker container** on the backend.

Through the frontend terminal interface, users can:

- Execute shell commands
- Run programs
- Interact with the container environment in real time

Terminal communication is handled through WebSockets to provide a responsive shell experience.

---

### Persistent Project Storage

User projects are stored in **Google Drive** to ensure persistence across sessions.

This allows:

- Projects to remain available after logout
- Reliable storage without maintaining local server state
- Seamless project recovery when users return

The frontend interacts with backend APIs that manage file synchronization with the user's Google Drive.

## Getting Started

### Installation

1. clone the repository
2. open the project's root folder in your preferred code editor
3. open a terminal
4. ```npm install``` or ```npm i```

### Run Dev Server

```npm run dev```

### Build

```npm run build```

## Related Respository

### Backend repository:
[KodeX Backend](https://github.com/Subhashish005/KodeX-Backend)

### Handles:
* Authentication
* Container life cycle management
* File management
* WebSocket service
* Google Drive integration

---

## Screenshots

### Home page:
![](https://github.com/Subhashish005/KodeX-Frontend/tree/main/public/KodeX_home_page.png?raw=true)

### Login/Sign up page:
![](https://github.com/Subhashish005/KodeX-Frontend/tree/main/public/KodeX_login_page.png?raw=true)

![](https://github.com/Subhashish005/KodeX-Frontend/tree/main/public/KodeX_signup_page.png?raw=true)

### OAuth Consent page:
![](https://github.com/Subhashish005/KodeX-Frontend/tree/main/public/KodeX_oauth_disclaimer.png?raw=true)

### Projects page:
![](https://github.com/Subhashish005/KodeX-Frontend/tree/main/public/KodeX_projects_page.png?raw=true)

### Playground page:
![](https://github.com/Subhashish005/KodeX-Frontend/tree/main/public/KodeX_playground_page.png?raw=true)