
Levantar el proyecto: 

Instalar Dependencias: Dado que se utiliza Node.js se necesita instalar todas las dependencias del proyecto. Esto se puede hacer utilizando npm. El comando es el siguiente:  

npm install

Inicializar el proyecto con el siguiente comando

npm run dev

Para ver la respuesta de la API se tiene el sigueinte puerto

https://api-postulacion-bsale.onrender.com/flights/1/passengers



¿Cómo se resolvio? 

A continuación se describe los pasos de la lógica para resolver el problema: 


Identificación de Asientos Tomados:
Se empieza identificando los asientos ya tomados en un vuelo particular. Esto se hace con la ayuda de la función getAvailableSeats, que busca los pases de abordar con seat_id no nulos y devuelve todos los asientos que no están en esa lista.

Inicialización del Mapa de Asientos:
Una vez que se conocen los asientos disponibles y tomados, se crea un mapa de asientos utilizando la función initializeSeatMap. Este mapa permite una representación fácil de los asientos del avión por fila y columna, marcando cuáles están tomados.

Agrupación por Compra:
Los pases de abordar se agrupan por compra utilizando la función groupByPurchase. Esto permite tratar a los pasajeros que compraron juntos como un grupo y tratar de asignarles asientos contiguos.

Asignación de Asientos por Grupos:
Se itera sobre cada grupo de pases de abordar (es decir, cada compra) y se intenta encontrar asientos contiguos para ese grupo utilizando la función findContiguousSeats. Si no se encuentran suficientes asientos contiguos, se puede asignar asientos individuales a los miembros del grupo.

Filtrado y Asignación por Tipo de Asiento:
como se describe en el problema, los asientos deben ser de un tipo particular (primera clase, clase economica premium y clase  económica), se filtran los asientos por tipo usando filterSeatsByType y luego se asignan los asientos contiguos.

Asignación de Asientos Individuales:
Si no se pueden encontrar asientos contiguos para un grupo, se divide al grupo y se asignan asientos individuales utilizando la función assignSeat.

Creación de Respuesta JSON:
Una vez que todos los asientos han sido asignados, se crea una respuesta JSON con todos los detalles relevantes del vuelo y los pasajeros utilizando la función createResponseJson.


Tegnologías usadas: 

Para este proyecto se ocupó el lenguaje de programación JavaScript ya que permite una programación uniforme en el lado del cliente y del servidor, facilitando la coherencia y eficiencia en el desarrollo. Junto con Node.js y Express, se eligieron estas tecnologías ya que Node.js ofrece un rendimiento eficiente y manejo asíncrono y no bloqueante de las operaciones de entrada/salida, lo que es adecuado para aplicaciones en tiempo real y servicios altamente concurrentes. Finalmente como ORM se eligio sequelize principalmente por poseer una buena documentación y adaptación a trabajar con JS. 


Respuesta de la API y su información:

La estructura de la respuesta es un objeto JSON que contiene información detallada sobre un vuelo y las asignaciones de asientos para ese vuelo. A continuación se  describe un desglose de los elementos clave de la respuesta y sus tipos de datos:

    code: (Número) Un código de estado que representa el éxito de la operación. En este caso, es 200.

    data: (Objeto) Contiene todos los detalles relevantes del vuelo y las asignaciones de asientos.
        flightId: (Número) El ID del vuelo.
        takeoffDateTime: (Fecha y Hora) La fecha y hora de despegue del vuelo.
        takeoffAirport: (Cadena) El aeropuerto de despegue.
        landingDateTime: (Fecha y Hora) La fecha y hora de aterrizaje del vuelo.
        landingAirport: (Cadena) El aeropuerto de aterrizaje.
        airplaneId: (Número) El ID del avión.
        passengers: (Array de Objetos) Lista de pasajeros y sus detalles.
            passengerId: (Número) ID del pasajero.
            dni: (Número) Número de identificación del pasajero.
            name: (Cadena) Nombre del pasajero.
            age: (Número) Edad del pasajero.
            country: (Cadena) País del pasajero.
            boardingPassId: (Número) ID del pase de abordar.
            purchaseId: (Número) ID de la compra.
            seatTypeId: (Número) ID del tipo de asiento.
            seatId: (Número) ID del asiento asignado.

Esta respuesta JSON pude ser visualizada por el endpoint https://api-postulacion-bsale.onrender.com/flights/2/passengers. Mostrando detalles del vuelo y las asignaciones de asientos a los usuarios, 