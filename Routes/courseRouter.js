const Router = require('express')
const router = new Router()
const courseController = require('../Controllers/courseController')


// Middleware для проверки роли преподавателя
const requireTeacherRole = (req, res, next) => {
    const role = req.headers['role'];
    if (role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Teacher role required' });
    }
    next();
  };

router.get('/course', courseController.getAllCourses)
router.post('/course', requireTeacherRole, courseController.createCourse)
router.get('/course/:id', courseController.getCourseById)
router.delete('/course/:id', requireTeacherRole, courseController.deleteCourse)

module.exports = router