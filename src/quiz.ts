import Papa from 'papaparse'
import katex from 'katex';

//TODO also allow 2 or 4 Answers or just an arbitrary amount.
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
        for (let i = 0; i < 9; i += 3) {
            this.answers.push(new Answer(answers[i], answers[i + 1], answers[i + 2]));
        }
    }

    /**
     *
     * @param csv line
     */
    static from(csv: string[]): MultipleChoiceQuestion {
        return new MultipleChoiceQuestion(parseInt(csv[0]), csv[1], csv[2], csv.slice(3, 11));

    }

    getQuestionHTML() {
        return this.questionText;
    }

    getAnswers() {
        return this.answers;
    }


    display(): HTMLElement {

        const questionDiv = document.createElement("div");
        questionDiv.id = "replace"
        questionDiv.textContent += "Question ID: " + this.id + " Exam: " + this.exam;


        const question = document.createElement("h3");
        katex.render(this.questionText,question,{
            output:"html"
        });

        const form = document.createElement("form");

        for (let i = 0; i < this.answers.length; i++) {
            form.appendChild(this.answers[i].display(i));
        }

        questionDiv.appendChild(question);
        questionDiv.appendChild(form);

        return questionDiv;

    }


    checkAnswers() {
        let correctAnswer = true;
        let message = ""

        for (let i = 0; i < this.answers.length; i++) {
            let answer = document.getElementById('answer' + i) as HTMLInputElement;
            if (answer.checked !== this.answers[i].getRight()) {
                correctAnswer = false;
                message += "Answer " + i + "was: " + answer.checked + " but expected: " + this.answers[i].getRight() + "\n";
            }
        }


        if (correctAnswer) {
            alert("richtig:\n" + message);
        } else {
            alert("falsch:\n" + message);
        }
        //TODO find why this removes events from button ?
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
        katex.render(this.answerText,label,{
            output:"html",
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

const quiz: MultipleChoiceQuestion[] = await createQuestions();
let currentQuestion: MultipleChoiceQuestion;


/**
 * possibly rewrite,very hideous
 */
async function processCSV(): Promise<object[]> {
    const url = '/csv/Quiz_Komplexität.csv';

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

async function createQuestions(): Promise<MultipleChoiceQuestion[]> {
    let questions: MultipleChoiceQuestion[] = [];
    let questionStrings: object[] = await processCSV();
    questionStrings.forEach(question => {
        questions.push(MultipleChoiceQuestion.from(Object.values(question)));
    });
    return questions;

}


/**
 * random oder der Reihe nach durch?#
 */
export async function chooseNewQuestion(): Promise<void> {
    let quest = quiz;
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

