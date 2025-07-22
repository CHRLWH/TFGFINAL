import sqlite3
import bcrypt

conn = sqlite3.connect("usuarios.db")
cursor = conn.cursor()

def registrar_usuario(username, password):
    password_bytes = password.encode('utf-8')
    password_hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    correcto = False
    try:
        cursor.execute("INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)", (username, password_hash))
        conn.commit()
    except sqlite3.IntegrityError:
        print(f"El nombre de usuario '{username}' ya existe.")

def verificar_usuario(username, password):
    cursor.execute("SELECT contrasena FROM usuarios WHERE usuario = ?", (username,))
    if(password == cursor):
        correcto = True
