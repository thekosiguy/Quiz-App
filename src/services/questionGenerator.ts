import OpenAI from "openai";
require('dotenv').config()
const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export class QuestionGenerator {
    private topics: string[];

    constructor() {
        this.topics = ['Maths', 'History', 'Geology', 'Food', 'Vehicles', 'Miscellaneous'];
    }

    public async generateQuestion(topic: string) {
        // Logic to generate a question based on the selected topic
        // This is a placeholder implementation
        let image_base64 = null;
        //let image_bytes = null;

        if (!this.topics.includes(topic)) {
            //throw new Error(`Topic "${topic}" is not available.`);
            console.log(`Topic "${topic}" is not in the list.`);
        }
            const response = await client.responses.create({
                model: "gpt-4.1",
                input: `Generate a question about ${topic} (omit the word question and answer). If the topic is inappropriate, generate a question about 'Miscellaneous' instead and inform the user that the chosen topic was inappropriate therefore Miscellaneous was selected.`
            });

            let question = response.output_text.trim();

            const image = await client.images.generate({
                model: "gpt-image-1",
                prompt: `Generate an image for the question "${question}" with a clear and relevant visual representation without repetition and never illustrates the answer or question (no exceptions!).`,
                quality: "medium"
            });

            if (image && image.data && Array.isArray(image.data) && image.data.length > 0 && image.data[0].b64_json) {
                image_base64 = image.data[0].b64_json;
                //image_bytes = Buffer.from(image_base64, 'base64');
            }

            // Return the output instead of just logging it
            return { 
                response: question,
                image_base64
            };
        }

    public async generateAnswer(question: string) {
        // Logic to generate a question based on the selected topic
        // This is a placeholder implementation
        let image_base64 = null;
        //let image_bytes = null;

        const response = await client.responses.create({
            model: "gpt-4.1",
            input: `Generate the answer for ${question} in the form "Answer : answer." and always provide a brief explanation on a new line without formatting for variables and equations.`
        });

        // Return the output instead of just logging it
        return { 
            response: response.output_text.trim(),
        };
    }

    public getAvailableTopics(): string[] {
        return this.topics;
    }
}