const pool = require('../db')

class CourseController {
    // Создать новый курс
    async createCourse(req, res) {
      const { name, description, teacherId } = req.body;
      try {
        const result = await pool.query(
          'INSERT INTO courses (name, description, teacher_id) VALUES ($1, $2, $3) RETURNING course_id',
          [name, description, teacherId]
        );
        res.status(201).json({ courseId: result.rows[0].id });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
    // Получить список всех курсов
    async getAllCourses(req, res) {
      try {
        const result = await pool.query('SELECT * FROM courses');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error retrieving courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  
    async getCourseById(req, res) {
      const { id } = req.params;
    
      try {
        const result = await pool.query('SELECT * FROM courses WHERE course_id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error retrieving course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  
  // Удалить курс
  async deleteCourse(req, res) {
    const { id } = req.params;
    
    try {
      const result = await pool.query('DELETE FROM courses WHERE course_id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new CourseController();
