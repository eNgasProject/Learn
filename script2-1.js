// Ngas words data from the JSON
const ngasWords = [];

// Load vocabulary data from JSON file
async function loadData() {
      try {
        const res = await fetch('./data.json');
        if (!res.ok) throw new Error('Network response failed.');
        const data = await res.json();
        ngasWords = data;
        //initWordOfTheDay();
        //displayWords(data);
      } catch (e) {
        alert('Failed to load data: ' + e.message);
      }
    }


// DOM Elements
const screens = {
    home: document.getElementById('home-screen'),
    vocabulary: document.getElementById('vocabulary-screen'),
    wordDetail: document.getElementById('word-detail-screen'),
    flashcards: document.getElementById('flashcards-screen'),
    quiz: document.getElementById('quiz-screen'),
    matching: document.getElementById('matching-screen')
};

const navLinks = document.querySelectorAll('.nav-link');
const backButton = document.getElementById('back-button');
const audioPlayer = document.getElementById('audio-player');

// Word of the Day Elements
const wotdNgas = document.getElementById('wotd-ngas');
const wotdEnglish = document.getElementById('wotd-english');
const wotdCategory = document.getElementById('wotd-category');
const mediaDisplay = document.getElementById('media-display');
const playAudioBtn = document.getElementById('play-audio');
const showImageBtn = document.getElementById('show-image');
const showVideoBtn = document.getElementById('show-video');
const recentWordsList = document.getElementById('recent-words-list');

// Vocabulary Elements
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const partOfSpeechFilter = document.getElementById('part-of-speech-filter');
const vocabularyList = document.getElementById('vocabulary-list');

// Word Detail Elements
const detailNgas = document.getElementById('detail-ngas');
const detailEnglish = document.getElementById('detail-english');
const detailCategory = document.getElementById('detail-category');
const detailPos = document.getElementById('detail-pos');
const detailUsage = document.getElementById('detail-usage');
const detailExample = document.getElementById('detail-example');
const detailMediaDisplay = document.getElementById('detail-media-display');
const detailPlayAudioBtn = document.getElementById('detail-play-audio');
const detailShowImageBtn = document.getElementById('detail-show-image');
const detailShowVideoBtn = document.getElementById('detail-show-video');

// Flashcard Elements
const flashcard = document.querySelector('.flashcard');
const flashcardWord = document.getElementById('flashcard-word');
const flashcardTranslation = document.getElementById('flashcard-translation');
const flashcardInfo = document.getElementById('flashcard-info');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');
const flashcardCount = document.getElementById('flashcard-count');
const flashcardProgress = document.getElementById('flashcard-progress');

// Quiz Elements
const quizContainer = document.getElementById('quiz-container');
const questionText = document.getElementById('question-text');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const nextQuestionBtn = document.getElementById('next-question');
const quizCount = document.getElementById('quiz-count');
const quizProgress = document.getElementById('quiz-progress');

// Matching Game Elements
const ngasWordsColumn = document.getElementById('ngas-words');
const englishWordsColumn = document.getElementById('english-words');
const matchingFeedback = document.getElementById('matching-feedback');
const newGameBtn = document.getElementById('new-game-btn');

// App State
let currentScreen = 'home';
let currentWord = null;
let recentWords = [];
let flashcardWords = [];
let currentFlashcardIndex = 0;
let flashcardScores = {};
let quizWords = [];
let currentQuizIndex = 0;
let quizScore = 0;
let selectedQuizOption = null;
let matchingPairs = [];
let selectedMatchingWord = null;
let matchedPairsCount = 0;


// Initialize the app
function init() {
    // Set up event listeners
    setupNavigation();
    setupWordOfTheDay();
    setupVocabulary();
    setupFlashcards();
    setupQuiz();
    setupMatchingGame();
    
    // Show home screen by default
    showScreen('home');
}

// Navigation functions
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const screen = link.dataset.screen;
            showScreen(screen);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    backButton.addEventListener('click', () => {
        showScreen(currentScreen);
    });
}

