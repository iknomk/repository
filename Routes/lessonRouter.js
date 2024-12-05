const Router = require('express')
const router = new Router()
const lessonController = require('../Controllers/lessonController')

// Middleware для проверки роли преподавателя
const requireTeacherRole = (req, res, next) => {
    const role = req.headers['role'];
    if (role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Teacher role required' });
    }
    next();
};

router.post('/course/:courseId/lesson', requireTeacherRole, lessonController.addLesson);
router.get('/course/:courseId/lesson', lessonController.getLessons);
router.delete('/course/:courseId/lesson/:lessonId', requireTeacherRole, lessonController.deleteLesson);

module.exports = router