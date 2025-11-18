import katex from 'katex';

import quiz_regular from './quiz/quiz_Regular.json';
import quiz_Komplex from './quiz/quiz_Complexity.json';

let quiz: Quiz;

export type QuizMode = 'regular' | 'Komplexität';

export function initQuiz(quiztype: QuizMode) {
    quiz = new Quiz(quiztype);
}


interface RawQuestion {
    ID: number;
    "Question text": string;
    Exam: string;
    AnswerOptions: string[];
    AnswerBools: boolean[];
    Explanations: string[];
}

export class Quiz {
    questions: Question[];
    order: number[];
    questionNumber: number;

    constructor(mode: QuizMode,) {
        if (mode === "regular") {
            this.questions = quiz_regular.map(raw => new Question(raw));
        } else {
            this.questions = quiz_Komplex.map(raw => new Question(raw));
        }

        this.order = this.createQuestionOrder();
        this.questionNumber = 0;

        this.nextQuestion();
    }
    // TODO fix skipping first question of order

    createQuestionOrder() {
        let questionIDs = Array.from({length: this.questions.length}, (_, i) => i);
        // shuffle using Fisher–Yates algorithm: no duplicates random shuffling:
        for (let i = questionIDs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [questionIDs[i], questionIDs[j]] = [questionIDs[j], questionIDs[i]];
        }
        return questionIDs;
    }

    nextQuestion() {
        let currentID = this.order[this.questionNumber];
        if (this.questionNumber >= this.order.length) {
            // TODO: result screen
        } else {
            console.log("current QuestionID:" + currentID);
            this.displayQuestion(currentID);
        }

        // update visuals
        document.getElementById('feedback')!.innerText = "";
        //ids are starting at 0, so question number +1
        document.getElementById('progress-container')!.innerHTML = "Question "+(this.questionNumber +1)+" of "+this.order.length;
        this.questionNumber++;
    }

    displayQuestion(questionID: number) {
        let currentQuestion = this.questions[questionID];
        currentQuestion.display();
    }

    checkQuestion() {
        let currentID = this.order[this.questionNumber];
        this.questions[currentID].checkAnswers();
    }


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
            this.answers.push(new Answer(raw.AnswerOptions[i], raw.AnswerBools[i], raw.Explanations[i]));
        }

    }

//TODO: fix errors with wrong ID ????
    display() {
        const examLinks = new Map<string, string>([
            ["Summer_24 retake", "https://teaching.model.in.tum.de/2024ss/theo/exams/2024_retake_solution.pdf"],
            ["Summer_24", "https://teaching.model.in.tum.de/2024ss/theo/exams/2024_endterm_solution.pdf"],
            ["Summer_23 retake", "https://teaching.model.in.tum.de/2024ss/theo/exams/2023_retake_solution.pdf"],
            ["Summer_23", "https://teaching.model.in.tum.de/2024ss/theo/exams/2023_endterm_solution.pdf"],
            ["Summer_22 retake", "https://teaching.model.in.tum.de/2024ss/theo/exams/2022_retake_solution.pdf"],
            ["Summer_22", "https://teaching.model.in.tum.de/2024ss/theo/exams/2022_endterm_solution.pdf"],
        ]);

        const replaceDiv = document.getElementById("replace") as HTMLElement;

        // Clear old question
        replaceDiv.innerHTML = "";

        const tmpl = document.getElementById("questionTemplate") as HTMLTemplateElement;
        const clone = tmpl.content.cloneNode(true) as HTMLElement;

        // Fill in question info
        const idEl = clone.querySelector(".question-id") as HTMLElement;
        idEl.textContent = "Question ID: " + this.id;

        const examLink = clone.querySelector(".exam-link") as HTMLAnchorElement;
        examLink.href = examLinks.get(this.exam)!;
        examLink.textContent = " Exam: " + this.exam;

        const questionEl = clone.querySelector(".question-text") as HTMLElement;
        renderSupport(questionEl,this.questionText);
        // Render answers
        const answersContainer = clone.querySelector(".answers") as HTMLElement;
        this.answers.forEach(answer => answer.display(answersContainer));

        // Append the fully populated clone
        replaceDiv.appendChild(clone);

    }

    checkAnswers() {
        const inputs = document.querySelectorAll<HTMLInputElement>(".answer-input");
        let correctAnswer = true;
        let message = ""

        for (let i = 0; i < inputs.length; i++) {
            const answer = inputs[i];
            if (answer.checked !== this.answers[i].getRight()) {
                correctAnswer = false;
                message += `Answer ${i + 1} was: ${answer.checked} but expected: ${this.answers[i].getRight()}\n`;
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

    display(container: HTMLElement) {
        const tmpl = document.getElementById("answerTemplate") as HTMLTemplateElement;
        const clone = tmpl.content.cloneNode(true) as HTMLElement;

        const input = clone.querySelector(".answer-input") as HTMLInputElement;
        const label = clone.querySelector(".answer-label") as HTMLElement;
        const explanation = clone.querySelector(".explanation") as HTMLElement;

        renderSupport(label, this.answerText);
        renderSupport(explanation, this.explanation);
        container.appendChild(clone);
    }


}
/*
This function is here because when I give KaTeX the whole thing to render it just overflows
and I didn't find any way to stop it :) So now we just break it into smaller pieces and try to avoid the problem like that.
 */
function renderSupport(container: HTMLElement, content: string) {

    const regex = /\\text\{([^}]*)\}/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
        // Append any math before this \text{} block
        if (match.index > lastIndex) {
            const mathPart = content.slice(lastIndex, match.index).trim();
            if (mathPart) {
                const span = document.createElement("span");
                katex.render(mathPart, span, {output: "html", displayMode: false});
                container.appendChild(span);
            }
        }
        const textPart = match[1];
        container.appendChild(document.createTextNode(textPart));

        lastIndex = match.index + match[0].length;
    }
        if (lastIndex < content.length) {
            const remainingMath = content.slice(lastIndex).trim();
            if (remainingMath) {
                const span = document.createElement("span");
                katex.render(remainingMath, span, {output: "html", displayMode: false});
                container.appendChild(span);
            }
        }
}

class answeredQuestion {
    question: Question;
    givenAnswers: number[];
    correct: boolean;

    constructor(question: Question, givenAnswers: number[] = [], correct: boolean) {
        this.question = question;
        this.givenAnswers = givenAnswers;
        this.correct = correct;
    }
}


document.getElementById('nextQuestionButton')!.addEventListener('click', () => {
    quiz.nextQuestion();

});
document.getElementById('checkAnswersButton')!.addEventListener('click', () => {
    quiz.checkQuestion();
});

function showExplanation() {
    let explanations = document.querySelectorAll<HTMLElement>(".explanation");
    for (let i = 0; i < explanations.length; i++) {
        explanations[i].style.display = "flex";
    }
}

document.getElementById("showExplanation")!.addEventListener("click", showExplanation);