function showScreen(screen) {
    // Hide all screens
    Object.values(screens).forEach(s => s.classList.remove('active'));
    
    // Show the selected screen
    screens[screen].classList.add('active');
    
    // Store current screen for back button
    if (screen !== 'wordDetail') {
        currentScreen = screen;
    }
    
    // Perform screen-specific setup
    switch (screen) {
        case 'vocabulary':
            renderVocabularyList();
            break;
        case 'flashcards':
            startFlashcards();
            break;
        case 'quiz':
            startQuiz();
            break;
        case 'matching':
            startMatchingGame();
            break;
    }
}

// Word of the Day functions
function setupWordOfTheDay() {
    // Set up event listeners for media buttons
    playAudioBtn.addEventListener('click', () => playAudio(currentWord.Audio));
    showImageBtn.addEventListener('click', () => showImage(currentWord.image));
    showVideoBtn.addEventListener('click', () => showVideo(currentWord.Video));
    
    // Load a random word of the day
    loadWordOfTheDay();
}

function loadWordOfTheDay() {
    // Get a random word
    const randomIndex = Math.floor(Math.random() * ngasWords.length);
    currentWord = ngasWords[randomIndex];
    
    // Update the UI
    wotdNgas.textContent = currentWord.Ngas_Word;
    wotdEnglish.textContent = currentWord.English;
    wotdCategory.textContent = currentWord.Category;
    
    // Clear media display
    mediaDisplay.innerHTML = '<p>Select a media type to display</p>';
    
    // Add to recent words (if not already there)
    if (!recentWords.some(w => w.Ngas_Word === currentWord.Ngas_Word)) {
        recentWords.unshift(currentWord);
        if (recentWords.length > 5) {
            recentWords.pop();
        }
        renderRecentWords();
    }
}

function renderRecentWords() {
    recentWordsList.innerHTML = '';
    
    recentWords.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.innerHTML = `
            <h3>${word.Ngas_Word}</h3>
            <p>${word.English}</p>
            <div class="word-tags">
                <span class="word-tag">${word.Part_of_Speech}</span>
                <span class="word-tag">${word.Category}</span>
            </div>
        `;
        
        wordItem.addEventListener('click', () => {
            showWordDetail(word);
        });
        
        recentWordsList.appendChild(wordItem);
    });
}

// Vocabulary functions
function setupVocabulary() {
    // Set up event listeners for search and filter
    searchInput.addEventListener('input', renderVocabularyList);
    categoryFilter.addEventListener('change', renderVocabularyList);
    partOfSpeechFilter.addEventListener('change', renderVocabularyList);
    
    // Initial render
    renderVocabularyList();
}

function renderVocabularyList() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const partOfSpeech = partOfSpeechFilter.value;
    
    vocabularyList.innerHTML = '';
    
    const filteredWords = ngasWords.filter(word => {
        const matchesSearch = word.Ngas_Word.toLowerCase().includes(searchTerm) || 
                             word.English.toLowerCase().includes(searchTerm);
        const matchesCategory = category === '' || word.Category === category;
        const matchesPartOfSpeech = partOfSpeech === '' || word.Part_of_Speech === partOfSpeech;
        
        return matchesSearch && matchesCategory && matchesPartOfSpeech;
    });
    
    if (filteredWords.length === 0) {
        vocabularyList.innerHTML = '<p class="no-results">No words found matching your criteria.</p>';
        return;
    }
    
    filteredWords.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.innerHTML = `
            <h3>${word.Ngas_Word}</h3>
            <p>${word.English}</p>
            <div class="word-tags">
                <span class="word-tag">${word.Part_of_Speech}</span>
                <span class="word-tag">${word.Category}</span>
            </div>
        `;
        
        wordItem.addEventListener('click', () => {
            showWordDetail(word);
        });
        
        vocabularyList.appendChild(wordItem);
    });
}

