from Imagen import Imagen
from Monedas import Monedas
import os

def setEnvironmentKeys():
    os.system('setx VISION_KEY CuZdK5euE5x8MXeF9XQoKuR1JjlpaIghbzsr3IDd63jJpny9afgFJQQJ99BCAC5RqLJXJ3w3AAAFACOGs6lJ')
    os.system('setx VISION_ENDPOINT https://imganalyzer.cognitiveservices.azure.com/')

#Funcion que analiza la imagen

def analizarImagen(url):
    import os
    from deep_translator import GoogleTranslator
    from azure.ai.vision.imageanalysis import ImageAnalysisClient
    from azure.ai.vision.imageanalysis.models import VisualFeatures
    from azure.core.credentials import AzureKeyCredential

    # Inicia el login
    import sys
    import logging

    # Consigue el logger
    # Librerias de 'azure.core` y `azure.ai.vision.imageanalysis'.
    logger = logging.getLogger("azure")

    # Set the desired logging level. logging.INFO or logging.DEBUG are good options.
    logger.setLevel(logging.INFO)

    # Direct logging output to stdout (the default):
    handler = logging.StreamHandler(stream=sys.stdout)
    # Or direct logging output to a file:
    # handler = logging.FileHandler(filename = 'sample.log')
    logger.addHandler(handler)

    # Optional: change the default logging format. Here we add a timestamp.
    formatter = logging.Formatter("%(asctime)s:%(levelname)s:%(name)s:%(message)s")
    handler.setFormatter(formatter)
    # [END logging]

    #Seteo de las variables de sesion, si falla printea que falta alguna llave
    try:
        endpoint = os.environ["VISION_ENDPOINT"]
        key = os.environ["VISION_KEY"]
    except KeyError:
        print("Missing environment variable 'VISION_ENDPOINT' or 'VISION_KEY'")
        print("Set them before running this sample.")
        exit()

    # Esta funcion carga la imagen y lo lee en bytes
    with open(url, "rb") as f:
        image_data = f.read()

    # Crea un cliente de analizador de imagenes
    client = ImageAnalysisClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(key),
    )

    # Analiza todos los tags de la imagen.
    result = client.analyze(
        image_data=image_data,
        visual_features=[
            VisualFeatures.TAGS,
            VisualFeatures.CAPTION
        ]
    )
    tagsEnLaImagen = []
    tag_mas_probable = ""
    mayor_confianza = 0
    palabras_clave = ["arbol", "bus stop", "trash can"]
    if result.tags:
        for tag in result.tags.list:
            tagsEnLaImagen.append(tag.name)
            if tag.name == "tree" or tag.name == "trash can" or tag.name == "bus stop":
                print(tag.name)
                mayor_confianza = tag.confidence
                tag_mas_probable = tag.name

    caption_texto = result.caption['text'] if result.caption else "Sin descripción"
    palabras_clave = ["arbol", "bus stop", "trash can", "dog", "bird"]


    for palabra in palabras_clave:
        if palabra in caption_texto:
            tag_mas_probable = palabra
            break

    traducido =  GoogleTranslator(source='auto', target='es').translate(tag_mas_probable)
    caption_traducida = GoogleTranslator(source='auto', target='es').translate(caption_texto)
    print(traducido)
    print(caption_traducida)
    return traducido, caption_traducida

#Funcion que ejecuta el programa principal
def guardarImagen():
    objeto = analizarImagen("imgs/Marquesina2.jpg")

    for objeto in objeto:
        print(objeto)

    for objeto in objeto:
        print(objeto)
