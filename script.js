const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("strength");
const strengthBar = document.getElementById("strengthBar");
const warning = document.getElementById("warning");

const lengthCheck = document.getElementById("length");
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numberCheck = document.getElementById("number");
const specialCheck = document.getElementById("special");

const togglePassword = document.getElementById("togglePassword");

const generateButton = document.getElementById("generatePassword");
const copyButton = document.getElementById("copyPassword");

const passwordLength = document.getElementById("passwordLength");

const useUppercase = document.getElementById("useUppercase");
const useLowercase = document.getElementById("useLowercase");
const useNumbers = document.getElementById("useNumbers");
const useSymbols = document.getElementById("useSymbols");


/* =========================
   PASSWORD TESTER
========================= */

passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    let score = 0;

    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (hasLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    updateCheck(lengthCheck, hasLength, "At least 8 characters");
    updateCheck(uppercaseCheck, hasUppercase, "Contains uppercase letter");
    updateCheck(lowercaseCheck, hasLowercase, "Contains lowercase letter");
    updateCheck(numberCheck, hasNumber, "Contains a number");
    updateCheck(specialCheck, hasSpecial, "Contains special character");

    updateStrength(score);

    checkPasswordProblems(password);
});


/* =========================
   CHECKLIST
========================= */

function updateCheck(element, passed, text) {

    if (passed) {

        element.textContent = "✓ " + text;
        element.style.color = "#00ffaa";

    } else {

        element.textContent = "✗ " + text;
        element.style.color = "#ef4444";

    }
}


/* =========================
   STRENGTH
========================= */

function updateStrength(score) {

    if (score === 0) {

        strengthText.textContent = "Enter a password";
        strengthBar.style.width = "0%";

    } else if (score <= 1) {

        strengthText.textContent = "Very Weak";
        strengthBar.style.width = "20%";

    } else if (score === 2) {

        strengthText.textContent = "Weak";
        strengthBar.style.width = "40%";

    } else if (score === 3) {

        strengthText.textContent = "Medium";
        strengthBar.style.width = "60%";

    } else if (score === 4) {

        strengthText.textContent = "Strong";
        strengthBar.style.width = "80%";

    } else {

        strengthText.textContent = "Very Strong";
        strengthBar.style.width = "100%";

    }
}


/* =========================
   PASSWORD WARNINGS
========================= */

function checkPasswordProblems(password) {

    if (password.length === 0) {

        warning.textContent = "";
        return;

    }

    const commonPasswords = [
        "password",
        "123456",
        "12345678",
        "qwerty",
        "admin",
        "letmein",
        "welcome",
        "password123"
    ];

    const lowerPassword = password.toLowerCase();

    if (commonPasswords.includes(lowerPassword)) {

        warning.textContent =
            "⚠ This is a very common password.";

        warning.style.color = "#ef4444";

        return;
    }

    if (/(.)\1\1/.test(password)) {

        warning.textContent =
            "⚠ Avoid repeating the same character.";

        warning.style.color = "#f59e0b";

        return;
    }

    if (/1234|2345|3456|4567|abcd|bcde|qwerty/i.test(password)) {

        warning.textContent =
            "⚠ Avoid simple sequences.";

        warning.style.color = "#f59e0b";

        return;
    }

    warning.textContent =
        "✓ No common patterns detected.";

    warning.style.color = "#00ffaa";
}


/* =========================
   SHOW / HIDE PASSWORD
========================= */

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "Show";

    }

});


/* =========================
   SECURE RANDOM CHARACTER
========================= */

function secureRandomCharacter(characters) {

    const randomNumber = new Uint32Array(1);

    crypto.getRandomValues(randomNumber);

    const index = randomNumber[0] % characters.length;

    return characters[index];
}


/* =========================
   SECURE SHUFFLE
========================= */

function secureShuffle(password) {

    const characters = password.split("");

    for (let i = characters.length - 1; i > 0; i--) {

        const randomNumber = new Uint32Array(1);

        crypto.getRandomValues(randomNumber);

        const j = randomNumber[0] % (i + 1);

        [characters[i], characters[j]] =
        [characters[j], characters[i]];

    }

    return characters.join("");
}


/* =========================
   PASSWORD GENERATOR
========================= */

generateButton.addEventListener("click", function () {

    let length = Number(passwordLength.value);

    if (length < 8) {

        length = 8;
        passwordLength.value = 8;

    }

    if (length > 32) {

        length = 32;
        passwordLength.value = 32;

    }


    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const lowercase = "abcdefghijklmnopqrstuvwxyz";

    const numbers = "0123456789";

    const symbols = "!@#$%^&*()_+-=[]{}";


    let availableCharacters = "";

    let password = "";


    /* Add selected character types */

    if (useUppercase.checked) {

        availableCharacters += uppercase;

        password += secureRandomCharacter(uppercase);

    }

    if (useLowercase.checked) {

        availableCharacters += lowercase;

        password += secureRandomCharacter(lowercase);

    }

    if (useNumbers.checked) {

        availableCharacters += numbers;

        password += secureRandomCharacter(numbers);

    }

    if (useSymbols.checked) {

        availableCharacters += symbols;

        password += secureRandomCharacter(symbols);

    }


    /* Check if nothing is selected */

    if (availableCharacters.length === 0) {

        alert("Please select at least one character type.");

        return;

    }


    /* Fill remaining characters */

    while (password.length < length) {

        password += secureRandomCharacter(
            availableCharacters
        );

    }


    /* Shuffle password */

    password = secureShuffle(password);


    /* Put password into input */

    passwordInput.value = password;


    /* Automatically test password */

    passwordInput.dispatchEvent(
        new Event("input")
    );

});


/* =========================
   COPY PASSWORD
========================= */

copyButton.addEventListener("click", async function () {

    const password = passwordInput.value;

    if (password.length === 0) {

        copyButton.textContent =
            "Generate a password first";

        setTimeout(function () {

            copyButton.textContent =
                "Copy Password";

        }, 1500);

        return;
    }


    try {

        await navigator.clipboard.writeText(password);

        copyButton.textContent =
            "✓ Password Copied!";

        setTimeout(function () {

            copyButton.textContent =
                "Copy Password";

        }, 1500);

    } catch (error) {

        copyButton.textContent =
            "Copy failed";

        setTimeout(function () {

            copyButton.textContent =
                "Copy Password";

        }, 1500);

    }

});