const express = require('express');
const argon2 = require('argon2');

const createTables = require('./db/setup');
const pool = require('./db/index'); 

const lessonRouter = require('./Routes/lessonRouter')
const studentRouter = require('./Routes/userRouter')
const progressRouter = require('./Routes/progressRouter')
const courseRouter = require('./Routes/courseRouter')
const middleWare = require('./Routes/middleware')

const app = express();

app.use(express.json());
app.use('/', courseRouter, lessonRouter, progressRouter, studentRouter, middleWare)


const PORT = process.env.PORT || 5001;

async function InitializeApp() {
    try {
        await createTables(pool);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch (error){
        console.error('Error initializing app:', error.message);
    }
}

InitializeApp();