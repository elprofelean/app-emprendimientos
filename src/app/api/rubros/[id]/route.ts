import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// DELETE - Eliminar rubro (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar si hay emprendimientos con este rubro
    const emprendimientosCount = await db.emprendimiento.count({
      where: { rubroId: id }
    });

    if (emprendimientosCount > 0) {
      // Soft delete - marcar como inactivo
      await db.rubro.update({
        where: { id },
        data: { activo: false }
      });
      return NextResponse.json({ 
        success: true, 
        message: 'Rubro desactivado (tiene emprendimientos asociados)' 
      });
    }

    // Hard delete si no tiene emprendimientos
    await db.rubro.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar rubro:', error);
    return NextResponse.json({ error: 'Error al eliminar rubro' }, { status: 500 });
  }
}

// PUT - Actualizar rubro
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, icono, color, activo } = body;

    const rubro = await db.rubro.update({
      where: { id },
      data: {
        nombre,
        icono,
        color,
        activo
      }
    });

    return NextResponse.json(rubro);
  } catch (error) {
    console.error('Error al actualizar rubro:', error);
    return NextResponse.json({ error: 'Error al actualizar rubro' }, { status: 500 });
  }
}
