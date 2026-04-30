export const detailedQuestions = [
  {
    id: "q5",
    text: "What happens when a Promise is rejected but lacks a catch block?",
    totalAnswers: 412,
    options: [
      { id: "o1", text: "It fails silently without any errors", percent: 15, isCorrect: false },
      { id: "o2", text: "Uncaught (in promise) Error is thrown in the console", percent: 32, isCorrect: true },
      { id: "o3", text: "The promise is resolved as undefined automatically", percent: 40, isCorrect: false },
      { id: "o4", text: "The browser tab crashes instantly", percent: 13, isCorrect: false },
    ],
  },
  {
    id: "q2",
    text: "Explain the difference between microtasks and macrotasks in the Event Loop.",
    totalAnswers: 410,
    options: [
      { id: "o1", text: "Microtasks execute after macrotasks", percent: 25, isCorrect: false },
      { id: "o2", text: "Microtasks have higher priority and execute before the next macrotask", percent: 45, isCorrect: true },
      { id: "o3", text: "They are the exact same thing in ES6", percent: 20, isCorrect: false },
      { id: "o4", text: "Macrotasks are used only for Promises", percent: 10, isCorrect: false },
    ],
  },
  {
    id: "q8",
    text: "Which of the following are valid ways to declare a variable in modern ES6 JavaScript?",
    totalAnswers: 405,
    options: [
      { id: "o1", text: "let and const", percent: 85, isCorrect: true },
      { id: "o2", text: "var only", percent: 5, isCorrect: false },
      { id: "o3", text: "def and let", percent: 8, isCorrect: false },
      { id: "o4", text: "variable", percent: 2, isCorrect: false },
    ],
  },
];
