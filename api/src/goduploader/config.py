import os

import myenv


class AppConfig(myenv.BaseEnv):
    base_url = "http://localhost:3000/"
    debug = False
    db_url = ""
    db_echo = False
    gyazo_access_token = ""
    public_folder = os.path.join(os.path.dirname(__file__), "../../public")
    slack_token = ""

    twitter_consumer_key = ""
    twitter_consumer_secret = ""
    twitter_access_token = ""
    twitter_access_token_secret = ""

    testing = False


app_config = AppConfig()
