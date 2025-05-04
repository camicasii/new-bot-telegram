# Etapa de construcción
FROM node:22.15-alpine3.21 AS build
# 22-alpine3.20, 22.15-alpine3.20, 22.15.0-alpine3.20, jod-alpine3.20, lts-alpine3.20⁠
WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./
# Instalar dependencias
RUN apk add python
# RUN npm install -g npm
RUN npm install

# Instalar TypeScript y ts-node como dependencias de desarrollo
# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto TypeScript
RUN npm run build

# Etapa de producción
# FROM node:22-alpine AS production
FROM node:22.15-alpine3.21

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
# RUN npm install -g npm
RUN apk add python
RUN npm install --only=production
# Establecer la variable de entorno para producción
ENV NODE_ENV=production

# Exponer el puerto (si aplica)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]