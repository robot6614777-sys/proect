# 🎨 Как исправить проблему с иконками PWA

## Проблема
Netlify выдаёт ошибку: иконки `icon-192.png` и `icon-512.png` не найдены (404).

## Решение

### Шаг 1: Скачайте иконки

Откройте в браузере файл `public/generate-icons.html` (или перейдите по ссылке после деплоя):
```
https://remarkable-selkie-d8fe6c.netlify.app/generate-icons.html
```

На странице нажмите:
- **"Скачать icon-192.png"**
- **"Скачать icon-512.png"**

### Шаг 2: Поместите иконки в проект

Переместите скачанные файлы в папку `public/`:
```
public/
├── icon-192.png  ← поместите сюда
├── icon-512.png  ← поместите сюда
├── manifest.json
└── ...
```

### Шаг 3: Обновите manifest.json

Замените содержимое `public/manifest.json` на:

```json
{
  "name": "DisciplineFlow — Самодисциплина",
  "short_name": "DisciplineFlow",
  "description": "Приложение для формирования полезных привычек и повышения продуктивности",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8B5CF6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Шаг 4: Запушьте изменения

```bash
git add public/icon-192.png public/icon-512.png public/manifest.json
git commit -m "Add PWA icons"
git push
```

Netlify автоматически задеплоит новую версию, и ошибка исчезнет! ✅

---

## Альтернатива: Использовать онлайн-генератор

Если не хотите использовать `generate-icons.html`, можете создать иконки на:
- [favicon.io](https://favicon.io/)
- [realfavicongenerator.net](https://realfavicongenerator.net/)
- [appicongenerator.com](https://appicongenerator.com/)

Скачайте PNG файлы 192x192 и 512x512, поместите в `public/` и обновите `manifest.json`.

---

## Проверка

После деплоя проверьте:
1. Откройте DevTools (F12) → Application → Manifest
2. Убедитесь, что иконки загружаются без ошибок
3. Попробуйте установить приложение на телефон
