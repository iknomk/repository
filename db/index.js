const {Pool} = require('pg'); // строка подключает модуль pg (пакет для работы с PostgreSQL) и из него импортирует класс Pool.
require('dotenv').config(); //подкючаем переменные окружения

//создаем клиент PostgreSQL с настройками из .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports=pool;