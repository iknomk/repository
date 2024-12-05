const pool = require('../db')
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware для проверки токена (аутентификация)
const authenticateToken = async (req, res, next) => {
    // Извлекаем токен из заголовка Authorization
    const token = req.header('Authorization')?.split(' ')[1]; // Например, "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Проверяем токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const userId = decoded.id;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Возвращаем данные пользователя
        res.json({ message: 'Welcome, user profile', user: result.rows[0] })
        next(); 
    } catch (err) {
        res.status(400).json({ message: "Invalid token"});
    }
    
};

// Middleware для проверки роли пользователя (авторизация)
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            return next(); // Если роль пользователя совпадает, продолжаем
        }
        return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
    };
};

module.exports = { authenticateToken, authorizeRole };
