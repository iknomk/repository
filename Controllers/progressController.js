const pool = require('../db')

class ProgressController {
    async updateProgress(req, res) {
      const { courseId } = req.params;
      const { lessonId, studentId, status } = req.body;

      try {
        // Проверяем, существует ли запись прогресса для данного урока и студента
        const existingProgress = await pool.query(
          'SELECT * FROM progress WHERE lesson_id = $1 AND student_id = $2',
          [lessonId, studentId]
        );

        if (existingProgress.rows.length > 0) {
          // Обновляем статус, если запись существует
          await pool.query(
            'UPDATE progress SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE lesson_id = $2 AND student_id = $3',
            [status, lessonId, studentId]
          );
        } else {
          // Вставляем новую запись, если прогресс не был добавлен ранее
          await pool.query(
            'INSERT INTO progress (lesson_id, student_id, status) VALUES ($1, $2, $3)',
            [lessonId, studentId, status]
          );
        }

        res.json({ message: 'Progress updated successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }


    // Маршрут для получения статуса всех уроков в курсе для конкретного студента
    async getProgress(req, res)  {
      const { courseId } = req.params;
      const studentId = req.headers['student_id']; // Получаем student_id студента из заголовка запроса

      try {
        // Получаем уроки курса и их статус для студента
        //Функция COALESCE проверяет, имеет ли поле status из таблицы progress значение. Если status пустое или NULL, вместо него подставляется значение 'not_started'
        //LEFT JOIN присоединяет таблицу progress к таблице lessons по определенным условиям. 
        //ON lessons.id = progress.lesson_id: связывает таблицы lessons и progress по полю lesson_id в progress, которое соответствует id урока из lessons.
        //AND progress.student_id = $1: добавляет условие, чтобы учитывать только записи из progress, относящиеся к студенту с идентификатором studentId (заменяемым на $1).
        const result = await pool.query(
          `SELECT lessons.lesson_id AS lesson_id, lessons.title, 
                  COALESCE(progress.status, 'not_started') AS status
          FROM lessons
          LEFT JOIN progress ON lessons.lesson_id = progress.lesson_id AND progress.student_id = $1
          WHERE lessons.course_id = $2`,
          [studentId, courseId]
        );

        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
}

module.exports = new ProgressController();