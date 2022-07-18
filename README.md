# Next.js Teslo Shop
Para correr localmente se necesita la base de datos
```
docker-compose up -d
```
* El -d, significa __detached__

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
*Mongo URL local:
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

* Reconstruir los módulos de node y levantar el servidor local
```
npm install
npm run dev
```

## Llenar la base de datos con información de pruebas
LLamar al endpoint:
```
http://localhost:3000/api/seed
```