const message = document.getElementById("messageCopied");
const copy_btn = document.querySelector(".copy-btn");
const slider = document.querySelector("[data-lengthSlider]");
const sliderNumber = document.querySelector("[data-LengthNumber]");
const displayPsw = document.querySelector("[dataDisplayPsw]");
const indicator = document.querySelector("[Strength-indicator]");
const generate_btn = document.querySelector("[Password-Generate-btn]");
const uppercase = document.querySelector("#Uppercase");
const lowercase = document.querySelector("#Lowercase");
const numbers = document.querySelector("#Numbers");
const symbols = document.querySelector("#Symbols");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
const randomString = "~!@#$%^&*()_+`-=\":;,./<>?{}|[]'*-+";

let password = "";
let passwordLength = 10;
let checkCount = 1;
uppercase.checked = true;

handleSlider();
setIndicator("#ccc");

//To set password-length
function handleSlider() {
  slider.value = passwordLength;
  sliderNumber.innerText = passwordLength;
  const min = slider.min;
  const max = slider.max;
  slider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

//To set color in indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0.5px 1px 0.5rem 2px ${color}`;
}

//To get Random Number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//To generate Random Uppercase
function generateUpperCase() {
  return String.fromCharCode(getRandomNumber(65, 91));
}

//To generate Random Lowercase
function generateLowerCase() {
  return String.fromCharCode(getRandomNumber(97, 123));
}

//To generate Random Numbers
function generateNumbers() {
  return getRandomNumber(0, 10);
}

//To generate Random Symbols
function generateSymbols() {
  const randomSymbol = getRandomNumber(0, randomString.length);
  return randomString.charAt(randomSymbol);
}

//To calculate Strengh of Password
function strenghOfPsw() {
  let upper = false;
  let lower = false;
  let number = false;
  let symbol = false;

  if (uppercase.checked) {
    upper = true;
  }
  if (lowercase.checked) {
    lower = true;
  }
  if (numbers.checked) {
    number = true;
  }
  if (symbols.checked) {
    symbol = true;
  }
  if (
    ((upper && lower && (number || symbol)) ||
      ((upper || lower) && number && symbol)) &&
    passwordLength >= 8
  ) {
    setIndicator("green");
  } else if (
    (((upper || lower) && (number || symbol)) ||
      ((number || lower) && (upper || symbol))) &&
    passwordLength >= 5
  ) {
    setIndicator("yellow");
  } else {
    setIndicator("red");
  }
}

//To copy Password
async function copyPassword() {
  try {
    await navigator.clipboard.writeText(displayPsw.value);
    message.innerText = "copied";
  } catch (e) {
    message.innerText = "Failed";
  }
  //To make copy-span visible
  message.classList.add("active");

  setTimeout(() => {
    message.classList.remove("active");
  }, 3000);
}

//To change Value in Slider
slider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// Condition --> When password is generated then we can copy password
copy_btn.addEventListener("click", () => {
  if (displayPsw.value) {
    copyPassword();
  }
});

// To count total checked boxes
function changeValue() {
  checkCount = 0;
  allCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  // Special Condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// When checkbox is checked then password is generated
allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", changeValue);
});

// Shuffle password
function shufflePsw(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((ele) => (str += ele));
  return str;
}

//To generate Button
generate_btn.addEventListener("click", () => {
  if (checkCount == 0) {
    return;
  }
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  password = "";

  // For Random Position
  let funcArray = [];
  if (uppercase.checked) {
    funcArray.push(generateUpperCase);
  }
  if (lowercase.checked) {
    funcArray.push(generateLowerCase);
  }
  if (numbers.checked) {
    funcArray.push(generateNumbers);
  }
  if (symbols.checked) {
    funcArray.push(generateSymbols);
  }

  // Compulsory Addition
  for (let i = 0; i < funcArray.length; i++) {
    password += funcArray[i]();
  }

  for (let i = 0; i < passwordLength - funcArray.length; i++) {
    let ranIndex = getRandomNumber(0, funcArray.length);
    password += funcArray[ranIndex]();
  }

  password = shufflePsw(Array.from(password));
  displayPsw.value = password;
  strenghOfPsw();
});
