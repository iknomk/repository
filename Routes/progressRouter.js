const Router = require('express')
const router = new Router()
const progressController = require('../Controllers/progressController')

//Обновить прогресс студента в курсе
router.post('/:courseId/progress', progressController.updateProgress)

//Получить прогресс студента в курсе
router.get('/courses/:courseId/progress', progressController.getProgress)

module.exports = router;