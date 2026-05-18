import { TestData } from "../types/test.types";

export const mockTest: TestData = {
  id: "101",
  title: "Advanced JavaScript Concepts",
  description: "A comprehensive test covering closures, promises, and the event loop. Perfect for mid-level developers.",
  category: "Programming",
  categoryId: "",
  passingScore: 50,
  timeLimit: 30,
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
        { id: "o7", text: "var", isCorrect: true } 
      ]
    },
    {
      id: "q3",
      type: "Single Choice",
      points: 2,
      text: "In the JavaScript Event Loop, which queue has a higher priority for execution after the Call Stack is empty?",
      tags: ["event-loop", "async"],
      options: [
        { id: "o8", text: "Macrotask Queue (setTimeout, setInterval)", isCorrect: false },
        { id: "o9", text: "Microtask Queue (Promises, MutationObserver)", isCorrect: true },
        { id: "o10", text: "Render Queue", isCorrect: false }
      ]
    },
    {
      id: "q4",
      type: "Single Choice",
      points: 1,
      text: "How is the 'this' keyword bound in an arrow function?",
      tags: ["functions", "context"],
      options: [
        { id: "o11", text: "It is bound to the object that calls the function", isCorrect: false },
        { id: "o12", text: "It is lexically bound to the surrounding scope", isCorrect: true },
        { id: "o13", text: "It is always bound to the global window object", isCorrect: false },
        { id: "o14", text: "It is bound dynamically at runtime", isCorrect: false }
      ]
    },
    {
      id: "q5",
      type: "Multiple Choice",
      points: 3,
      text: "Which of the following Promise methods execute multiple promises in parallel and wait for all of them to settle (either resolve or reject)?",
      tags: ["promises", "async"],
      options: [
        { id: "o15", text: "Promise.all()", isCorrect: false }, // Впаде, якщо хоч один reject
        { id: "o16", text: "Promise.allSettled()", isCorrect: true },
        { id: "o17", text: "Promise.race()", isCorrect: false },
        { id: "o18", text: "Promise.any()", isCorrect: false }
      ]
    },
    {
      id: "q6",
      type: "Multiple Choice",
      points: 2,
      text: "Which of these Array methods MUTATE (change) the original array?",
      tags: ["arrays", "mutations"],
      options: [
        { id: "o19", text: "Array.prototype.map()", isCorrect: false },
        { id: "o20", text: "Array.prototype.push()", isCorrect: true },
        { id: "o21", text: "Array.prototype.splice()", isCorrect: true },
        { id: "o22", text: "Array.prototype.filter()", isCorrect: false }
      ]
    },
    {
      id: "q7",
      type: "Single Choice",
      points: 1,
      text: "What happens if you try to access a variable declared with 'let' or 'const' before its declaration?",
      tags: ["hoisting", "es6"],
      options: [
        { id: "o23", text: "It returns undefined", isCorrect: false },
        { id: "o24", text: "It throws a ReferenceError due to the Temporal Dead Zone (TDZ)", isCorrect: true },
        { id: "o25", text: "It throws a TypeError", isCorrect: false },
        { id: "o26", text: "It successfully evaluates to null", isCorrect: false }
      ]
    }
  ]
};
