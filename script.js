const passwordInput = document.getElementById("password");
const copyBtn = document.getElementById("copyBtn");
const generateBtn = document.getElementById("generateBtn");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const useUpper = document.getElementById("useUpper");
const useLower = document.getElementById("useLower");
const useDigits = document.getElementById("useDigits");
const useSymbols = document.getElementById("useSymbols");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
const historyList = document.getElementById("historyList");

const CHARS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    digits: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

let history = [];

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

function buildCharset() {
    let charset = "";
    if (useUpper.checked) charset += CHARS.upper;
    if (useLower.checked) charset += CHARS.lower;
    if (useDigits.checked) charset += CHARS.digits;
    if (useSymbols.checked) charset += CHARS.symbols;
    return charset;
}

function randomInt(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
}

function generatePassword() {
    const charset = buildCharset();
    if (!charset) {
        passwordInput.value = "Выберите хотя бы один тип символов!";
        return;
    }
    const length = parseInt(lengthSlider.value);
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset[randomInt(charset.length)];
    }
    passwordInput.value = password;
    updateStrength(password);
    addToHistory(password);
}

function updateStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let percent, color, label;
    if (score <= 2) {
        percent = 25; color = "#ef4444"; label = "Слабый";
    } else if (score <= 4) {
        percent = 55; color = "#f59e0b"; label = "Средний";
    } else if (score <= 5) {
        percent = 75; color = "#84cc16"; label = "Хороший";
    } else {
        percent = 100; color = "#4ade80"; label = "Очень надёжный";
    }

    strengthFill.style.width = percent + "%";
    strengthFill.style.background = color;
    strengthText.textContent = label;
    strengthText.style.color = color;
}

function addToHistory(pwd) {
    history.unshift(pwd);
    if (history.length > 5) history.pop();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(pwd => {
        const li = document.createElement("li");
        li.textContent = pwd;
        li.title = "Кликни, чтобы скопировать";
        li.addEventListener("click", () => {
            navigator.clipboard.writeText(pwd);
            copyBtn.textContent = "✅";
            setTimeout(() => copyBtn.textContent = "📋", 1000);
        });
        historyList.appendChild(li);
    });
}

copyBtn.addEventListener("click", () => {
    if (!passwordInput.value || passwordInput.value.startsWith("Нажми") || passwordInput.value.startsWith("Выберите")) return;
    navigator.clipboard.writeText(passwordInput.value);
    copyBtn.textContent = "✅";
    setTimeout(() => copyBtn.textContent = "📋", 1000);
});

generateBtn.addEventListener("click", generatePassword);

window.addEventListener("load", generatePassword);