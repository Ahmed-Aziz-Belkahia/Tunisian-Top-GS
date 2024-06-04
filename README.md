# Tunisian-Top-GS

**Tunisian Top - A Learning Platform**

## Developers
- Kiro
- Dark
- Kyrix
- Zend
- Alee
- Khawat

## Steps to Launch the Project

1. **Create and Activate Virtual Environment**
   ```bash
   pip install virtualenv
Install Requirements

bash
Copy code
pip install -r requirements.txt
Run the Development Server

bash
Copy code
python manage.py runserver
Enable Live Reload (Optional)

bash
Copy code
python manage.py livereload
Setup Docker for Chat and Notification Socket

Install Docker

Run Redis Container

bash
Copy code
docker run --rm -p 6379:6379 redis:7
