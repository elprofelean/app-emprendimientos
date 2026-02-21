#!/bin/bash

# Script para crear archivo listo para GitHub
# Ejecutar desde la raíz del proyecto

echo "📦 Preparando proyecto para GitHub..."

# Crear directorio temporal
rm -rf /tmp/emprendimientos-github
mkdir -p /tmp/emprendimientos-github

# Copiar archivos necesarios (excluyendo node_modules, .next, etc.)
rsync -av --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'dev.log' \
  --exclude 'server.log' \
  --exclude '.git' \
  --exclude 'upload' \
  --exclude 'download' \
  --exclude '.zscripts' \
  --exclude 'examples' \
  --exclude 'mini-services' \
  --exclude 'skills' \
  --exclude '.claude' \
  --exclude '.z-ai-config' \
  /home/z/my-project/ /tmp/emprendimientos-github/

# Crear archivo zip
cd /tmp
zip -r emprendimientos-github.zip emprendimientos-github

# Mover al directorio de descargas
mv /tmp/emprendimientos-github.zip /home/z/my-project/download/

echo "✅ Archivo creado: download/emprendimientos-github.zip"
echo "📁 Ubicación: /home/z/my-project/download/emprendimientos-github.zip"
