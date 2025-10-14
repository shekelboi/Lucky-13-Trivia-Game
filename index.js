import he from 'he';
import questions from './true_false_questions.json' with { type: 'json' };
import lucky13 from './lucky13.json' with { type: 'json' };
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

function check_if_in_range(range, number) {
    let chunks = range.split("-");
    if (chunks.length == 1) {
        return number == chunks[0];
    } else {
        return chunks[0] <= number && number <= chunks[1];
    }
}

for (const q of selectedQuestions) {
    let answer = null;
    do {
        console.log(he.decode(q.question));
        answer = await rl.question("Your answer (T/F): ");
        if (answer_is_valid(answer)) {
            q.answer = answer.toLowerCase() == "t";
            // console.log(q.answer, q.correct_answer);
            // console.log("Your answer is", (q.answer == q.correct_answer) ? "correct." : "incorrect.");
        }
    } while (!answer_is_valid(answer))
}


let indexOfRangeSelected;

do {
    console.log("Select one of the following ranges:");

    for (const [index, value] of Object.keys(lucky13).entries()) {
        console.log(index + 1 + ".", value);
    }

    indexOfRangeSelected = Number(await rl.question(""), 10);
} while (isNaN(indexOfRangeSelected) || indexOfRangeSelected < 1 || indexOfRangeSelected > Object.keys(lucky13).length);


const rangeSelected = Object.keys(lucky13)[indexOfRangeSelected - 1];
console.log(rangeSelected, "selected.")
const numberOfCorrectAnswers = selectedQuestions.reduce((acc, val) => val.answer === val.correct_answer ? acc + 1 : acc, 0)
console.log(`Your score is ${numberOfCorrectAnswers} out of ${numberOfQuestions}.`)

if (check_if_in_range(rangeSelected, numberOfCorrectAnswers)) {
    console.log(`You won $${lucky13[rangeSelected].toLocaleString()}.`);
} else {
    console.log("You lost.");
}

rl.close();
