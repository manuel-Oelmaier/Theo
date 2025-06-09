import Papa from 'papaparse'

//TODO: look at web components and figure out if i want to make question & answer one ?
class MultipleChoiceQuestion {
    id: number;
    QuestionHtml: string;
    answers: Answer[];
    exam: string;

    constructor(id: number, Question: string, exam: string, answers: string[],) {
        this.id = id;
        this.QuestionHtml = Question;
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
    static from(csv:string[]): MultipleChoiceQuestion {
        return new MultipleChoiceQuestion(parseInt(csv[0]), csv[1], csv[2], csv.slice(3,11));

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
    right: boolean;
    explanation: string;

    constructor(AnswerHtml: string, right: string, explanation: string) {
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

    check() {
        return this.right;
    }
}

const questions: MultipleChoiceQuestion[] = await createQuestions();
let currentQuestion: MultipleChoiceQuestion;


/**
 * possibly rewrite,very hideous
 */
async function processCSV(): Promise<object[]> {
    const url = '/csv/Quiz_Komplexität.csv';

    return new Promise(resolve => {
        Papa.parse(url, {
            download: true,
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
    console.log(questionStrings);
    questionStrings.forEach(question => {
        questions.push(MultipleChoiceQuestion.from(Object.values(question)));
    });
    return questions;

}


/**
 * random oder der Reihe nach durch?#
 */
export async function chooseNewQuestion(): Promise<void> {
    let quest = questions;
    console.log(quest);
    let index = Math.floor(Math.random() * quest.length);
    console.log(quest[index]);
    currentQuestion = quest[index];
    currentQuestion.display();
}

function checkQuestion() {
    currentQuestion.checkAnswers();
}

document.getElementById('nextQuestionButton')!.addEventListener('click', chooseNewQuestion);
document.getElementById('checkAnswersButton')!.addEventListener('click', checkQuestion);
// TODO: statistics & history

