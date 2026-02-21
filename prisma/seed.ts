import { db } from '../src/lib/db';

async function main() {
  console.log('🌱 Iniciando seed de rubros...');

  const rubros = [
    {
      nombre: 'Salud y Belleza',
      icono: 'Heart',
      color: 'bg-pink-100 text-pink-700 border-pink-200',
    },
    {
      nombre: 'Gastronomía',
      icono: 'Utensils',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    {
      nombre: 'Indumentaria',
      icono: 'Shirt',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    {
      nombre: 'Tecnología',
      icono: 'Laptop',
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    },
  ];

  for (const rubro of rubros) {
    await db.rubro.create({
      data: rubro,
    });
    console.log(`✅ Rubro creado: ${rubro.nombre}`);
  }

  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
