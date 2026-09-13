import os


class Settings:
    HOST = os.getenv("CALCULATOR_API_HOST", "0.0.0.0")
    PORT = int(os.getenv("CALCULATOR_API_PORT", "8000"))
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


settings = Settings()
