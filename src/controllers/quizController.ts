import { QuestionGenerator } from "../services/questionGenerator";
import OpenAI from "openai";
require('dotenv').config()
const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export function audioControls() {
    return `
        <img class='speaker-icon' src='/images/speaker.png' alt='audio' height='50' width='50' style="position:fixed;bottom:24px;left:24px;z-index:1000;">
        <audio id='background-audio' src='/audio/background-audio.mp3' loop></audio>
        <script>
            function toggleAudio() {
                const audio = document.getElementById('background-audio');
                if (audio.paused) {
                    audio.play();
                    // Set localStorage flag on first play
                    localStorage.setItem('audioAllowed', 'true');
                } else {
                    audio.pause();
                    localStorage.setItem('audioAllowed', 'false');
                }
            }
            document.querySelector('.speaker-icon').addEventListener('click', toggleAudio);
            document.getElementById('background-audio').volume = 0.4;

        // Restore playback position and autoplay if previously allowed
            window.addEventListener('DOMContentLoaded', function() {
                const audio = document.getElementById('background-audio');
                const lastTime = localStorage.getItem('audioTime');
                if (lastTime) {
                    audio.currentTime = parseFloat(lastTime);
                }
                if (localStorage.getItem('audioAllowed') === 'true') {
                    audio.play().catch(()=>{});
            }
        });
        
        //Save playback position before leaving the page
        window.addEventListener('beforeunload', function() {
            const audio = document.getElementById('background-audio');
            localStorage.setItem('audioTime', audio.currentTime);
        });
        </script>`;  
}

class QuizController {
    constructor(private questionGenerator: QuestionGenerator) {}

    async getQuestions(req: { query: { topic: string; }; }, res: { status: (arg0: number) => { send: (arg0: any) => void; }; }) {
        const topic = req.query.topic;
        const response = await this.questionGenerator.generateQuestion(topic);
        // Prepare image tag if image_base64 is present
        let imageTag = '';

        if (response?.image_base64) {
            imageTag = `<img src="data:image/png;base64,${response.image_base64}" alt="${topic}" class="question-image" height="200" width="350">`;
        }

        res.status(200).send(`
            <html>
                <head>
                    <title>Quiz Question</title>
                    <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                    <div class="container">
                        <h2 id='topic'>${topic}</h2>
                        <h4>${response?.response}</h4>
                        ${imageTag}
                        <form action="/submit" method="post">
                            <input type="hidden" name="question" value="${response?.response}"> 
                            <input type="text" name="answer" id="answer" required>
                            <button type="submit">Submit</button>
                        </form>
                        <a href="/"><button>Home</button></a>
                    </div>
                    ${audioControls()}
                </body>
            </html>`);
    }

    async submitAnswer(req: { body: {question: string, answer: string; }; }, res: { status: (arg0: number) => { send: (arg0: any) => void; }; }) {
        const question = req.body.question;
        const answer = req.body.answer;

        if (!answer) {
            return res.status(400).send(alert('Answer is required.'));
        } else {
           const generatedAnswer = await this.questionGenerator.generateAnswer(question);

           const output = await client.responses.create({
                model: "gpt-4.1",
                input: `For ${question}, determine if ${answer} is correct or not. If ${answer} is correct, return only "Correct" (no exceptions). If ${answer} is incorrect, return only "Incorrect" (no exceptions).`
            });

           if (output.output_text.trim().toString() == "Correct") {
                res.status(200).send(`
                    <head>
                        <title>Quiz App</title>
                        <link rel="stylesheet" href="/styles.css">
                    </head>
                    <body>
                        <div class="container">
                            <h2>Correct :)</h2>\n<h3>${generatedAnswer?.response}</h3>
                            <button onclick="window.location.href='/'">Next question!</button>
                            <audio id="feedback-audio" src="../audio/correct.mp3" autoplay></audio>
                        </div>
                        ${audioControls()}
                    </body>`)
            } else {
                res.status(200).send(`
                    <head>
                        <title>Quiz App</title>
                        <link rel="stylesheet" href="/styles.css">
                    </head>
                    <body>
                        <div class="container">
                            <h2>Incorrect :(</h2>\n<h3>${generatedAnswer?.response}</h3>
                            <button onclick="window.location.href='/'">Next question!</button>
                            <audio id="feedback-audio" src="../audio/incorrect.mp3" autoplay></audio>
                        </div>
                        ${audioControls()}
                    </body>`)
            }
        }
    }
}

export default QuizController;