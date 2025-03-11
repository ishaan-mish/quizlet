const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

let words = [];
let questionQueue = [];

// Load words from CSV
function loadWords() {
    words = [];
    fs.createReadStream('words.csv')
        .pipe(csv())
        .on('data', (row) => words.push({ word: row.WORD, meaning: row.MEANING }))
        .on('end', () => {
            questionQueue = [...words]; // Initialize question queue
            console.log("✅ Words loaded from CSV!");
        });
}

loadWords(); // Load words on server start

// Get a new random question
app.get('/question', (req, res) => {
    if (questionQueue.length === 0) {
        return res.json({ message: "Quiz completed! 🎉" });
    }

    const wordIndex = Math.floor(Math.random() * questionQueue.length);
    const correctWord = questionQueue[wordIndex];

    // Select 3 incorrect options
    let options = [correctWord.word];
    while (options.length < 4) {
        let randomWord = words[Math.floor(Math.random() * words.length)].word;
        if (!options.includes(randomWord)) options.push(randomWord);
    }

    options.sort(() => Math.random() - 0.5); // Shuffle options

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
        // Remove word from queue if correct
        questionQueue = questionQueue.filter(q => q.word !== word);
        res.json({ message: "Correct! ✅" });
    } else {
        // If wrong, do nothing (word stays in queue)
        res.json({ message: "Wrong answer ❌" });
    }
});

// Start server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
