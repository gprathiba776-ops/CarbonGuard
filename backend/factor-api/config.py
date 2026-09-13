import os


class Settings:
    HOST = os.getenv("FACTOR_API_HOST", "0.0.0.0")
    PORT = int(os.getenv("FACTOR_API_PORT", "8000"))
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    REGISTRY_PATH = os.getenv(
        "FACTOR_REGISTRY_PATH",
        os.path.join(os.path.dirname(__file__), "factors.json"),
    )

    YEAR = int(os.getenv("FACTOR_YEAR", "2026"))

    SOURCE = os.getenv(
        "FACTOR_SOURCE",
        "UK Government GHG Conversion Factors 2026 — revised July 2026 flat file",
    )


settings = Settings()
