import os
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from werkzeug.utils import secure_filename

from ..AnalizarImagen import analizarImagen
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

IMAGE_FOLDER = os.path.join(os.getcwd(), 'imgs')
os.makedirs(IMAGE_FOLDER, exist_ok=True)
app.config['IMAGE_FOLDER'] = IMAGE_FOLDER

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Images(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(100))
    nombre = db.Column(db.String(100))
    valor = db.Column(db.Integer)
    descripcion = db.Column(db.String(255))
    fecha = db.Column(db.String(100))
    latitud = db.Column(db.Float)
    longitud = db.Column(db.Float)

    def __init__(self, image, valor, nombre, descripcion, fecha, latitud, longitud):
        self.image = image
        self.valor = valor
        self.nombre = nombre
        self.descripcion = descripcion
        self.fecha = fecha
        self.latitud = latitud
        self.longitud = longitud

class ImagesSchema(ma.Schema):
    class Meta:
        fields = ('id', 'image', 'nombre', 'valor', 'descripcion', 'fecha', 'latitud', 'longitud')

image_schema = ImagesSchema()
images_schema = ImagesSchema(many=True)


@app.route('/get', methods=['GET'])
def get_images():
    all_images = Images.query.all()
    results = images_schema.dump(all_images)
    return jsonify(results)

@app.route('/get/<id>/', methods=['GET'])
def get_image_by_id(id):
    image = Images.query.get_or_404(id)
    return image_schema.jsonify(image)

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        if 'photo' not in request.files:
            return jsonify({'error': 'No se ha enviado ninguna imagen'}), 400

        file = request.files['photo']
        if file.filename == '':
            return jsonify({'error': 'Nombre de archivo inválido'}), 400

        latitud = request.form.get('latitud', type=float)
        longitud = request.form.get('longitud', type=float)

        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = secure_filename(f"photo_{timestamp}.jpg")
        save_path = os.path.join(app.config['IMAGE_FOLDER'], filename)
        file.save(save_path)

        nombre, descripcion = analizarImagen(save_path)
        valor = 5
        fecha = datetime.now().strftime("%d de %B de %Y")

        new_image = Images(
            image=filename,
            valor=valor,
            nombre=nombre,
            descripcion=descripcion,
            fecha=fecha,
            latitud=latitud,
            longitud=longitud
        )
        db.session.add(new_image)
        db.session.commit()

        return jsonify({
            'message': 'Imagen guardada con análisis y ubicación',
            'id': new_image.id,
            'filename': filename,
            'valor': valor,
            'nombre': nombre,
            'descripcion': descripcion,
            'fecha': fecha,
            'latitud': latitud,
            'longitud': longitud
        })

    except Exception as e:
        app.logger.exception("Error al subir la imagen")
        return jsonify({'error': 'Error interno del servidor', 'detail': str(e)}), 500

@app.route('/delete/<id>/', methods=['DELETE'])
def delete_image(id):
    image = Images.query.get_or_404(id)
    db.session.delete(image)
    db.session.commit()
    return image_schema.jsonify(image)

@app.route('/imgs/<path:filename>')
def get_image_file(filename):
    return send_from_directory(app.config['IMAGE_FOLDER'], filename)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host='192.168.1.62', port=3000, debug=True)
