import mongoose from "mongoose";

//Defino la URL de conexión a la base de datos
const MONGODB_URI = process.env.MONGODB_URI

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    //Si ya estamos conectados a la base de datos, no hacemos nada
    if (connectionState === 1) {
        console.log("Ya conectado a la base de datos");
        return;
    }

    //Si estamos en proceso de conexión, no hacemos nada
    if (connectionState === 2) {
        console.log('Conectando...');
        return;
    }

    //Si no estamos conectados, nos conectamos a la base de datos
    try {
        await mongoose.connect(MONGODB_URI!, {
            dbName: 'next14restapi',
            bufferCommands: true
        });
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.error("Error al conectar a la base de datos", error);
    }

}

//Exporto la función de conexión a la base de datos
export default connect;