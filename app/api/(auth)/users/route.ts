import connect from "@/lib/db"
import bcrypt from "bcrypt";
import User from "@/lib/models/users";
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        // Conectar a la base de datos
        await connect();
        // Obtener todos los usuarios
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error al obtener los usuarios: " + error.message, { status: 500 });

    }
};

export const POST = async (request: Request) => {
    const { username, email, password } = await request.json();
    try {
        // Conectar a la base de datos
        await connect();
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new NextResponse("El usuario ya existe", { status: 400 });
        }
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Crear un nuevo usuario
        const user = new User({ username, email, password:hashedPassword });
        await user.save();
        return new NextResponse(JSON.stringify(
            { message: "Usuario creado correctamente", user }
        ), { status: 201 });

    } catch (error: any) {
        return new NextResponse("Error al crear el usuario: " + error.message, { status: 500 });

    }
};

export const PATCH = async (request: Request) => {
    const { id, username, email, password } = await request.json();
    try {
        // Conectar a la base de datos
        await connect();
        // Verificar si el usuario existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return new NextResponse("El usuario no existe", { status: 404 });
        } else {
            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            // Actualizar el usuario
            const user = await User.findByIdAndUpdate(id, { username, email, password:hashedPassword }, { new: true });
            return new NextResponse(JSON.stringify(
                { message: "Usuario actualizado correctamente", user }
            ), { status: 200 });
        }

    } catch (error: any) {
        return new NextResponse("Error al actualizar el usuario: " + error.message, { status: 500 });

    }
};

export const DELETE = async (request: Request) => {
    const { id } = await request.json();
    try {
        // Conectar a la base de datos
        await connect();
        // Verificar si el usuario existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return new NextResponse("El usuario no existe", { status: 404 });
        } else {
            // Eliminar el usuario
            await User.findByIdAndUpdate(id, { bloqueado: true }, { new: true });
            return new NextResponse("Usuario eliminado correctamente", { status: 200 });
        }

    } catch (error: any) {
        return new NextResponse("Error al eliminar el usuario: " + error.message, { status: 500 });

    }
};

