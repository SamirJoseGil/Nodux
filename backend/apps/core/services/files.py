import os, uuid

class FileService:

    @staticmethod
    def random_filename(filename: str, folder: str) -> str:
        ext = filename.split('.')[-1]
        random_name = f"{uuid.uuid4()}.{ext}"
        return os.path.join(folder, random_name)