# Etapa de construcción
FROM node:23-bookworm-slim AS build
WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./
# Instalar dependencias
# RUN apk add --no-cache python3 py3-pip
# RUN npm install -g npm
RUN npm install

# Instalar TypeScript y ts-node como dependencias de desarrollo
# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto TypeScript
RUN npm run build

# Copiar manualmente los archivos de assets al directorio dist
RUN mkdir -p dist/assets
RUN cp -r src/assets/* dist/assets/ || true

# Etapa de producción
FROM node:23-bookworm-slim

WORKDIR /app
# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
# Asegurarse de que la carpeta assets existe y contiene los archivos de fuentes
COPY --from=build /app/src/assets ./dist/assets
# RUN npm install -g npm
# RUN apk add --no-cache python3 py3-pip
RUN npm install --only=production
# Establecer la variable de entorno para producción
ENV NODE_ENV=production

# Exponer el puerto (si aplica)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]