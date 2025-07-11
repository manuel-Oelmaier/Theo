import Papa from 'papaparse'
import katex from 'katex';

class Question {
    id: number;
    questionText: string;
    answers: Answer[];
    exam: string;

    constructor(id: number, Question: string, exam: string, answers: string[],) {
        this.id = id;
        this.questionText = Question;
        this.exam = exam;
        this.answers = [];
        for (let i = 0; i < 12; i += 3) {
            if (answers[i] === "") {
                break;
            }
            this.answers.push(new Answer(answers[i], answers[i + 1], answers[i + 2]));
        }
    }

    /**
     *
     * @param csv line
     */
    static from(csv: string[]): Question {
        return new Question(parseInt(csv[0]), csv[1], csv[2], csv.slice(3, 15));

    }

    getQuestionHTML() {
        return this.questionText;
    }

    getAnswers() {
        return this.answers;
    }

//TODO: fix katex rendering not allowing line breaks...
    display(): HTMLElement {
        const examLinks = new Map<string, string>([
            ["Summer_24 retake","https://teaching.model.in.tum.de/2024ss/theo/exams/2024_retake_solution.pdf"],
            ["Summer_24","https://teaching.model.in.tum.de/2024ss/theo/exams/2024_endterm_solution.pdf"],
            ["Summer_23 retake","https://teaching.model.in.tum.de/2024ss/theo/exams/2023_retake_solution.pdf"],
            ["Summer_23","https://teaching.model.in.tum.de/2024ss/theo/exams/2023_endterm_solution.pdf"],
            ["Summer_22 retake","https://teaching.model.in.tum.de/2024ss/theo/exams/2022_retake_solution.pdf"],
            ["Summer_22","https://teaching.model.in.tum.de/2024ss/theo/exams/2022_endterm_solution.pdf"],
        ]);

        const questionDiv = document.createElement("div");
        questionDiv.id = "replace"
        questionDiv.textContent += "Question ID: " + this.id;

        const Link = document.createElement("a");
        Link.href = examLinks.get(this.exam)!;
        Link.target = "_blank";
        Link.textContent = " Exam: " + this.exam;

        questionDiv.appendChild(Link);


        const question = document.createElement("h3");
        katex.render(this.questionText, question, {
            output: "html"
        });

        const form = document.createElement("form");

        for (let i = 0; i < this.answers.length; i++) {
            form.appendChild(this.answers[i].display(i));
        }

        const feedback = document.createElement("div");
        feedback.id = "feedback";

        questionDiv.appendChild(question);
        questionDiv.appendChild(form);
        questionDiv.appendChild(feedback);


        return questionDiv;

    }

    checkAnswers() {
        let correctAnswer = true;
        let message = ""

        for (let i = 0; i < this.answers.length; i++) {
            let answer = document.getElementById('answer' + i) as HTMLInputElement;
            if (answer.checked !== this.answers[i].getRight()) {
                correctAnswer = false;
                message += "Answer " + (i+1) + " was: " + answer.checked + " but expected: " + this.answers[i].getRight() + "\n";
            }
        }


        if (correctAnswer) {
            document.getElementById("feedback")!.textContent = "Correct!\n" + message
            document.getElementById("feedback")!.style.color = "green"
        } else {
            document.getElementById("feedback")!.textContent = "Wrong! \n" + message
            document.getElementById("feedback")!.style.color = "red"

        }
    }
}

class Answer {
    answerText;
    correct: boolean;
    explanation: string;

    constructor(answerText: string, right: string, explanation: string) {
        this.answerText = answerText;
        this.correct = (right === "true" || right === "True");
        this.explanation = explanation;
    }


    getAnswerText() {
        return this.answerText;
    }

    getRight() {
        return this.correct;
    }

    display(answerOption: number): HTMLElement {
        const div = document.createElement("div");
        const inputId = "answer" + answerOption;

        const label = document.createElement("label");

        label.htmlFor = inputId;

        katex.render(this.answerText, label, {
            output: "html",
            displayMode: true
        })

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = inputId;
        const explanation = document.createElement("div");

        katex.render(this.explanation, explanation, {
            output: "html",
            displayMode: true
        })

        explanation.classList.add("explanation");
        explanation.style.display = "none";

        div.appendChild(input);
        div.appendChild(label);
        div.appendChild(explanation);

        return div;

    }

}
class answeredQuestion {
    question: Question;
    givenAnswers: number[];
    correct:boolean;

    constructor(question: Question, givenAnswers: number[] = [],correct: boolean) {
        this.question = question;
        this.givenAnswers = givenAnswers;
        this.correct = correct;
    }
}


export const quiz_Komplex: Question[] = await createQuestions("csv/Quiz_Komplexität.csv");
export const quiz_Regular: Question[] = await createQuestions("csv/Quiz_Regular.csv");
let history: answeredQuestion[] = [];

export let config = {
    quiz: quiz_Komplex,
    history: history,
    order:[] as number[],
}

let order:number[]= createQuestionOrder();
let questionNumber: number = 0; // iterates from 0 to quiz.length
let currentID: number = order[questionNumber]; // id of the current question in the Question[]
config.order = order;



async function processCSV(url: string): Promise<object[]> {

    return new Promise(resolve => {
        Papa.parse(url, {
            download: true,
            skipEmptyLines: true,
            header: true,
            complete: (results: any) => {
                resolve(results.data);
            }
        });
    });
}

async function createQuestions(url: string): Promise<Question[]> {
    let questions: Question[] = [];
    let questionStrings: object[] = await processCSV(url);
    questionStrings.forEach(question => {
        questions.push(Question.from(Object.values(question)));
    });
    return questions;

}

export function createQuestionOrder(){
    let questionIDs  = Array.from({ length: config.quiz.length }, (_, i) => i);
    // shuffle using Fisher–Yates algorithm: no duplicates random shuffeling:
    for (let i = questionIDs.length - 1; i > 0; i--)
    {

        // Pick a random index from 0 to i inclusive
        let j = Math.floor(Math.random() * (i + 1));

        // Swap arr[i] with the element 
        // at random index 
        [questionIDs[i], questionIDs[j]] = [questionIDs[j], questionIDs[i]];
    }
    return questionIDs;
}

export function nextQuestion(){
// history.push(new answeredQuestion(config.quiz[currentID]),)
questionNumber++;
currentID = order[questionNumber];
if(currentID >= order.length){
    // TODO: result screen
}else {
    console.log(currentID);
    displayQuestion(currentID);
}


}
export function displayQuestion(questionID: number){
    let currentQuestion = config.quiz[questionID];
    document.getElementById("replace")?.replaceWith(currentQuestion.display());
}

function checkQuestion() {
    config.quiz[currentID].checkAnswers();
}

document.getElementById('nextQuestionButton')!.addEventListener('click', nextQuestion);
document.getElementById('checkAnswersButton')!.addEventListener('click', checkQuestion);