// Word Detail functions
function showWordDetail(word) {
    currentWord = word;
    
    // Update the UI with word details
    detailNgas.textContent = word.Ngas_Word;
    detailEnglish.textContent = word.English;
    detailCategory.textContent = word.Category;
    detailPos.textContent = word.Part_of_Speech;
    
    // Update usage and example (if available)
    detailUsage.textContent = word.Usage || 'No usage information available.';
    detailExample.textContent = word.Example || 'No example available.';
    
    // Clear media display
    detailMediaDisplay.innerHTML = '<p>Select a media type to display</p>';
    
    // Set up event listeners for media buttons
    detailPlayAudioBtn.onclick = () => playAudio(word.Audio);
    detailShowImageBtn.onclick = () => showImage(word.image);
    detailShowVideoBtn.onclick = () => showVideo(word.Video);
    
    // Show the word detail screen
    showScreen('wordDetail');
    
    // Add to recent words if not already there
    if (!recentWords.some(w => w.Ngas_Word === word.Ngas_Word)) {
        recentWords.unshift(word);
        if (recentWords.length > 5) {
            recentWords.pop();
        }
        renderRecentWords();
    }
}

// Media functions
function playAudio(audioPath) {
    if (!audioPath) {
        const display = currentScreen === 'home' ? mediaDisplay : detailMediaDisplay;
        display.innerHTML = '<p>No audio available for this word.</p>';
        return;
    }
    
    audioPlayer.src = audioPath;
    audioPlayer.play();
    
    const display = currentScreen === 'home' ? mediaDisplay : detailMediaDisplay;
    display.innerHTML = `
        <p>Playing audio: ${audioPath.split('/').pop()}</p>
        <button class="media-btn" id="stop-audio"><i class="fas fa-stop"></i> Stop</button>
    `;
    
    document.getElementById('stop-audio').addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        display.innerHTML = '<p>Audio stopped.</p>';
    });
}

function showImage(imagePath) {
    if (!imagePath) {
        const display = currentScreen === 'home' ? mediaDisplay : detailMediaDisplay;
        display.innerHTML = '<p>No image available for this word.</p>';
        return;
    }
    
    const display = currentScreen === 'home' ? mediaDisplay : detailMediaDisplay;
    display.innerHTML = `
        <img src="${imagePath}" alt="${currentWord.Ngas_Word}">
        <p>Image: ${imagePath.split('/').pop()}</p>
    `;
}

function showVideo(videoPath) {
    if (!videoPath) {
        const display = currentScreen === 'home' ? mediaDisplay : detailMediaDisplay;
        display.innerHTML = '<p>No video available for this word.</p>';
        return;
    }
    
    const display = currentScreen === 'home' ? mediaDisplay : detailMediaDisplay;
    display.innerHTML = `
        <video controls>
            <source src="${videoPath}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <p>Video: ${videoPath.split('/').pop()}</p>
    `;
}

// Flashcard functions
function setupFlashcards() {
    // Set up event listeners
    flashcard.addEventListener('click', flipFlashcard);
    easyBtn.addEventListener('click', () => rateFlashcard('easy'));
    mediumBtn.addEventListener('click', () => rateFlashcard('medium'));
    hardBtn.addEventListener('click', () => rateFlashcard('hard'));
}

function startFlashcards() {
    // Reset flashcards
    flashcardWords = [...ngasWords];
    currentFlashcardIndex = 0;
    flashcardScores = {};
    
    // Shuffle the words
    shuffleArray(flashcardWords);
    
    // Load the first flashcard
    loadFlashcard();
}

function loadFlashcard() {
    if (currentFlashcardIndex >= flashcardWords.length) {
        // All flashcards completed
        flashcard.innerHTML = `
            <div class="flashcard-front">
                <h2>Flashcards Completed!</h2>
                <p>You've gone through all the words.</p>
                <button id="restart-flashcards" class="media-btn">Restart Flashcards</button>
            </div>
        `;
        
        document.getElementById('restart-flashcards').addEventListener('click', startFlashcards);
        return;
    }
    
    const word = flashcardWords[currentFlashcardIndex];
    flashcardWord.textContent = word.Ngas_Word;
    flashcardTranslation.textContent = word.English;
    flashcardInfo.textContent = `${word.Part_of_Speech} • ${word.Category}`;
    
    // Reset the flashcard state
    flashcard.classList.remove('flipped');
    
    // Update progress
    flashcardCount.textContent = `${currentFlashcardIndex + 1}/${flashcardWords.length}`;
    flashcardProgress.style.width = `${((currentFlashcardIndex + 1) / flashcardWords.length) * 100}%`;
}

function flipFlashcard() {
    flashcard.classList.toggle('flipped');
}

