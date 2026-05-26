# Mock Store Server

Простой mock-сервер для интернет-магазина с поддержкой CORS. Возвращает список товаров, детальную информацию по ID, категории и поиск.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install

2 Запуск сервера

node server.js

3. Проверка работы
Сервер запустится на http://localhost:3000

📡 API Эндпоинты
GET /api/cards - Список товаров
Параметры: category, minPrice, maxPrice, inStock, minRating, isNew, isPopular, search, sortBy (price_asc, price_desc, rating, popular, newest), page, limit

GET /api/cards/:id - Детальная информация о товаре
GET /api/categories - Список категорий
GET /api/search/suggest?q=текст - Поиск с автодополнением

# Все товары
curl http://localhost:3000/api/cards

# Только электроника с сортировкой по цене
curl "http://localhost:3000/api/cards?category=Электроника&sortBy=price_asc"

# Детальная карточка
curl http://localhost:3000/api/cards/15

# Поиск
curl "http://localhost:3000/api/search/suggest?q=смарт"