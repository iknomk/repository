async function createTables(pool) {
    try {

        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher'))
            )
        `;

        const createCoursesTable = `
            CREATE TABLE IF NOT EXISTS courses (
                course_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                teacher_id INT NOT NULL,
                FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
        `;

        const createLessonsTable = `
            CREATE TABLE IF NOT EXISTS lessons (
                lesson_id SERIAL PRIMARY KEY,
                course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
            )
        `;

        const createProgressTable = `
            CREATE TABLE IF NOT EXISTS progress (
                progress_id SERIAL PRIMARY KEY,
                lesson_id INTEGER REFERENCES courses(lesson_id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
                status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
                FOREIGN KEY (lesson_id) REFERENCES courses(lesson_id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
                UNIQUE (lesson_id, student_id)
            )
        `;

        await pool.query(createUsersTable);
        console.log('Users table created.');
        
        await pool.query(createCoursesTable);
        console.log('Courses table created.');

        await pool.query(createLessonsTable);
        console.log('Lessons table created.');

        await pool.query(createProgressTable);
        console.log('Progress table created.');
        
    } catch(error) {
        console.error('Error creating tables:', error.message);
    }
}

module.exports = createTables;