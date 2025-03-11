let totalQuestions = 0;
let correctAnswers = 0;

async function loadQuestion() {
    const res = await fetch('/question');
    const data = await res.json();

    if (data.message) {
        document.getElementById("meaning").textContent = data.message;
        document.getElementById("options").innerHTML = "";
        showRestartButton();
        return;
    }

    totalQuestions++;
    document.getElementById("meaning").textContent = data.meaning;
    document.getElementById("status").textContent = "";
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    data.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => submitAnswer(btn, option, data.answer);
        optionsDiv.appendChild(btn);
    });
}

async function submitAnswer(button, selected, correct) {
    const res = await fetch('/answer', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: correct, correct: selected === correct })
    });

    const data = await res.json();
    document.getElementById("status").textContent = data.message;
    document.getElementById("status").classList.add("show");

    if (selected === correct) {
        button.classList.add("correct");
        correctAnswers++;
    } else {
        button.classList.add("wrong");
    }

    document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);
    
    setTimeout(() => {
        document.getElementById("status").classList.remove("show");
        loadQuestion();
    }, 1500);
}

function showRestartButton() {
    const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;
    const container = document.getElementById("options");
    container.innerHTML = `<p>Quiz Completed! Accuracy: ${accuracy}%</p>`;
}

window.onload = loadQuestion;
