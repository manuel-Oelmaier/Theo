import Papa from 'papaparse'
import katex from 'katex';
const examLinks = [

]
class MultipleChoiceQuestion {
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
    static from(csv: string[]): MultipleChoiceQuestion {
        return new MultipleChoiceQuestion(parseInt(csv[0]), csv[1], csv[2], csv.slice(3, 14));

    }

    getQuestionHTML() {
        return this.questionText;
    }

    getAnswers() {
        return this.answers;
    }

//TODO: fix katex rendering not allowing line breaks...
    display(): HTMLElement {

        const questionDiv = document.createElement("div");
        questionDiv.id = "replace"
        questionDiv.textContent += "Question ID: " + this.id + " Exam: " + this.exam;


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

//TODO: solution button,+ explanation
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

        div.appendChild(input);
        div.appendChild(label);

        return div;

    }

}

export const quiz_Komplex: MultipleChoiceQuestion[] = await createQuestions("/csv/Quiz_Komplexität.csv");
export const quiz_Regular: MultipleChoiceQuestion[] = await createQuestions("csv/Quiz_Regular.csv");
let currentQuestion: MultipleChoiceQuestion;
export let config = {
    quiz: quiz_Komplex,
}


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

async function createQuestions(url: string): Promise<MultipleChoiceQuestion[]> {
    let questions: MultipleChoiceQuestion[] = [];
    let questionStrings: object[] = await processCSV(url);
    questionStrings.forEach(question => {
        questions.push(MultipleChoiceQuestion.from(Object.values(question)));
    });
    return questions;

}


/**
 * random oder der Reihe nach durch?#
 */
export async function chooseNewQuestion(): Promise<void> {
    let quest = config.quiz;
    let index = Math.floor(Math.random() * quest.length);
    console.log(quest[index]);
    currentQuestion = quest[index];
    document.getElementById("replace")?.replaceWith(currentQuestion.display());
}

function checkQuestion() {
    currentQuestion.checkAnswers();
}

document.getElementById('nextQuestionButton')!.addEventListener('click', chooseNewQuestion);
document.getElementById('checkAnswersButton')!.addEventListener('click', checkQuestion);
// TODO: statistics & history

