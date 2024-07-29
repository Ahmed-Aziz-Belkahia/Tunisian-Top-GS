# Tunisian-Top-GS

Tunisian Top is a learning platform.

## Developers
- Kiro
- Dark
- Zend
- Alee
- Khawat

## Steps to Launch the Project

1. **Create a Virtual Environment**
    ```bash
    pip install virtualenv
    ```

2. **Install Requirements**
    ```bash
    pip install -r requirements.txt
    ```

3. **Run the Server**
    ```bash
    python manage.py runserver
    ```

4. **Run Livereload for Live Server Refreshing**
    ```bash
    python manage.py livereload
    ```

5. **Set Up Docker for Chat and Notification Socket**
    1. Install Docker.
    2. Run Redis:
        ```bash
        docker run --rm -p 6379:6379 redis:7
        ```

## Contribution Guidelines

1. Check the status of your files:
    ```bash
    git status
    ```

2. Ignore migration files and add only your changed files:
    ```bash
    git add <your-files>
    ```

3. Commit your changes:
    ```bash
    git commit -m "Your commit message"
    ```

4. Push to the main branch:
    ```bash
    git push origin main
    ```

5. Notify the team about your updates on Discord.

**Please make sure to only push the files you have changed and notify us on Discord about your updates.**
