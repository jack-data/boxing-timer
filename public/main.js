//Clock section elements
const clockSectionElement = document.getElementById("clock");
const remainingTimeElement = document.getElementById("remaining-time");
const remainingRoundsElement = document.getElementById("remaining-rounds");
const startButtonElement = document.getElementById("timer-start-button");
const clockButton2Element = document.getElementById("clock-button2");

//Input section elements
const inputSectionElement = document.getElementById("inputs");
const numberOfRoundsInputElement = document.getElementById("number-of-rounds-input");
const roundTimeInputElement = document.getElementById("round-duration-input");
const restTimeInputElement = document.getElementById("rest-duration-input");
const preparationTimeInputElement = document.getElementById("preparation-time-input");
const roundEndWarningTimeInputElement = document.getElementById("round-end-warning-time-input");

//Input object is used to assign default values that correspond to each input element
//This can then be used in handling inputs later on, where the default can
//be dynamic based on the last correct inputted value.
//Done to try and achieve better UX.
class Input{
    constructor(element, defaultValue){
        this.element = element;
        this.defaultValue = defaultValue;
    }
}

const inputs = {
    rounds: new Input(numberOfRoundsInputElement, numberOfRoundsInputElement.value),
    roundTime: new Input(roundTimeInputElement, roundTimeInputElement.value),
    restTime: new Input(restTimeInputElement, restTimeInputElement.value),
    prepTime: new Input(preparationTimeInputElement, preparationTimeInputElement.value)
}

const inputElements = [
    numberOfRoundsInputElement,
    roundTimeInputElement,
    restTimeInputElement,
    preparationTimeInputElement,
    roundEndWarningTimeInputElement
];

const START_BUTTON_STATES = {
    START: "Start",
    PAUSE: "Pause",
    RESUME: "Resume",
}

/*
Add hover-over/"little i" to explain what each input setting does
Make inputs not able to be 00:00
Make sure the warning time is always less than the round time
*/

let timer = {
    STATES: {
        PREP: "prep",
        ROUND: "round",
        REST: "rest",
        INACTIVE: "inactive"
    },

    //Initialize
    time: 0,
    interval: null,
    state: "inactive",
    round: 1,

    changeState(state){
        this.state = state;
        switch(state){
            case this.STATES.PREP:
                this.time = stringToSeconds(preparationTimeInputElement.value);
            break;
            case this.STATES.ROUND:
                this.time = stringToSeconds(roundTimeInputElement.value);
            break;
            case this.STATES.REST:
                this.time = stringToSeconds(restTimeInputElement.value);
            break;
            case this.STATES.INACTIVE:
                this.time = 0;
                clearInterval(this.interval);
                this.interval = null;
        }
        remainingTimeElement.innerText = secondsToString(this.time);
    },

    start(){
        //Disable inputs because timer is running
        for(const input in inputs){
            inputs[input].element.disabled = true;
        }

        //Set the button to now be "pause"

        //Set the round tracker to be out of the number of rounds set

        if(this.interval === null){
        //First countdown the prep time
        this.changeState(this.STATES.PREP);
        this.interval = setInterval(() => {this.countdown()}, 1000);
        }
        
    },

    countdown(){
        //Need to do sounds, which includes the logic for the round warning
        //Would also be good to do visual cues for anything sound related
        //To be more accessible
        if(this.state === this.STATES.PREP){
            this.time--;
            remainingTimeElement.innerText = secondsToString(this.time);
            
            if(this.time <= 0){
                //Prep time has finished so change states
                //Don't clear the interval as the next call of the function
                //Will move to the round state logic
                this.changeState(this.STATES.ROUND);
            }
        }else if(this.state === this.STATES.ROUND){
            remainingRoundsElement.innerText = `Round ${this.round}/${numberOfRoundsInputElement.value}`;
            //Set the display time equal to round time
            this.time--;
            remainingTimeElement.innerText = secondsToString(this.time);
            
            if(this.time <= 0){
                //Round has finished so switch to rest time
                //Increment the round counter for the next round countdown
                this.round ++;
                this.changeState(this.STATES.REST);
            }
        }else if(this.state === this.STATES.REST){
            //Update the counter and set the time equal to rest time
            this.time--;
            remainingTimeElement.innerText = secondsToString(this.time);

            if(this.time <= 0){
                //Rest time has finished so switch back to round time
                //For as many times as there are rounds
                if(this.round <= numberOfRoundsInputElement.value){
                    //Still rounds to go so switch state back to this.STATES.ROUND
                    this.changeState(this.STATES.REST);
                }else{
                    //Timer has finished so clear the interval
                    this.changeState(this.STATES.INACTIVE);
                }
            }
        }
    },

    resume(){
        if(this.interval === null){
            this.interval = setInterval(() => {this.countdown()}, 1000);
            }
    },

    pause(){
        clearInterval(this.interval);
        this.interval = null;
    },

    reset(){
        //Change to inactive state
        this.changeState(this.STATES.INACTIVE);

        //Reset the input values?
        //I won't for now as I think keeping the inputs as they are is better UX

        //Re-enable inputs as timer has been reset and so is no longer running
        for(const input in inputs){
            inputs[input].element.disabled = false;
        }

        //Reset the current round
        this.round = 1;

        //Reset the start button
        startButtonElement.innerText = START_BUTTON_STATES.START;
    }
}

//Move this to be a property of the timer
startButtonElement.addEventListener("click", (event) => {
    if(startButtonElement.innerText == START_BUTTON_STATES.START){
        timer.start();
        startButtonElement.innerText = START_BUTTON_STATES.PAUSE;
    }else if(startButtonElement.innerText == START_BUTTON_STATES.PAUSE){
        timer.pause();
        startButtonElement.innerText = START_BUTTON_STATES.RESUME;
    }else if(startButtonElement.innerText == START_BUTTON_STATES.RESUME){
        timer.resume();
        startButtonElement.innerText = START_BUTTON_STATES.PAUSE;
    }
})

//Same for this
clockButton2Element.addEventListener("click", (event) => {
    timer.reset();
})

let timePattern = /^[0-9][0-9]:[0-5][0-9]$/;

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

//Ensure that inputs are as expected

//Even though min and max have been set in the html of the input, it seems that
//the user can still type values in that are higher or lower than min max respectively.
//This event listener constrains values to the range we want.
let numberOfRoundsInputElementMax = 99;
let numberOfRoundsInputElementMin = 1;

numberOfRoundsInputElement.addEventListener("focusout", (event) => {

    if(numberOfRoundsInputElement.value > numberOfRoundsInputElementMax){
        numberOfRoundsInputElement.value = numberOfRoundsInputElementMax;
    }else if(numberOfRoundsInputElement.value < numberOfRoundsInputElementMin){
        numberOfRoundsInputElement.value = numberOfRoundsInputElementMin;
    };
})

function handleInput(input){
    if(!input.element.value.match(timePattern)){
        input.element.value = input.defaultValue;
    }else{
        input.defaultValue = input.element.value;
    }
}

//If, when no longer in focus, the input doesn't match the pattern of 00:59 then we default it.
//Values here should be variables, which are set whenever the input *is* correct
for(const input in inputs){
    inputs[input].element.addEventListener("focusout", (event) => {
        handleInput(inputs[input]);
    });
}