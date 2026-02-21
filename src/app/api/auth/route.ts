import { NextRequest, NextResponse } from 'next/server';

const USER_KEY = 'Emprendimiento';
const ADMIN_KEY = 'AlvarezGroup26';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (key === ADMIN_KEY) {
      return NextResponse.json({ 
        success: true, 
        role: 'admin',
        message: 'Bienvenido Administrador' 
      });
    } else if (key === USER_KEY) {
      return NextResponse.json({ 
        success: true, 
        role: 'user',
        message: 'Bienvenido Usuario' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Clave incorrecta' 
      }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ 
      success: false, 
      message: 'Error en la solicitud' 
    }, { status: 400 });
  }
}
