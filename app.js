// Importación de módulos necesarios
const express = require('express'); // Framework para manejar la aplicación web
const db = require('./database'); // Módulo para la conexión a la base de datos
const { createResponseJson } = require('./controllers/passengers'); // Función para crear la respuesta JSON

const app = express(); // Creación de la aplicación Express
const port = 3000; // Puerto en el que se ejecutará el servidor

// Middleware para procesar el cuerpo JSON de las solicitudes entrantes
app.use(express.json());

// Definición del endpoint de la API para obtener los pasajeros de un vuelo
app.get('/flights/:id/passengers', async (req, res) => {
    try {
        const flightId = req.params.id; // Extraer el ID del vuelo de los parámetros de la URL
        const responseJson = await createResponseJson(flightId); // Llamada a la función para obtener la respuesta JSON
        
        res.json(responseJson); // Enviar la respuesta JSON al cliente
    } catch (error) {
        console.error(error); // Registro de errores en la consola

        if (error.message.includes('could not connect to db')) {
            // Error de conexión a la base de datos
            return res.json({
                code: 400,
                errors: "could not connect to db"
            });
        } else {
            // Vuelo no encontrado, envía una respuesta 404 como se pedia en PDF
            return res.json({
                code: 404,
                data: {}
            });
        }
    }
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
