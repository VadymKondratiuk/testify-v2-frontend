import { TestData } from "@/features/edit/edit.types";

export const mockTest: TestData = {
  id: "101",
  title: "Advanced JavaScript Concepts",
  description: "A comprehensive test covering closures, promises, and the event loop. Perfect for mid-level developers.",
  category: "Programming",
  passingScore: 80,
  timeLimit: 45,
  questions: [
    {
      id: "q1",
      type: "Single Choice",
      points: 1,
      text: "What is the primary purpose of a closure in JavaScript?",
      tags: ["closures", "functions"],
      options: [
        { id: "o1", text: "To create private variables and preserve state", isCorrect: true },
        { id: "o2", text: "To fetch data asynchronously from an API", isCorrect: false },
        { id: "o3", text: "To style DOM elements dynamically", isCorrect: false }
      ]
    },
    {
      id: "q2",
      type: "Multiple Choice",
      points: 2,
      text: "Which of the following are valid ways to declare a variable in modern ES6 JavaScript?",
      tags: ["es6", "variables"],
      options: [
        { id: "o4", text: "let", isCorrect: true },
        { id: "o5", text: "const", isCorrect: true },
        { id: "o6", text: "def", isCorrect: false },
        { id: "o7", text: "var", isCorrect: false }
      ]
    }
  ]
};