# Etap 1: Budowanie aplikacji (Vite)
FROM node:20-alpine AS builder
WORKDIR /app

# Kopiowanie plików zależności i instalacja
COPY package*.json ./
RUN npm install

# Kopiowanie reszty kodu i budowanie
COPY . .
RUN npm run build

# Etap 2: Środowisko produkcyjne (Express)
FROM node:20-alpine
WORKDIR /app

# Kopiowanie plików zależności i instalacja TYLKO pakietów produkcyjnych (w tym express)
COPY package*.json ./
RUN npm install --omit=dev

# Skopiowanie zbudowanej aplikacji z poprzedniego etapu
COPY --from=builder /app/dist ./dist
# Skopiowanie skryptu serwera
COPY server.js ./

# Opcjonalne wstrzyknięcie zmiennych środowiskowych z zewnątrz
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]