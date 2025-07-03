import { Router } from 'express';
import QuizController from '../controllers/quizController';
import { Express } from 'express-serve-static-core';
import { QuestionGenerator } from '../services/questionGenerator';
import { audioControls } from '../controllers/quizController';

const router = Router();
const quizController = new QuizController(new QuestionGenerator);

export function setQuizRoutes(app: Express) {
    app.use('/', router);

    router.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Quiz App</title>
                <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to the Ultimate Quiz!</h1>
                    <form action="/questions" method="get">
                        <label for="topic">Choose a topic.</label>
                        <select name="topic" id="topic">
                            ${new QuestionGenerator().getAvailableTopics().map(topic => `<option value="${topic}">${topic}</option>`).join('')}
                        </select>
                        <br><br>
                        <button type="submit">Question!</button>
                    </form>
                    <br/>
                    <label>Not a fan of the topics? input one below!</label>
                    <form action="/questions" method="get">
                        <input type="text" name="topic" placeholder="Topic">
                        <button type="submit">Question!</button>
                    </form>
                </div>
                ${audioControls()}
            </body>
        </html>`);
});
    router.get('/questions', quizController.getQuestions.bind(quizController));
    router.post('/submit', quizController.submitAnswer.bind(quizController));
}