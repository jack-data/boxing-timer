//Clock section elements
const clockSectionElement = document.getElementById("clock");
const remainingTimeElement = document.getElementById("remaining-time");
const remainingRoundsElement = document.getElementById("remaining-rounds");
const clockButton1Element = document.getElementById("clock-button1");
const clockButton2Element = document.getElementById("clock-button2");

//Input section elements
const inputSectionElement = document.getElementById("inputs");
const numberOfRoundsInputElement = document.getElementById("number-of-rounds-input");
const roundDurationInputElement = document.getElementById("round-duration-input");
const restDurationInputElement = document.getElementById("rest-duration-input");
const preparationTimeInputElement = document.getElementById("preparation-time-input");
const roundEndWarningTimeInputElement = document.getElementById("round-end-warning-time-input");

/*
Add hover-over/"little i" to explain what each input setting does
*/

let timePattern = /^[0-9][0-9]:[0-5][0-9]$/;

//Clock states
//Configuring times i.e. not started
//Preparation time counting down
//Round time counting down
//Alert at round end warning time

//Start/stop button states
let clockStarted = false;

function stringToSeconds(string){
    if(!string.match(timePattern)){
        console.error("String is of incorrect time format.");
    }

    let seconds = (parseInt(string[1])*60) + (parseInt(string.slice(3,5)));
    return seconds;
}

function secondsToString(seconds){
    if(typeof(seconds) !== "number"){
        console.error("Input must be a whole integer representing number of total seconds");
    }

    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

console.log(stringToSeconds("03:42"));
console.log(secondsToString(222));

function startClock(){
    clockStarted = true;
    
    //If round number is 1, then we need the prep time first before counting down the round
    //Countdown the round time
    //Countdown the rest time
    //Until rounds are complete

    let totalRounds = numberOfRoundsInputElement.value;
    let currentRound = 1;
    let roundTime = roundDurationInputElement.value * 60; //seconds
    let prepTime = preparationTimeInputElement.value * 60; //seconds

    let countdown = setInterval()


}

function countdownClock(seconds){
    remainingRoundsElement.innerText = secondsToString(seconds);

}

function pauseClock(){
    clockStarted = false;
}

function setClock(time){
    remainingTimeElement.innerText = time;
}

clockButton1Element.addEventListener("click", (event) => {
    if(clockStarted){
        pauseClock();
        clockButton1Element.innerText = "Start";
    }else{
        startClock();
        clockButton1Element.innerText = "Pause";
    }
})

//Ensure that inputs are as expected

//Even though min and max have been set in the html of the input, it seems that
//the user can still type values in that are higher or lower than min max respectively.
//This event listener constrains values to the range we want.
let numberOfRoundsInputElementMax = 99;
let numberOfRoundsInputElementMin = 0;

numberOfRoundsInputElement.addEventListener("focusout", (event) => {
    if(numberOfRoundsInputElement.value > numberOfRoundsInputElementMax){
        numberOfRoundsInputElement.value = numberOfRoundsInputElementMax;
    }else if(numberOfRoundsInputElement.value < numberOfRoundsInputElementMin){
        numberOfRoundsInputElement.value = numberOfRoundsInputElementMin;
    };
})

function checkInputPattern(inputElement, pattern, defaultValue){
    if(!inputElement.value.match(pattern)){
        inputElement.value = defaultValue;
    }
}

//If, when no longer in focus, the input doesn't match the pattern of 00:59 then we default it.
roundDurationInputElement.addEventListener("focusout", (event) => {
    checkInputPattern(roundDurationInputElement, timePattern, "03:00");
})

restDurationInputElement.addEventListener("focusout", (event) => {
    checkInputPattern(restDurationInputElement, timePattern, "01:00");
})

preparationTimeInputElement.addEventListener("focusout", (event) => {
    checkInputPattern(preparationTimeInputElement, timePattern, "00:25");
})

roundEndWarningTimeInputElement.addEventListener("focusout", (event) => {
    checkInputPattern(roundEndWarningTimeInputElement, timePattern, "00:10");
})