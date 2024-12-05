const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleWares/authMiddleware');

// Пример защищенного маршрута (требуется аутентификация)
router.get('/profile', authMiddleware.authenticateToken)

// Пример маршрута с авторизацией по роли (например, только для администраторов)
router.get('/admin', authMiddleware.authenticateToken, authMiddleware.authorizeRole('teacher'), (req, res) => {
    res.json({ message: 'Welcome Teacher!' });
});

module.exports = router