# Luigi-Healthcare
# Group Number: 4
# Authors: Matthew Walker, 


# Getting Started

## Running the Frontend Locally

### Install VS Code Live Server Extension

1. Open Visual Studio Code.
2. Navigate to the Extensions tab (Ctrl+Shift+X).
3. Search for "Live Server" and install it. it serves on port 5500

### Launch Frontend

1. Open your project folder in VS Code.
2. Locate and open `index.html`.
3. Click **Go Live** in the bottom-right corner of VS Code.
4. The frontend will now run locally and open automatically in your browser at `http://localhost:5500`.

---

## Toggling SQL Server Usage

The frontend can be configured to either use local configurations or connect to a backend server:

### To use local configurations:

1. Navigate to `/js/config.js`.
2. Set:
```javascript
useRealAPI = false;
```
doinn this will make it so all backend stuff is not tested

### To use backend server:

1. Navigate to `/js/config.js`.
2. Set:
```javascript
useServerBackend = true;
```
