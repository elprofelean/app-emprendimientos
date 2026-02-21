import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// DELETE - Eliminar emprendimiento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.emprendimiento.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar emprendimiento:', error);
    return NextResponse.json({ error: 'Error al eliminar emprendimiento' }, { status: 500 });
  }
}

// PUT - Actualizar emprendimiento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const emprendimiento = await db.emprendimiento.update({
      where: { id },
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

    return NextResponse.json(emprendimiento);
  } catch (error) {
    console.error('Error al actualizar emprendimiento:', error);
    return NextResponse.json({ error: 'Error al actualizar emprendimiento' }, { status: 500 });
  }
}
