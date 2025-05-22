import connect from "@/lib/db";
import User from "@/lib/models/users";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const GET = async (request: Request) => {
    try {
        // Obtener el id del usuario a actualizar
        const { searchParams } = new URL(request.url);
        const id:any = searchParams.get("id");
        // Conectar a la base de datos
        await connect();
        // Verificar si el id es un ObjectId valido
        if (!ObjectId.isValid(id) || !id) {
            return new NextResponse("El id no es valido o es null", { status: 400 });
        }
        // Verificar si el usuario existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return new NextResponse("El usuario no existe", { status: 404 });
        }
        // Obtener todas las categorias del usuario
        const categories = await Category.find({ user: id, bloqueado: false });
        return new NextResponse(JSON.stringify(categories), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error al obtener las categorias: " + error.message, { status: 500 });

    }
}

export const POST = async (request: Request) => {
    try {
        // Obtener el id del usuario a actualizar
        const { id, title } = await request.json();
        // Conectar a la base de datos
        await connect();
        // Verificar si el id es un ObjectId valido
        if (!ObjectId.isValid(id) || !id) {
            return new NextResponse("El id no es valido o es null", { status: 400 });
        }
        // Verificar si el titulo es null
        if (!title) {
            return new NextResponse("El titulo es null", { status: 400 });
        }
        // Verificar si el usuario existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return new NextResponse("El usuario no existe", { status: 404 });
        }
        // Crear una nueva categoria
        const category = new Category({ user: id, title });
        await category.save();
        return new NextResponse(JSON.stringify(
            { message: "Categoria creada correctamente", category }
        ), { status: 201 });

    } catch (error: any) {
        return new NextResponse("Error al crear la categoria: " + error.message, { status: 500 });

    }
}