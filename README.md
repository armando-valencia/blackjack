# Basic Blackjack WebSocket Demo

This project demonstrates a simple browser-based Blackjack game using React (with Vite and Tailwind CSS) for the frontend and Python for the backend, communicating via WebSockets.

## Project Structure

- `client/`: Contains the React frontend application.
- `server/`: Contains the Python backend application.
  - `main.py`: The main Python server script.
  - `requirements.txt`: Lists the Python dependencies.
- `.venv/`: Contains the Python virtual environment for the project.

## Setup and Running

### Python Backend

1.  **Navigate to the root directory of the project:**

    ```bash
    cd your-blackjack-project/ # Or wherever you cloned the project
    ```

2.  **Create a virtual environment:**

    ```bash
    python -m venv .venv
    ```

    This creates a directory named `.venv` at the root of your project containing the virtual environment files.

3.  **Activate the virtual environment:**

    - **On macOS and Linux:**
      ```bash
      source .venv/bin/activate
      ```
    - **On Windows:**
      `bash
    .\.venv\Scripts\activate
    `
      You should see `(.venv)` at the beginning of your terminal prompt, indicating the virtual environment is active.

4.  **Install Python dependencies:**
    With the virtual environment activated, run the following command to install the necessary packages listed in `server/requirements.txt`:

    ```bash
    pip install -r server/requirements.txt
    ```

5.  **Run the Python server:**
    With the virtual environment activated, navigate to the `server/` directory and run the `main.py` script:

    ```bash
    cd server/
    python main.py
    ```

    Press `Ctrl+C` to stop the server.

6.  **Deactivate the virtual environment:**
    When you are finished working on the backend, you can deactivate the virtual environment. Navigate back to the root directory if you are in `server/`, then run:
    ```bash
    cd .. # If you are in the server directory
    deactivate
    ```
    The `(.venv)` will disappear from your prompt.

### React Frontend

_(We will add setup and running instructions for the frontend later)_
