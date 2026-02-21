# 📋 Directorio de Emprendimientos

Una aplicación web para gestionar un directorio de emprendimientos con diferentes rubros, autenticación por roles y subida de imágenes.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Características

- 🌐 **Vista pública** - Todos pueden ver los emprendimientos
- 👤 **Rol Usuario** - Puede agregar nuevos emprendimientos
- 🔐 **Rol Administrador** - Control total (agregar, editar, eliminar, gestionar rubros)
- 📸 **Subida de imágenes** - Soporte para subir fotos de emprendimientos
- 🔍 **Búsqueda y filtros** - Buscar por nombre/ubicación y filtrar por rubro
- 📂 **Rubros dinámicos** - El administrador puede crear nuevos rubros
- 📱 **Diseño responsive** - Funciona en móviles y desktop

## 🚀 Inicio Rápido

### Prerrequisitos

- [Node.js 18+](https://nodejs.org/) o [Bun](https://bun.sh/)
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/emprendimientos.git
cd emprendimientos

# Instalar dependencias
bun install
# o con npm
npm install

# Copiar archivo de entorno
cp .env.example .env

# Crear la base de datos y cargar datos iniciales
bun run db:push
bun run prisma/seed.ts

# Iniciar en desarrollo
bun run dev
# o con npm
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 🔑 Claves de Acceso

| Rol | Clave | Permisos |
|-----|-------|----------|
| Usuario | `Emprendimiento` | Solo agregar emprendimientos |
| Administrador | `AlvarezGroup26` | Control total |

## 📁 Estructura del Proyecto

```
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos iniciales (rubros)
├── src/
│   ├── app/
│   │   ├── api/         # API Routes
│   │   │   ├── auth/    # Autenticación
│   │   │   ├── emprendimientos/
│   │   │   └── rubros/
│   │   └── page.tsx     # Página principal
│   ├── components/ui/   # Componentes shadcn/ui
│   ├── lib/
│   │   └── db.ts        # Cliente Prisma
│   └── store/
│       └── auth-store.ts # Estado de autenticación
├── db/                   # Base de datos SQLite
├── public/              # Archivos estáticos
└── package.json
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
bun run dev

# Verificar código
bun run lint

# Construir para producción
bun run build

# Iniciar en producción
bun run start

# Base de datos
bun run db:push      # Sincronizar esquema
bun run db:generate  # Generar cliente Prisma
```

## 🌍 Deploy en Producción

### Opción 1: VPS con PM2

```bash
# Instalar PM2
npm install -g pm2

# Construir
bun run build

# Iniciar
pm2 start bun --name "emprendimientos" -- run start

# Guardar y habilitar inicio automático
pm2 save
pm2 startup
```

### Opción 2: Docker

```bash
# Construir imagen
docker build -t emprendimientos .

# Ejecutar contenedor
docker run -p 3000:3000 -v ./db:/app/db emprendimientos
```

### Opción 3: Vercel / Netlify

Compatible con plataformas serverless. Solo conectar el repositorio y configurar las variables de entorno.

### Opción 4: Railway / Render

1. Conectar repositorio de GitHub
2. Configurar variable `DATABASE_URL`
3. Deploy automático

## ⚙️ Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Ruta a la base de datos SQLite | `file:./db/custom.db` |

## 📦 Tecnologías

- **Framework:** [Next.js 16](https://nextjs.org/) con App Router
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/)
- **Base de datos:** [Prisma](https://www.prisma.io/) + SQLite
- **Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Iconos:** [Lucide](https://lucide.dev/)

## 📝 Backup de Base de Datos

```bash
# Crear backup
cp db/custom.db backups/custom-$(date +%Y%m%d).db

# Restaurar backup
cp backups/custom-20240115.db db/custom.db
```

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ usando Next.js y Prisma