function rateFlashcard(difficulty) {
    const currentWord = flashcardWords[currentFlashcardIndex];
    const wordKey = currentWord.Ngas_Word;
    
    // Update score based on difficulty
    if (!flashcardScores[wordKey]) {
        flashcardScores[wordKey] = 0;
    }
    
    switch (difficulty) {
        case 'easy':
            flashcardScores[wordKey] += 2;
            break;
        case 'medium':
            flashcardScores[wordKey] += 1;
            break;
        case 'hard':
            flashcardScores[wordKey] -= 1;
            break;
    }
    
    // Move to next flashcard
    currentFlashcardIndex++;
    loadFlashcard();
}

// Quiz functions
function setupQuiz() {
    nextQuestionBtn.addEventListener('click', loadNextQuizQuestion);
}

function startQuiz() {
    // Reset quiz
    quizWords = [...ngasWords];
    currentQuizIndex = 0;
    quizScore = 0;
    selectedQuizOption = null;
    
    // Shuffle the words
    shuffleArray(quizWords);
    
    // Load the first question
    loadQuizQuestion();
}

function loadQuizQuestion() {
    if (currentQuizIndex >= quizWords.length) {
        // Quiz completed
        quizContainer.innerHTML = `
            <div class="quiz-question">
                <h2>Quiz Completed!</h2>
                <p>Your score: ${quizScore}/${quizWords.length}</p>
                <button id="restart-quiz" class="media-btn">Restart Quiz</button>
            </div>
        `;
        
        document.getElementById('restart-quiz').addEventListener('click', startQuiz);
        return;
    }
    
    const currentWord = quizWords[currentQuizIndex];
    
    // Create question (show English, ask for Ngas)
    questionText.textContent = `What is the Ngas word for "${currentWord.English}"?`;
    
    // Generate options (correct answer + 3 random incorrect answers)
    const options = [currentWord.Ngas_Word];
    while (options.length < 4) {
        const randomWord = ngasWords[Math.floor(Math.random() * ngasWords.length)].Ngas_Word;
        if (!options.includes(randomWord)) {
            options.push(randomWord);
        }
    }
    
    // Shuffle options
    shuffleArray(options);
    
    // Render options
    quizOptions.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = option;
        
        optionElement.addEventListener('click', () => {
            if (selectedQuizOption) return; // Already selected
            
            selectedQuizOption = option;
            
            // Highlight selected option
            quizOptions.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionElement.classList.add('selected');
            
            // Check answer
            const isCorrect = option === currentWord.Ngas_Word;
            if (isCorrect) {
                quizScore++;
                optionElement.classList.add('correct');
                quizFeedback.textContent = 'Correct!';
                quizFeedback.className = 'quiz-feedback correct';
            } else {
                optionElement.classList.add('incorrect');
                quizFeedback.textContent = `Incorrect. The correct answer is "${currentWord.Ngas_Word}".`;
                quizFeedback.className = 'quiz-feedback incorrect';
                
                // Also highlight the correct answer
                quizOptions.querySelectorAll('.quiz-option').forEach(opt => {
                    if (opt.textContent === currentWord.Ngas_Word) {
                        opt.classList.add('correct');
                    }
                });
            }
            
            quizFeedback.style.display = 'block';
            nextQuestionBtn.style.display = 'block';
        });
        
        quizOptions.appendChild(optionElement);
    });
    
    // Reset feedback and next button
    quizFeedback.style.display = 'none';
    nextQuestionBtn.style.display = 'none';
    
    // Update progress
    quizCount.textContent = `${currentQuizIndex + 1}/${quizWords.length}`;
    quizProgress.style.width = `${((currentQuizIndex + 1) / quizWords.length) * 100}%`;
}

function loadNextQuizQuestion() {
    currentQuizIndex++;
    selectedQuizOption = null;
    loadQuizQuestion();
}

// Matching Game functions
function setupMatchingGame() {
    newGameBtn.addEventListener('click', startMatchingGame);
}

