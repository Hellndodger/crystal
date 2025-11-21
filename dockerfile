FROM node:20-alpine

WORKDIR /app

# Копіюємо спочатку файли пакетів, щоб кешувати встановлення
COPY package.json package-lock.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь інший код
COPY . .

# Vite за замовчуванням працює на 5173 (не 8080)
EXPOSE 5173

# --host потрібен, щоб докер прокинув порт назовні
CMD ["npm", "run", "dev", "--", "--host"]