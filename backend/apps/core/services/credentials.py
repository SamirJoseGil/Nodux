import secrets, random

class CredentialService:

    @staticmethod
    def generateUsername(first_name: str, last_name: str) -> str:
        return f"{first_name.lower()}.{last_name.lower()}{random.randint(100,999)}"

    @staticmethod
    def generatePassword(length: int = 12) -> str:
        return secrets.token_urlsafe(length)