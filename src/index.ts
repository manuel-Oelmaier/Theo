import {chooseNewQuestion, config, quiz_Komplex, quiz_Regular} from "./quiz";


document.getElementById('exerciseButton')!.addEventListener('click', switchToExerciseOverview);
document.getElementById('lessonsButton')!.addEventListener('click', switchToLessonsOverview);
document.getElementById("regularQuiz")!.addEventListener("click",switchRegularQuiz);
document.getElementById("komplexQuiz")!.addEventListener("click",switchKomplexQuiz);


function switchToExerciseOverview() {
    setAllDivsDisplayNone();
    document.getElementById('exercisesOverViewDiv')!.style.display = 'flex';

}


function switchToLessonsOverview() {
    setAllDivsDisplayNone();
    document.getElementById('overViewLessons')!.style.display = 'flex';
}

function switchRegularQuiz(){
    config.quiz = quiz_Regular;
    switchToQuestions();
}
function switchKomplexQuiz(){
    config.quiz = quiz_Komplex;
    switchToQuestions();
}

function switchToQuestions() {
    setAllDivsDisplayNone();
    chooseNewQuestion();
    document.getElementById('questionDiv')!.style.display = 'block';
}

function setAllDivsDisplayNone() {
    let x = document.getElementsByClassName('switchable');
    for (let i = 0; i < x.length; i++) {
        (x[i] as HTMLElement).style.display = 'none';
    }
}
