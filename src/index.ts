


document.getElementById('exerciseButton')!.addEventListener('click', switchToExerciseOverview);
document.getElementById("regularQuiz")!.addEventListener("click",switchRegularQuiz);
document.getElementById("komplexQuiz")!.addEventListener("click",switchKomplexQuiz);
document.getElementById("displayNFA")!.addEventListener("click",switchTodDisplayDFA)
document.getElementById("showExplanation")!.addEventListener("click",showExplanation);


function switchToExerciseOverview() {
    setAllDivsDisplayNone();
    document.getElementById('exercisesOverViewDiv')!.style.display = 'flex';

}


function switchRegularQuiz(){
    switchToQuestions();
}
function switchKomplexQuiz(){
    switchToQuestions();
}
function switchTodDisplayDFA(){

}

function showExplanation(){
   let explanations=  document.querySelectorAll<HTMLElement>(".explanation");
   console.log(explanations);
    for(const explanation of explanations){
        explanation.style.display = "flex";
    }
}

function switchToQuestions() {
    setAllDivsDisplayNone();
    document.getElementById('questionDiv')!.style.display = 'block';
}

function setAllDivsDisplayNone() {
    let x = document.getElementsByClassName('switchable');
    for (let i = 0; i < x.length; i++) {
        (x[i] as HTMLElement).style.display = 'none';
    }
}


