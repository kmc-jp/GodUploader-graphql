import os

PUBLIC_FOLDER = os.environ.get('PUBLIC_FOLDER', os.path.join(os.path.dirname(__file__), '../../public'))
BASE_URL = os.environ.get('BASE_URL', 'http://localhost:3000/')
GYAZO_ACCESS_TOKEN = os.environ.get('GYAZO_ACCESS_TOKEN')
SLACK_WEBHOOK_URL = os.environ.get('SLACK_WEBHOOK_URL')
