import express from 'express';
import { setQuizRoutes } from './routes/quizRoutes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

setQuizRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});