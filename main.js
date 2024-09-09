// Setting The Game Name:
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("body>h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Abdelaziz Mohamed`;

// Setting game Options:
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let messageArea = document.querySelector(".message");
let numberOfHints = 2;

// Manage Hints Number
document.querySelector(".hint span").innerHTML = numberOfHints;

// Handle Hint Button
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", getHint);

// - - -
function generateInput() {
  const inputsContainer = document.querySelector(
    ".guess-game>.game-area>.inputs"
  );

  // Create Main Try Div
  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>try ${i}</span>`;

    // Disable All Except The First
    if (i !== 1) {
      tryDiv.classList.add("disabled-inputs");
    }

    // Create Inputs
    for (let j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", 1);
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }

  // Focus On The First Input In The First Try Element
  inputsContainer.children[0].children[1].focus();

  // Disable All Inputs Except First Input
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert Input Value To Upper Case
    input.addEventListener("input", () => {
      // Allow Only Letters To The Input
      if (
        !(
          (input.value >= "a" && input.value <= "z") ||
          (input.value >= "A" && input.value <= "Z")
        )
      ) {
        input.value = "";
      }
      input.value = input.value.toUpperCase();
      // Focus On The Next Input Only If Input Is Letter
      const nextInput = inputs[index + 1];
      if (nextInput && input.value != "") nextInput.focus();
    });
    //
    input.addEventListener("keydown", (ev) => {
      const currentIndex = Array.from(inputs).indexOf(ev.target);
      // // console.log(ev.key);
      // Focus On The Next Input When ArrowRight Key Is Pressed
      if (ev.key === "ArrowRight") {
        const nextInputIndex = currentIndex + 1;
        if (nextInputIndex < inputs.length) inputs[nextInputIndex].focus();
      }
      // Focus On The Previous Input When ArrowLeft Key Is Pressed
      if (ev.key === "ArrowLeft") {
        const previousInputIndex = currentIndex - 1;
        if (previousInputIndex >= 0) inputs[previousInputIndex].focus();
      }
      // Press GuessButton On Enter
      if (ev.key === "Enter" && currentIndex === 5) {
        document.querySelector(".check").click();
      }
    });
  });
}

// Generate Inputs On Window Load
window.addEventListener("load", () => generateInput());

// Genarate Random Word Of Six Letters
function generateWord() {
  const words = [
    "Banana",
    "Garden",
    "Animal",
    "Friend",
    "Butter",
    "Window",
    "Orange",
    "Flower",
    "Pencil",
    "School",
    "Flight",
    "Basket",
    "Family",
    "Minute",
    "Branch",
  ];
  // Generate Random Index From Zero To Fourteen (0 - 14)
  const rand = words[parseInt(Math.random() * words.length)].toLowerCase();
  return rand;
}

// Handel Guesses And Check Word
const guessButton = document.querySelector(".check");

guessButton.addEventListener("click", handleGuesses);

const wordToGuess = generateWord();

function handleGuesses() {
  let successGuess = true;

  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.getElementById(
      `guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    let actualLetter = wordToGuess[i - 1];
    // Game Logic
    if (letter === actualLetter) {
      // corrcet and in-place
      inputField.classList.add("in-place");
    } else {
      if (wordToGuess.includes(letter) && letter !== "") {
        // correct but not in-place
        inputField.classList.add("not-in-place");
        successGuess = false;
      } else {
        // wrong
        inputField.classList.add("no");
        successGuess = false;
      }
    }
  }

  // Check If User Win Or Lose
  if (successGuess) {
    messageArea.innerHTML = `You Won After ${
      currentTry > 1 ? ` ${currentTry} Tries` : `One Try`
    } 🥰<br> The Word Is: <span>${wordToGuess.toUpperCase()}</span>`;
    // Disable All Tries After Win
    const allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((item) => item.classList.add("disabled-inputs"));
    // Disable Guess Button
    guessButton.disabled = true;
    // Disable Hint Button
    document.querySelector(".hint").disabled = true;
  } else {
    // Disable Current Try Div
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");

    const currTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    // Disable Current Try Inputs
    currTryInputs.forEach((input) => (input.disabled = true));

    // Move To The Next Try Div
    currentTry++;

    if (currentTry <= numberOfTries) {
      // Enable Next Try Div
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");

      const nextTryInputs = document.querySelectorAll(
        `.try-${currentTry} input`
      );
      // Enable Next Try Inputs
      nextTryInputs.forEach((input) => (input.disabled = false));
      // Focus On The First Input
      nextTryInputs[0].focus();
    } else {
      messageArea.innerHTML = `Game Over 😔<br> The Word Is: <span>${wordToGuess.toUpperCase()}</span>`;
      // Disable Guess Button
      guessButton.disabled = true;
      // Disable Hint Button
      document.querySelector(".hint").disabled = true;
    }
  }
}

// Handel Get Hint (Generates Randomly-Positioned Letter)
function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  } else {
    hintButton.disabled = true;
    return;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );
  if (emptyEnabledInputs.length > 0) {
    // select random empty input
    let randomEmptyInput =
      emptyEnabledInputs[parseInt(Math.random() * emptyEnabledInputs.length)];
    // set its value from the correct word
    randomEmptyInput.value =
      wordToGuess[
        randomEmptyInput.id[randomEmptyInput.id.length - 1] - 1
      ].toUpperCase();
    // add in-place and disable it
    randomEmptyInput.classList.add("in-place");
    randomEmptyInput.disabled = true;
  } else {
    // select any input either if its full
    let randomInput =
      enabledInputs[parseInt(Math.random() * enabledInputs.length)];
    console.log(randomInput);
    // set its value from the correct word
    randomInput.value =
      wordToGuess[randomInput.id[randomInput.id.length - 1] - 1].toUpperCase();
    // add in-place and disable it
    randomInput.classList.add("in-place");
    randomInput.disabled = true;
  }
}

/* Key Board Keys */

// Handel Enter Key To Click The Guess Button
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter") {
    if (ev.target.id === `guess-${currentTry}-letter-6`) {
      document.querySelector(".check").click();
    }
  }
});

// Handel Back Space Key To Remove Letter And Back To Previous Input
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Backspace") {
    const currInput = ev.target;
    const currInputNumber = currInput.id.slice(currInput.id.length - 1);
    if (currInputNumber > 1) {
      currInput.value = "";
      document
        .getElementById(
          `${currInput.id.slice(0, currInput.id.length - 1)}${
            currInputNumber - 1
          }`
        )
        .focus();
    }
  }
});

// // console.log(wordToGuess);
