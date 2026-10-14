# 📋 Инструкция по скачиванию кода

## Способ 1: Скопируйте все файлы вручную

Создайте папку проекта и скопируйте в неё все файлы из папки `src/`.

### Структура проекта:
```
discipline-flow/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types.ts
│   ├── utils.ts
│   ├── achievements.ts
│   ├── sounds.ts
│   └── components/
│       ├── HabitTracker.tsx
│       ├── DailyGoals.tsx
│       ├── FocusTimer.tsx
│       ├── Stats.tsx
│       └── Achievements.tsx
```

### Шаг 1: Создайте package.json
```json
{
  "name": "discipline-flow",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.1.7",
    "@tailwindcss/vite": "^4.1.7",
    "typescript": "^5.7.0",
    "vite": "^6.3.5"
  }
}
```

### Шаг 2: Создайте vite.config.js
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Шаг 3: Скопируйте все файлы из папки src/

Откройте каждый файл в этом sandbox и скопируйте его содержимое в соответствующий файл в вашем проекте.

### Шаг 4: Установите зависимости и запустите
```bash
npm install
npm run dev
```

Откройте http://localhost:5173 в браузере.

---

## Способ 2: Используйте standalone HTML версию

Смотрите файл `standalone.html` в корне проекта — это полностью рабочая версия приложения в одном HTML файле. Просто сохраните его и откройте в браузере!

---

## Способ 3: GitHub + Vercel (автоматический деплой)

1. Создайте репозиторий на GitHub
2. Загрузите все файлы
3. Подключите репозиторий к Vercel.com
4. Получите бесплатную ссылку вида `your-app.vercel.app`