function startMatchingGame() {
    // Reset game state
    matchedPairsCount = 0;
    selectedMatchingWord = null;
    matchingFeedback.textContent = '';
    
    // Select 5 random words
    const shuffledWords = [...ngasWords];
    shuffleArray(shuffledWords);
    matchingPairs = shuffledWords.slice(0, 5);
    
    // Create Ngas words column
    ngasWordsColumn.innerHTML = '<h3>Ngas Words</h3>';
    const ngasWordsList = [...matchingPairs];
    shuffleArray(ngasWordsList);
    
    ngasWordsList.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'matching-word ngas';
        wordElement.textContent = word.Ngas_Word;
        wordElement.dataset.word = word.Ngas_Word;
        
        wordElement.addEventListener('click', () => {
            if (wordElement.classList.contains('matched')) return;
            
            // Play audio when Ngas word is clicked
            playAudio(word.Audio);
            
            // Select word for matching
            if (selectedMatchingWord) {
                // Already have a selected word
                if (selectedMatchingWord.classList.contains('ngas')) {
                    // Deselect if clicking another Ngas word
                    selectedMatchingWord.classList.remove('selected');
                    selectedMatchingWord = wordElement;
                    wordElement.classList.add('selected');
                } else {
                    // Trying to match with English word
                    if (word.Ngas_Word === selectedMatchingWord.dataset.word) {
                        // Correct match
                        wordElement.classList.add('matched');
                        selectedMatchingWord.classList.add('matched');
                        matchedPairsCount++;
                        
                        matchingFeedback.textContent = 'Correct match!';
                        matchingFeedback.style.color = 'var(--correct-color)';
                        
                        // Check if all pairs are matched
                        if (matchedPairsCount === matchingPairs.length) {
                            matchingFeedback.textContent = 'Congratulations! You matched all pairs!';
                            setTimeout(() => {
                                startMatchingGame(); // Start new game
                            }, 2000);
                        }
                    } else {
                        // Incorrect match
                        matchingFeedback.textContent = 'Incorrect match. Try again.';
                        matchingFeedback.style.color = 'var(--incorrect-color)';
                        
                        // Deselect after a delay
                        setTimeout(() => {
                            selectedMatchingWord.classList.remove('selected');
                            selectedMatchingWord = null;
                        }, 1000);
                    }
                }
            } else {
                // First selection
                selectedMatchingWord = wordElement;
                wordElement.classList.add('selected');
            }
        });
        
        ngasWordsColumn.appendChild(wordElement);
    });
    
    // Create English words column
    englishWordsColumn.innerHTML = '<h3>English Words</h3>';
    const englishWordsList = [...matchingPairs];
    shuffleArray(englishWordsList);
    
    englishWordsList.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'matching-word english';
        wordElement.textContent = word.English;
        wordElement.dataset.word = word.Ngas_Word;
        
        wordElement.addEventListener('click', () => {
            if (wordElement.classList.contains('matched')) return;
            
            if (selectedMatchingWord) {
                // Already have a selected word
                if (selectedMatchingWord.classList.contains('english')) {
                    // Deselect if clicking another English word
                    selectedMatchingWord.classList.remove('selected');
                    selectedMatchingWord = wordElement;
                    wordElement.classList.add('selected');
                } else {
                    // Trying to match with Ngas word
                    if (word.Ngas_Word === selectedMatchingWord.dataset.word) {
                        // Correct match
                        wordElement.classList.add('matched');
                        selectedMatchingWord.classList.add('matched');
                        matchedPairsCount++;
                        
                        matchingFeedback.textContent = 'Correct match!';
                        matchingFeedback.style.color = 'var(--correct-color)';
                        
                        // Check if all pairs are matched
                        if (matchedPairsCount === matchingPairs.length) {
                            matchingFeedback.textContent = 'Congratulations! You matched all pairs!';
                            setTimeout(() => {
                                startMatchingGame(); // Start new game
                            }, 2000);
                        }
                    } else {
                        // Incorrect match
                        matchingFeedback.textContent = 'Incorrect match. Try again.';
                        matchingFeedback.style.color = 'var(--incorrect-color)';
                        
                        // Deselect after a delay
                        setTimeout(() => {
                            selectedMatchingWord.classList.remove('selected');
                            selectedMatchingWord = null;
                        }, 1000);
                    }
                }
            } else {
                // First selection
                selectedMatchingWord = wordElement;
                wordElement.classList.add('selected');
            }
        });
        
        englishWordsColumn.appendChild(wordElement);
    });
}

// Utility functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);