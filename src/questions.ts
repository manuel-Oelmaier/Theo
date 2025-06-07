import Papa from 'papaparse'

let questions = processCSV();
console.log(questions);
let currentQuestion : MultipleChoiceQuestion;

//TODO: look at web components and figure out if i want to make question & answer one ?
class MultipleChoiceQuestion {
    id:number;
    QuestionHtml :string;
    answers :Answer[] = [];
    exam;

    constructor(id :number, Question:string, exam :string, answers:string[],) {
        this.id = id;
        this.QuestionHtml = Question;
        this.exam = exam;
        for (let i = 0; i < 9; i += 3) {
            this.answers.push(new Answer(answers[i], answers[i + 1], answers[i + 2]));
        }
    }

    getQuestionHTML() {
        return this.QuestionHtml;
    }

    getAnswers() {
        return this.answers;
    }

    display() {
        document.getElementById('question')!.innerHTML = this.getQuestionHTML();
        document.getElementById('labelAnswer1')!.innerHTML = this.getAnswers()[0].getAnswerHtml();
        document.getElementById('labelAnswer2')!.innerHTML = this.getAnswers()[1].getAnswerHtml();
        document.getElementById('labelAnswer3')!.innerHTML = this.getAnswers()[2].getAnswerHtml();
    }

    checkAnswers() {
        let answer1 = document.getElementById('answer1') as HTMLInputElement;
        let answer2 = document.getElementById('answer2') as HTMLInputElement;
        let answer3 = document.getElementById('answer3') as HTMLInputElement;
        console.log("checked:" + answer1.checked);
        let correctAnswer = answer1.checked === this.answers[0].getRight()
            && answer2.checked === this.answers[1].getRight()
            && answer3.checked === this.answers[2].getRight()
        if (correctAnswer) {
            alert("richtig");
        } else {
            alert("falsch");
        }
        //TODO find why this removes events from button ?
    }
}

class Answer {
    AnswerHtml;
    right : boolean;
    explanation : string;

    constructor(AnswerHtml :string, right :string, explanation:string) {
        this.AnswerHtml = AnswerHtml;
        this.right = (right === "true");
        this.explanation = explanation;
    }

    getAnswerHtml() {
        return this.AnswerHtml;
    }

    getRight() {
        return this.right;
    }

    displayExplanation() {

    }

    check() {
        return this.right;
    }
}


async function loadCSV() {
    const url = "Quiz_Regulare_und_Kontextfreiesprachen.csv";
    return await fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`CSVError: Unable to load CSV response from CSV`)
            }
            return res.text();
        })
}

/**
 * possibly rewrite,very hideous
 */
async function processCSV() {
    const url = 'public/csv/Quiz_Komplexität.csv';
    return new Promise(resolve => {
        Papa.parse(url, {
            download: true,       // fetches the remote file
            header: true,         // if your CSV has headers
            skipEmptyLines: true, // skip empty lines
            complete: (results) => {
                console.log(results);
                return results;
            },
            error: (err) => {
                console.error('Parsing error:', err);
            }
        });
    })
}

/**
 * random oder der Reihe nach durch?#
 */
async function chooseNewQuestion() {
    let questionList = await questions;
    // @ts-ignore
    return questionList[Math.floor(Math.random() * questionList.length)];
}

export async function getNewQuestion() {
    let x = await chooseNewQuestion();
    currentQuestion = x;
    x.display();
    //  await Mathjax.typesetPromise();

}

function checkQuestion() {
    currentQuestion.checkAnswers();
}

document.getElementById('nextQuestionButton')!.addEventListener('click', getNewQuestion);
document.getElementById('checkAnswersButton')!.addEventListener('click', checkQuestion);
// TODO previous questions button ??

