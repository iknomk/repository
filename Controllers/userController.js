const pool = require('../db')
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');


class UserController {
    async register(req, res) {
        const { name, email, password, role } = req.body;
        try {
            const hashedPassword = await argon2.hash(password);
            const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword , role]
            );
            res.status(201).json({ userId: result.rows[0].id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
    
        try {
            // Ищем пользователя по email
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
    
            if (user) {
                const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
                res.status(200).json({message: 'Login successful', token });
                // Проверяем введённый пароль с хэшем из базы данных
                const passwordMatch = await argon2.verify(user.password, password);
    
                if (passwordMatch) {
                    // Пароли совпадают, отправляем успешный ответ
                    return res.json({ message: 'Logged in successfully' });
                } else {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
            } else {
                // Пользователь с таким email не найден
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new UserController();