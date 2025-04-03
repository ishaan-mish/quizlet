const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, JS) from the same directory
app.use(express.static(__dirname));

let words = [];
let questionQueue = [];

// Load words from CSV
function loadWords() {
    words = [];
    fs.createReadStream(path.join(__dirname, 'words.csv'))
        .pipe(csv())
        .on('data', (row) => words.push({ word: row.WORD, meaning: row.MEANING }))
        .on('end', () => {
            questionQueue = [...words];
            console.log("✅ Words loaded from CSV!");
        });
}

loadWords();

// Get a new random question
app.get('/question', (req, res) => {
    if (questionQueue.length === 0) {
        return res.json({ message: "Quiz completed! 🎉" });
    }

    const wordIndex = Math.floor(Math.random() * questionQueue.length);
    const correctWord = questionQueue[wordIndex];

    let options = [correctWord.word];
    while (options.length < 4) {
        let randomWord = words[Math.floor(Math.random() * words.length)].word;
        if (!options.includes(randomWord)) options.push(randomWord);
    }

    options.sort(() => Math.random() - 0.5);

    res.json({
        meaning: correctWord.meaning,
        options: options,
        answer: correctWord.word,
    });
});

// Submit an answer
app.post('/answer', (req, res) => {
    const { word, correct } = req.body;

    if (correct) {
        questionQueue = questionQueue.filter(q => q.word !== word);
        res.json({ message: "Correct! ✅" });
    } else {
        // Find the correct answer
        const correctAnswer = words.find(w => w.word === word)?.word;

        // Re-add the incorrect word to the queue
        const incorrectWord = words.find(w => w.word === word);
        if (incorrectWord) questionQueue.push(incorrectWord);

        res.json({ message: `Wrong answer ❌ The correct answer is: ${correctAnswer}` });
    }
});


// Serve index.html as the default route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
