import he from 'he';
import questions from './true_false_questions.json' with { type: 'json' };
import lodash from 'lodash';
import readline from 'readline/promises';
import { stdin, stdout } from 'process';

const rl = readline.createInterface({ input: stdin, output: stdout });
const numberOfQuestions = 13;
const selectedQuestions = lodash.sampleSize(questions, numberOfQuestions);
// console.log(selectedQuestions)

function answer_is_valid(answer) {
    return answer.toLowerCase() == "f" || answer.toLowerCase() == "t"
}


for (const q of selectedQuestions) {
    let answer = null;
    while (answer == null || !answer_is_valid(answer)) {
        console.log(he.decode(q.question));
        answer = await rl.question("Your answer (T/F): ");
        if (answer_is_valid(answer)) {
            q.answer = answer.toLowerCase() == "t";
            // console.log(q.answer, q.correct_answer);
            console.log("Your answer is", (q.answer == q.correct_answer) ? "correct." : "incorrect.");
        }
    }
}

const numberOfCorrectAnswers = selectedQuestions.reduce((acc, val) => val.answer === val.correct_answer ? acc + 1 : acc, 0)
console.log(`Your score is ${numberOfCorrectAnswers} out of ${numberOfQuestions}.`)

rl.close();
