import he from 'he';
import questions from './true_false_questions.json' with { type: 'json' };
import lucky13 from './lucky13.json' with { type: 'json' };
import lodash from 'lodash';
import readline from 'readline/promises';
import { stdin, stdout } from 'process';

class Question {
    constructor(description, answer) {
        this.description = description;
        this.correctAnswer = answer;
        this.userAnswer = undefined;
    }

    get isUserAnswerCorrect() {
        return this.correctAnswer == this.userAnswer;
    }
}

class Game {
    constructor(numberOfQuestions, questions) {
        this.questions = lodash.sampleSize(questions, numberOfQuestions);
        this.currentQuestionIndex = 0;
    }

    get isGameOver() {
        return this.currentQuestionIndex == this.questions.length;
    }

    get numberOfCorrectAnswers() {
        return this.questions.reduce((acc, val) => val.isUserAnswerCorrect ? acc + 1 : acc, 0)
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length) {
            return { question: this.questions[this.currentQuestionIndex], index: this.currentQuestionIndex++ };
        }
        return { question: null, index: this.currentQuestionIndex };
    }

    answerQuestion(index, answer) {
        this.questions[index].userAnswer = answer;
    }
}

function isAnswerValid(answer) {
    return answer.toLowerCase() == "f" || answer.toLowerCase() == "t"
}

const parsedQuestions = []

for (let index = 0; index < questions.length; index++) {
    parsedQuestions.push(new Question(he.decode(questions[index].question), questions[index].correct_answer))
}


const rl = readline.createInterface({ input: stdin, output: stdout });
// const numberOfQuestions = 13;
// // console.log(selectedQuestions)

// function check_if_in_range(range, number) {
//     let chunks = range.split("-");
//     if (chunks.length == 1) {
//         return number == chunks[0];
//     } else {
//         return chunks[0] <= number && number <= chunks[1];
//     }
// }

const g = new Game(13, parsedQuestions);

while (!g.isGameOver) {
    const { question, index: questionIndex } = g.nextQuestion();
    let answer;
    do {
        console.log(question.description);
        answer = await rl.question("Your answer (T/F): ");
    } while (!isAnswerValid(answer))
    g.answerQuestion(questionIndex, answer.toLowerCase() == "t");
    // console.log(question.correctAnswer, q.userAnswer);
    console.log("Your answer is", question.isUserAnswerCorrect ? "correct." : "incorrect.");
}

// let indexOfRangeSelected;

// console.log("Select one of the following ranges:");

// for (const [index, value] of Object.keys(lucky13).entries()) {
//     console.log(index + 1 + ".", value, "-", "$" + lucky13[value].toLocaleString());
// }

// do {
//     indexOfRangeSelected = Number(await rl.question(""), 10);
// } while (isNaN(indexOfRangeSelected) || indexOfRangeSelected < 1 || indexOfRangeSelected > Object.keys(lucky13).length);


// const rangeSelected = Object.keys(lucky13)[indexOfRangeSelected - 1];
// console.log(rangeSelected, "selected.")

// let luckyNumber;

// do {
//     luckyNumber = Number(await rl.question("Select your lucky number: "))
// } while (isNaN(luckyNumber) || !check_if_in_range(rangeSelected, luckyNumber));

console.log(`Your score is ${g.numberOfCorrectAnswers} out of ${g.questions.length}.`)

// let bonusWon = numberOfCorrectAnswers == luckyNumber;
// let prize = lucky13[rangeSelected]
// if (bonusWon) {
//     prize += 25000;
// }

// if (check_if_in_range(rangeSelected, numberOfCorrectAnswers)) {
//     console.log(`You won $${prize.toLocaleString()}.`);
// } else {
//     console.log("You lost.");
// }

rl.close();
