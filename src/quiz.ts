import katex from 'katex';

import  quiz_regular from './csv/quiz_Regular.json';
import  quiz_Komplex from './csv/quiz_Komplexität.json';

export let quiz: Quiz;

export interface RawQuestion {
    ID: number;
    "Question text": string;
    Exam: string;
    AnswerOptions: string[];
    AnswerBools: boolean[];
    Explanations: string[];
}


class Question {
    id: number;
    questionText: string;
    answers: Answer[];
    exam: string;



    constructor(raw: RawQuestion) {
        this.id = raw.ID;
        this.questionText = raw["Question text"]; // handle key with space
        this.exam = raw.Exam;
        this.answers = [];
        for (let i = 0; i < raw.AnswerOptions.length; i++) {
            this.answers.push(new Answer(raw.AnswerOptions[i],raw.AnswerBools[i],raw.Explanations[i]));
        }

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

    constructor(answerText: string, right: boolean, explanation: string) {
        this.answerText = answerText;
        this.correct = right;
        this.explanation = explanation;
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
type QuizMode = 'regular' | 'Komplexität';
//TODO: probably better to confert the csv, to a json file , also removes papaParse
export class Quiz {
    questions : Question[];
    order: number[];
    history:answeredQuestion[];
    questionNumber : number;

     constructor(mode: QuizMode,) {
        if (mode === "regular") {
            this.questions =   quiz_regular.map(raw => new Question(raw));
        } else {
            this.questions = quiz_Komplex.map(raw => new Question(raw));
        }
        this.order = this.createQuestionOrder();
        this.history = [];
        this.questionNumber = 0;
        this.nextQuestion();
    }



     createQuestionOrder(){
        let questionIDs  = Array.from({ length: this.questions.length }, (_, i) => i);
        // shuffle using Fisher–Yates algorithm: no duplicates random shuffling:
        for (let i = questionIDs.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [questionIDs[i], questionIDs[j]] = [questionIDs[j], questionIDs[i]];
        }
        return questionIDs;
    }
    nextQuestion() {
        // history.push(new answeredQuestion(config.quiz[currentID]),)
        this.questionNumber++;
        let currentID = this.order[this.questionNumber];
        if (currentID >= this.order.length) {
            // TODO: result screen
        } else {
            console.log(currentID);
            this.displayQuestion(currentID);
        }
    }
    displayQuestion(questionID: number){
        let currentQuestion = this.questions[questionID];
        document.getElementById("replace")?.replaceWith(currentQuestion.display());
    }
    checkQuestion() {
        let currentID = this.order[this.questionNumber];
        this.questions[currentID].checkAnswers();
    }
}
document.getElementById('nextQuestionButton')!.addEventListener('click', () => {
    quiz.nextQuestion();
});
document.getElementById('checkAnswersButton')!.addEventListener('click', () => {
    quiz.checkQuestion();
});

