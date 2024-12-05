const pool = require('../db')


class LessonController {

    // Добавить новый урок в курс
    async addLesson(req, res) {
      const { courseId } = req.params;
      const { title, content } = req.body;
    
      try {
        const result = await pool.query(
          `INSERT INTO lessons (course_id, title, content) VALUES ($1, $2, $3) RETURNING *`,
          [courseId, title, content]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error adding lesson:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  }
  
  // Получить список всех уроков в курсе
  async getLessons(req, res) {
    const { courseId } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT * FROM lessons WHERE course_id = $1`,
        [courseId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error retrieving lessons:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
  // Удалить урок
  async deleteLesson(req, res) {
    const { courseId, lessonId } = req.params;
  
    try {
      const result = await pool.query(
        `DELETE FROM lessons WHERE course_id = $1 AND lesson_id = $2 RETURNING *`,
        [courseId, lessonId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}


module.exports =new LessonController();