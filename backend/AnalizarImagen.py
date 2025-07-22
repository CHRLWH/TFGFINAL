import os
from deep_translator import GoogleTranslator
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential

def analizarImagen(url):
    try:
        endpoint = os.environ["VISION_ENDPOINT"]
        key = os.environ["VISION_KEY"]
    except KeyError:
        print("Missing environment variable 'VISION_ENDPOINT' or 'VISION_KEY'")
        print("Set them before running this sample.")
        exit()

    with open(url, "rb") as f:
        image_data = f.read()

    client = ImageAnalysisClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(key),
    )

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
    palabras_clave = ["arbol", "bus stop", "trash can", "dog", "bird"]

    if result.tags:
        for tag in result.tags.list:
            tagsEnLaImagen.append(tag.name)
            if tag.name == "tree" or tag.name == "trash can" or tag.name == "bus stop":
                mayor_confianza = tag.confidence
                tag_mas_probable = tag.name

    caption_texto = result.caption['text'] if result.caption else "Sin descripción"

    for palabra in palabras_clave:
        if palabra in caption_texto:
            tag_mas_probable = palabra
            break

    traducido =  GoogleTranslator(source='auto', target='es').translate(tag_mas_probable)
    caption_traducida = GoogleTranslator(source='auto', target='es').translate(caption_texto)
    return traducido, caption_traducida
