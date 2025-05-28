import json

def lector(array):

    archivo_json = 'etiquetas.json'

    try:
        with open(archivo_json, 'r', encoding='utf-8') as leido:
            datos = json.load(leido)
            etiquetas = [item['etiqueta'] for item in datos.get('etiquetas', [])]

            for etiqueta in etiquetas:
                if etiqueta in array:
                    print(f"Etiqueta válida encontrada: {etiqueta}")

    except FileNotFoundError:
        print(f"El archivo '{archivo_json}' no fue encontrado.")
    except json.JSONDecodeError as e:
        print(f"Error al decodificar el JSON: {e}")
