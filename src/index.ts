import {getNewQuestion} from "./questions";


document.getElementById('exerciseButton')!.addEventListener('click', switchToExerciseOverview);

function switchToExerciseOverview() {
    setAllDivsDisplayNone();
    document.getElementById('exercisesOverViewDiv')!.style.display = 'flex';

}

document.getElementById('lessonsButton')!.addEventListener('click', switchToLessonsOverview);

function switchToLessonsOverview() {
    setAllDivsDisplayNone();
    document.getElementById('overViewLessons')!.style.display = 'flex';
}

document.querySelectorAll('.quizButtons').forEach(button => {
    button.addEventListener('click', switchToQuestions);
})

function switchToQuestions() {
    setAllDivsDisplayNone();
    getNewQuestion();
    document.getElementById('questionDiv')!.style.display = 'block';
}

function setAllDivsDisplayNone() {
    let x = document.getElementsByClassName('switchable');
    for (let i = 0; i < x.length; i++) {
        (x[i] as HTMLElement).style.display = 'none';
    }
}
