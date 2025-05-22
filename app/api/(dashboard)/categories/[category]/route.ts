import connect from "@/lib/db";
import User from "@/lib/models/users";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const PATCH = async (request: Request, context: { params: any }) => {
    try {
        // Obtener el id de la categoria a actualizar
        const params: any = await context.params;      
        const id = params.category;
        const { title } = await request.json();
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
        // Verificar si la categoria existe
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return new NextResponse("La categoria no existe", { status: 404 });
        }
        // Actualizar la categoria
        const category = await Category.findByIdAndUpdate(id
            , { title }, { new: true });
        return new NextResponse(JSON.stringify(
            { message: "Categoria actualizada correctamente", category }
        ), { status: 200 });


    } catch (error: any) {
        return new NextResponse("Error al obtener las categorias: " + error.message, { status: 500 });

    }
}

export const DELETE = async (request: Request, context: { params: any }) => {
    try {
        // Obtener el id de la categoria a eliminar
        const params: any = await context.params;      
        const id = params.category;
        // Conectar a la base de datos
        await connect();
        // Verificar si el id es un ObjectId valido
        if (!ObjectId.isValid(id) || !id) {
            return new NextResponse("El id no es valido o es null", { status: 400 });
        }
        // Verificar si la categoria existe
        const existingCategory = await Category.find({_id: id, bloqueado: false });
        if (!existingCategory) {
            return new NextResponse("La categoria no existe", { status: 404 });
        }
        // Eliminar la categoria
        await Category.findByIdAndUpdate(id, { bloqueado: true }, { new: true });
        return new NextResponse("Categoria eliminada correctamente", { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error al eliminar la categoria: " + error.message, { status: 500 });

    }
}