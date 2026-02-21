import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Obtener todos los rubros activos
export async function GET() {
  try {
    const rubros = await db.rubro.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(rubros);
  } catch (error) {
    console.error('Error al obtener rubros:', error);
    return NextResponse.json({ error: 'Error al obtener rubros' }, { status: 500 });
  }
}

// POST - Crear nuevo rubro (solo admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, icono, color } = body;

    if (!nombre || !icono || !color) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const rubro = await db.rubro.create({
      data: { nombre, icono, color }
    });

    return NextResponse.json(rubro, { status: 201 });
  } catch (error) {
    console.error('Error al crear rubro:', error);
    return NextResponse.json({ error: 'Error al crear rubro' }, { status: 500 });
  }
}
