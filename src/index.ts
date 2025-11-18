import {initQuiz, QuizMode} from "./quiz.ts";

document.getElementById('exerciseButton')!.addEventListener('click', switchToExerciseOverview);
document.getElementById("regularQuiz")!.addEventListener("click", () => {
    switchToQuestions('regular');
});
document.getElementById("komplexQuiz")!.addEventListener("click", () => {
    switchToQuestions('Komplexität');
});


function switchToExerciseOverview() {
    setAllDivsDisplayNone();
    document.getElementById('exercisesOverViewDiv')!.style.display = 'flex';

}

function switchToQuestions(quiztype: QuizMode) {
    setAllDivsDisplayNone();
    document.getElementById('questionDiv')!.style.display = 'block';
    initQuiz(quiztype);
}

function setAllDivsDisplayNone() {
    let x = document.getElementsByClassName('switchable');
    for (let i = 0; i < x.length; i++) {
        (x[i] as HTMLElement).style.display = 'none';
    }
}


