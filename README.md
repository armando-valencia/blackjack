# Blackjack

A simple single player Blackjack game using React for the frontend and Python for the backend, communicating via WebSockets.

## Project Structure

- `client/`: Contains the React frontend (Vite)
- `server/`: Contains the Python backend

## Setup and Running

### Python (Server)

1.  **Navigate to the root directory of the project:**

    ```bash
    cd blackjack/
    ```

2.  **Create a virtual environment:**

    ```bash
    python -m venv .venv
    ```

    This creates a folder named `.venv` at the root of your project

3.  **Activate the virtual environment:**

    - **On macOS and Linux:**
      ```bash
      source .venv/bin/activate
      ```
    - **On Windows:**
      ```bash
      .\.venv\Scripts\activate
      ```
      You should see `(.venv)` at the beginning of your terminal, indicating the virtual environment is active

4.  **Install Python dependencies:**
    With the virtual environment activated, run the following command to install the packages listed in `server/requirements.txt`:

    ```bash
    pip install -r server/requirements.txt
    ```

5.  **Run the Python server:**
    With the virtual environment activated, run the `main.py` script:

    ```bash
    python server/main.py  # (python3 server/main.py on mac)
    ```

    > Press `Ctrl+C` to stop the server if needed

6.  **Deactivate the virtual environment:**
    When you are finished working on the backend, you can deactivate the virtual environment by running:
    ```bash
    deactivate
    ```
    The `(.venv)` will disappear from your prompt.

### React (Client)

1.  **Navigate to the client directory:**

    ```bash
    cd blackjack/client
    ```

2.  **Install client dependencies:**
    Run the following to install the packages in `package.json`:

    ```bash
    npm install
    ```

3.  **Run the React app:**
    Run the following command to start the development server:

    ```bash
    npm run dev
    ```

### **Open the app in your browser:**

With both the client and server now running, open a web browser and go to `http://localhost:5173` to see the app in action.

> After running `npm run dev`, you should see a message in the terminal indicating the app is running with a local URL (should be `http://localhost:5173`). You can click on this link or copy and paste it into your web browser to view the app.
