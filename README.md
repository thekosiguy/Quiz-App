# Generative AI Quiz App

## Overview
The Generative AI Quiz Application is an interactive quiz platform that allows users to answer questions across various topics including Maths, History, Geology, Food, Vehicles, and Miscellaneous. The application utilizes generative AI to dynamically generate questions based on the selected topic.

## Features
- **Dynamic Question Generation**: Questions are generated based on user-selected topics.
- **Multiple Topics**: Users can choose from a variety of topics to answer questions.
- **User Interaction**: Users can submit their answers and receive feedback.

## Project Structure
```
genai-quiz-app
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers
│   │   └── quizController.ts # Handles quiz-related logic
│   ├── routes
│   │   └── quizRoutes.ts     # Defines the application routes
│   ├── services
│   │   └── questionGenerator.ts # Generates questions based on topics
├── package.json               # npm configuration file
├── tsconfig.json              # TypeScript configuration file
└── README.md                  # Project documentation
```git remote set-url origin https://github.com/your-username/new-repo-name.git
## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd genai-quiz-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the application:
   ```
   npm start
   ```
2. Access the application in your web browser at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
