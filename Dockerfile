# Stage 1: Base image
FROM node:20-alpine as base
WORKDIR /app

# Stage 2: Install dependencies
FROM base as dependencies
COPY package*.json ./
RUN npm install && npm cache clean --force

# Stage 3: Build application
FROM dependencies as build
COPY . .
RUN npm run build

# Stage 4: Final image
FROM node:20-alpine as final
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Port
EXPOSE 4000

CMD ["node", "dist/src/main"]