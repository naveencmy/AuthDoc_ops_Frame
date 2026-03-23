import cv2

def load_image(path: str):
    image = cv2.imread(path)
    if image is None:
        raise ValueError("Image could not be loaded")
    return image