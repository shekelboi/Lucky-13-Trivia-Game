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

class Result {
    constructor(game) {
        this.game = game;
        this.selected = undefined;
        this.luckyNumber = undefined;
        this.setOptions(game.questions.length);
    }

    setOptions(numberOfQuestions) {
        // if (numberOfQuestions == 13) {
        //     this.options = lucky13;
        // } else {
        //     this.options = {};
        // }
        this.options = lucky13;
    }

    checkIfInRange(range, number) {
        let chunks = range.split("-");
        if (chunks.length == 1) {
            return number == chunks[0];
        } else {
            return chunks[0] <= number && number <= chunks[1];
        }
    }

    selectRange(indexOfRangeSelected) {
        if (isNaN(indexOfRangeSelected) || indexOfRangeSelected < 1 || indexOfRangeSelected > Object.keys(lucky13).length) {
            return false;
        }
        this.selected = indexOfRangeSelected;
        return true;
    }

    selectLuckyNumber(luckyNumber) {
        if (isNaN(luckyNumber) || !this.checkIfInRange(Object.keys(this.options)[this.selected], luckyNumber)) {
            return false;
        }
        this.luckyNumber = luckyNumber;
        return true;
    }

    get isBonusWon() {
        return this.game.numberOfCorrectAnswers == this.luckyNumber;
    }

    get isRangeCorrect() {
        return this.checkIfInRange(Object.keys(this.options)[this.selected], this.game.numberOfCorrectAnswers);
    }

    get prize() {
        let prize = 0;
        if (this.isRangeCorrect) {
            prize += Object.values(this.options)[this.selected];
        }
        if (this.isBonusWon) {
            prize += 25000;
        }
        return prize;
    }
}

function isAnswerValid(answer) {
    return answer.toLowerCase() == "f" || answer.toLowerCase() == "t"
}

const parsedQuestions = []

for (let index = 0; index < questions.length; index++) {
    parsedQuestions.push(new Question(he.decode(questions[index].question), questions[index].correct_answer))
}



async function demoGame(numberOfQuestions) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    const g = new Game(numberOfQuestions, parsedQuestions);

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
    const r = new Result(g);
    console.log("Select one of the following ranges:");

    for (const [index, value] of Object.keys(r.options).entries()) {
        console.log(index + 1 + ".", value, "-", "$" + lucky13[value].toLocaleString());
    }

    let indexOfRangeSelected;
    do {
        indexOfRangeSelected = Number(await rl.question(""), 10);
    } while (!r.selectRange(indexOfRangeSelected - 1));


    console.log(r.selected + 1, "selected.")

    let luckyNumber;
    do {
        luckyNumber = Number(await rl.question("Select your lucky number: "))
    } while (!r.selectLuckyNumber(luckyNumber));

    console.log(`Your score is ${g.numberOfCorrectAnswers} out of ${g.questions.length}.`)

    if (r.prize > 0) {
        console.log(`You won $${r.prize.toLocaleString()}.`);
    } else {
        console.log("You lost.");
    }

    rl.close();
}

await demoGame(13);