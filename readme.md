iniciar el docker-compose para activar la base de datos.
informacion obtenida de: https://github.com/pthom/northwind_psql

Una vez iniciado el docker de la base de datos se debe seguir el siguiente orden:


Primero iniciar server grpc (Se inicia en http://127.0.0.1:50051)

  node src/server/server.js

iniciar servidor UI y Cliente (Se inicia en http://127.0.0.1:5555)

  node src/client/app.js



