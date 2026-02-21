import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Obtener todos los emprendimientos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rubroId = searchParams.get('rubro');
    const search = searchParams.get('search');

    const where: {
      rubroId?: string;
      OR?: Array<{
        nombre?: { contains: string };
        ubicacion?: { contains: string };
      }>;
    } = {};

    if (rubroId && rubroId !== 'todos') {
      where.rubroId = rubroId;
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { ubicacion: { contains: search } }
      ];
    }

    const emprendimientos = await db.emprendimiento.findMany({
      where,
      include: {
        rubro: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(emprendimientos);
  } catch (error) {
    console.error('Error al obtener emprendimientos:', error);
    return NextResponse.json({ error: 'Error al obtener emprendimientos' }, { status: 500 });
  }
}

// POST - Crear nuevo emprendimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, urlRedSocial, imagen, ubicacion, rubroId } = body;

    if (!nombre || !ubicacion || !rubroId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Verificar que el rubro existe
    const rubro = await db.rubro.findUnique({
      where: { id: rubroId }
    });

    if (!rubro) {
      return NextResponse.json({ error: 'Rubro no válido' }, { status: 400 });
    }

    const emprendimiento = await db.emprendimiento.create({
      data: {
        nombre,
        urlRedSocial: urlRedSocial || null,
        imagen: imagen || null,
        ubicacion,
        rubroId
      },
      include: {
        rubro: true
      }
    });

    return NextResponse.json(emprendimiento, { status: 201 });
  } catch (error) {
    console.error('Error al crear emprendimiento:', error);
    return NextResponse.json({ error: 'Error al crear emprendimiento' }, { status: 500 });
  }
}
