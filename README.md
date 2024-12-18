# Character API

This is a RESTful API designed to manage and manipulate character data (inspired by "Rick and Morty"). It provides endpoints to fetch, sort, delete, and restore character data with robust error handling and undo/redo functionality.

---

## Table of Contents
1. [Project Description](#project-description)
2. [How to Install and Run the Project](#how-to-install-and-run-the-project)
3. [How to Use the Project](#how-to-use-the-project)


---

## Project Description

The Character API is a backend project that fetches, manipulates, and manages character data. It allows you to:
- Fetch character data (e.g., from an external API or mock data file).
- Sort the data alphabetically.
- Soft-delete a character and restore it later with undo/redo functionality.
- Ensure robust error handling for out-of-range parameters and invalid operations.

The main goals of the project are to practice RESTful API development, file manipulation, and state management (undo/redo).

---

## How to Install and Run the Project

### Prerequisites:
Ensure you have the following installed:
- [Node.js](https://nodejs.org) (v16 or higher)
- npm (Node Package Manager)

### Steps to Run:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/character-api.git
   cd character-api

2. **Install dependencies**:
    npm install

3. **Run the server**:
    npm start

4. **The API will be live at**:
    http://localhost:3000/api/character


---

## How to Use the Project
    General Notes:
    All responses are in JSON format.
    Use a tool like Postman or curl to test the endpoints.
