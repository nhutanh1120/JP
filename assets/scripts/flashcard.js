/**
 * Flashcard Application - Professional Edition
 * Japanese language learning system with optimized performance
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
    words: [],
    shownIndexes: [],
    historyPos: -1,
    isFlipped: false,
    displayMode: "mix", // mix | jp | vi
    isAudioOn: false,
    cardSize: "medium", // small | medium | large | xlarge
};

// ============================================================================
// DOM ELEMENTS (Cached for performance)
// ============================================================================

const DOM = {
    // Card display
    card: document.getElementById("card"),
    innerCard: document.getElementById("innerCard"),
    frontText: document.getElementById("frontText"),
    backText: document.getElementById("backText"),
    counter: document.getElementById("counter"),

    // Navigation
    nextBtn: document.getElementById("nextBtn"),
    prevBtn: document.getElementById("prevBtn"),

    // Dropdowns & selectors
    lessonSelect: document.getElementById("lessonSelect"),
    simpleSelect: document.getElementById("simpleSelect"),
    cardSizeRadios: document.querySelectorAll('input[name="cardSize"]'),

    // Toggles
    inputSoundToggle: document.getElementById("inputSoundToggle"),
    randomToggle: document.getElementById("inputRandomToggle"),
    inputSideControlToggle: document.getElementById("inputSideControlToggle"),

    // Buttons
    shuffleBtn: document.getElementById("shuffleBtn"),
    toggleControlBtn: document.getElementById("toggleControlBtn"),
    resetBtn: document.getElementById("resetBtn"),
    vocabBtn: document.getElementById("vocabBtn"),
    closeSidebar: document.getElementById("closeSidebar"),

    // Containers
    sideControls: document.getElementById("sideControls"),
    settingDropdown: document.getElementById("settingDropdown"),
    sidebar: document.getElementById("sidebar"),
    tableBody: document.querySelector("#sidebar table tbody"),
};


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if random mode is enabled
 * @returns {boolean} Random mode state
 */
function isRandomEnabled() {
    return DOM.randomToggle?.checked ?? false;
}

/**
 * Get current display language for card front
 * @param {string} mode - Display mode (mix, jp, vi)
 * @returns {string} Language code (jp or vi)
 */
function getDisplayLanguage(mode) {
    switch (mode) {
        case "jp":
            return "jp";
        case "vi":
            return "vi";
        case "mix":
        default:
            return Math.random() > 0.5 ? "vi" : "jp";
    }
}

/**
 * Play audio file with error handling
 * @param {string} audioFile - Audio filename
 */
function playAudio(audioFile) {
    if (!audioFile) return;

    try {
        const audio = new Audio(`/audio/flashcard/${audioFile}`);
        audio.play().catch(err => {
            if (err.name !== "NotAllowedError") {
                console.error("Audio playback error:", err);
            }
        });
    } catch (err) {
        console.error("Audio loading error:", err);
    }
}

/**
 * Toggle card flip animation
 */
function flipCard() {
    state.isFlipped = !state.isFlipped;
    DOM.innerCard.classList.toggle("flipped", state.isFlipped);
}

/**
 * Update counter display with current position
 */
function updateCounter() {
    DOM.counter.textContent = `${state.historyPos + 1}/${state.words.length}`;
}

/**
 * Update card size class
 * @param {string} size - Size identifier
 */
function updateCardSize(size) {
    state.cardSize = size;
    DOM.card.classList.remove("size-small", "size-medium", "size-large", "size-xlarge");
    DOM.card.classList.add(`size-${size}`);
}

// ============================================================================
// CORE FLASHCARD LOGIC
// ============================================================================

/**
 * Pick random word index from unused words
 * @returns {number|null} Random index or null if all words shown
 */
function pickRandomIndex() {
    const available = state.words
        .map((_, idx) => idx)
        .filter(idx => !state.shownIndexes.includes(idx));

    return available.length === 0
        ? null
        : available[Math.floor(Math.random() * available.length)];
}

/**
 * Display word at given index with flip reset
 * @param {number} wordIndex - Index in words array
 */
function showWord(wordIndex) {
    if (!state.words[wordIndex]) return;

    const word = state.words[wordIndex];
    state.isFlipped = false;
    DOM.innerCard.classList.remove("flipped");

    const lang = getDisplayLanguage(state.displayMode);
    const frontText = lang === "vi" ? word.vi : word.jp;
    const backText = lang === "vi" ? word.jp : word.vi;

    // Set front immediately, back with delay for better UX
    DOM.frontText.textContent = frontText;
    setTimeout(() => {
        DOM.backText.textContent = backText;
    }, 400);

    // Auto-play audio if enabled
    if (state.isAudioOn && word?.audio) {
        playAudio(word.audio);
    }

    updateCounter();
}

/**
 * Navigate to next word (forward in history or new word)
 */
function nextWord() {
    // If we're in middle of history, move forward
    if (state.historyPos < state.shownIndexes.length - 1) {
        state.historyPos += 1;
        showWord(state.shownIndexes[state.historyPos]);
        return;
    }

    // Sequential mode (random off)
    if (!isRandomEnabled()) {
        const nextIndex = state.shownIndexes.length === 0
            ? 0
            : state.shownIndexes[state.shownIndexes.length - 1] + 1;

        if (nextIndex >= state.words.length) {
            DOM.frontText.textContent = "Đã hết từ!";
            DOM.backText.textContent = "Đã hết từ!";
            DOM.counter.textContent = "";
            return;
        }

        state.shownIndexes.push(nextIndex);
        state.historyPos++;
        showWord(nextIndex);
        return;
    }

    // Random mode
    const randomIndex = pickRandomIndex();
    if (randomIndex === null) {
        DOM.frontText.textContent = "Đã hết từ!";
        DOM.backText.textContent = "Đã hết từ!";
        DOM.counter.textContent = "";
        return;
    }

    state.shownIndexes.push(randomIndex);
    state.historyPos++;
    showWord(randomIndex);
}

/**
 * Navigate to previous word (backward in history)
 */
function prevWord() {
    if (state.historyPos > 0) {
        state.historyPos--;
        showWord(state.shownIndexes[state.historyPos]);
    }
}

/**
 * Reset flashcard to initial state
 */
function resetFlashcard() {
    state.shownIndexes = [];
    state.historyPos = -1;
    state.isFlipped = false;
    DOM.innerCard.classList.remove("flipped");
    nextWord();
}

// ============================================================================
// DATA LOADING & RENDERING
// ============================================================================

/**
 * Load and populate lesson list from JSON with grouping
 */
async function loadLessonList() {
    try {
        const response = await fetch("/json/flashcard/lessonList.json");
        if (!response.ok) throw new Error("Failed to load lesson list");

        const data = await response.json();

        // Check if data is grouped or flat array
        const isGrouped = data.length > 0 && data[0].group;

        if (isGrouped) {
            // Handle grouped structure
            data.forEach(groupData => {
                const optgroup = document.createElement("optgroup");
                optgroup.label = groupData.group;

                if (Array.isArray(groupData.lessons)) {
                    groupData.lessons.forEach(lesson => {
                        const option = document.createElement("option");
                        option.value = lesson.fileName;
                        option.textContent = lesson.name;
                        option.dataset.groupKey = groupData.groupKey;
                        option.dataset.lessonName = lesson.name;

                        optgroup.appendChild(option);
                    });
                }

                DOM.lessonSelect.appendChild(optgroup);
            });

            // Get all lessons (flatten)
            const allLessons = data.flatMap(groupData =>
                (groupData.lessons || []).map(lesson => ({
                    ...lesson,
                    groupKey: groupData.groupKey
                }))
            );
            if (allLessons.length === 0) throw new Error("No lessons found");

            // Load last lesson by default
            const lastLesson = allLessons.at(-1);
            DOM.lessonSelect.value = lastLesson.fileName;
            loadLesson(lastLesson.groupKey, lastLesson.fileName, lastLesson.name);

            // Listen for lesson changes
            DOM.lessonSelect.addEventListener("change", (e) => {
                const selected = allLessons.find(l => l.fileName === e.target.value);
                if (selected) {
                    loadLesson(selected.groupKey, selected.fileName, selected.name);
                }
            });
        }
    } catch (err) {
        console.error("Error loading lessons:", err);
        DOM.frontText.textContent = "Lỗi: Không tải được danh sách bài!";
    }
}

/**
 * Load specific lesson vocabulary from JSON
 * @param {string} groupKey - Group key for the lesson
 * @param {string} fileName - JSON file name (without .json extension)
 * @param {string} lessonName - Display name of lesson
 */
async function loadLesson(groupKey, fileName, lessonName) {
    try {
        const response = await fetch(`/json/flashcard/${groupKey}/${fileName}.json`);
        if (!response.ok) throw new Error(`File not found: ${fileName}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");

        // Filter out section headers
        state.words = data.filter(item => item.type !== "section");

        if (state.words.length === 0) {
            throw new Error("No vocabulary found in lesson");
        }

        // Reset history
        state.shownIndexes = [];
        state.historyPos = -1;
        state.isFlipped = false;
        DOM.innerCard.classList.remove("flipped");

        // Display first word
        nextWord();

        // Render vocabulary table
        renderTable(data);

        // Update sidebar title
        const sidebarHeader = document.querySelector("#sidebar .sidebar-header h2");
        if (sidebarHeader) {
            sidebarHeader.textContent = `Từ vựng ${lessonName}`;
        }
    } catch (err) {
        console.error("Error loading lesson:", err);
        DOM.frontText.textContent = "Lỗi tải bài!";
        DOM.backText.textContent = err.message;
    }
}

/**
 * Render vocabulary table with sections and tooltips
 * @param {Array} data - Full lesson data including sections
 */
function renderTable(data) {
    DOM.tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        // Section headers
        if (item.type === "section") {
            row.classList.add("highlight");
            row.innerHTML = `<td colspan="4">${item.label}</td>`;
            DOM.tableBody.appendChild(row);
            return;
        }

        // Vocabulary rows
        const fieldCount = Object.keys(item).length;
        const hiraganaAttr = item.hiragana ? `data-tooltip="${item.hiragana}"` : "";

        if (fieldCount <= 3) {
            // Simple format (jp + vi only)
            row.classList.add("colspan");
            row.innerHTML = `
                <td colspan="3" ${hiraganaAttr}>${item.jp}</td>
                <td>${item.vi}</td>
            `;
        } else {
            // Full format (jp + kanji + sino + vi)
            row.innerHTML = `
                <td ${hiraganaAttr}>${item.jp}</td>
                <td>${item.kanji || "-"}</td>
                <td>${item.sino || "-"}</td>
                <td>${item.vi}</td>
            `;
        }

        DOM.tableBody.appendChild(row);
    });
}

// ============================================================================
// EVENT LISTENERS - DISPLAY & SETTINGS
// ============================================================================

/**
 * Display mode selector change
 */
DOM.simpleSelect.addEventListener("change", (e) => {
    state.displayMode = e.target.value;
    if (state.shownIndexes.length > 0) {
        showWord(state.shownIndexes[state.historyPos]);
    }
});

/**
 * Card size radio buttons
 */
DOM.cardSizeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        if (e.target.checked) {
            updateCardSize(e.target.value);
        }
    });
});

/**
 * Audio toggle
 */
DOM.inputSoundToggle.addEventListener("change", (e) => {
    state.isAudioOn = e.target.checked;
});

/**
 * Side controls visibility toggle
 */
DOM.inputSideControlToggle.addEventListener("change", (e) => {
    state.sideControlsVisible = e.target.checked;
    DOM.sideControls.classList.toggle("collapsed", !e.target.checked);
});

// ============================================================================
// EVENT LISTENERS - CARD INTERACTION
// ============================================================================

/**
 * Card flip on click
 */
DOM.innerCard.addEventListener("click", flipCard);

/**
 * Next button
 */
DOM.nextBtn.addEventListener("click", nextWord);

/**
 * Previous button
 */
DOM.prevBtn.addEventListener("click", prevWord);

/**
 * Keyboard shortcuts
 * Enter/Up/Down: Flip card
 * Right arrow: Next word
 * Left arrow: Previous word
 */
document.addEventListener("keydown", (e) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") {
        return;
    }

    switch (e.key) {
        case "Enter":
        case "ArrowUp":
        case "ArrowDown":
            flipCard();
            break;
        case "ArrowRight":
            nextWord();
            break;
        case "ArrowLeft":
            prevWord();
            break;
    }
});

// ============================================================================
// EVENT LISTENERS - SIDE CONTROLS
// ============================================================================

/**
 * Settings dropdown toggle
 */
DOM.toggleControlBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    DOM.settingDropdown.classList.toggle("active");
});

/**
 * Close dropdown when clicking outside
 */
document.addEventListener("click", (e) => {
    if (!e.target.closest(".setting-menu")) {
        DOM.settingDropdown.classList.remove("active");
    }
});

/**
 * Shuffle button - replay audio
 */
DOM.shuffleBtn.addEventListener("click", () => {
    if (state.shownIndexes.length > 0) {
        const word = state.words[state.shownIndexes[state.historyPos]];
        if (word?.audio) {
            playAudio(word.audio);
        }
    }
});

/**
 * Reset button
 */
DOM.resetBtn.addEventListener("click", resetFlashcard);

// ============================================================================
// EVENT LISTENERS - SIDEBAR
// ============================================================================

/**
 * Open vocabulary sidebar
 */
DOM.vocabBtn.addEventListener("click", () => {
    DOM.sidebar.classList.add("active");
});

/**
 * Close vocabulary sidebar
 */
DOM.closeSidebar.addEventListener("click", () => {
    DOM.sidebar.classList.remove("active");
});

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

/**
 * Initialize application when DOM is ready
 */
function initializeApp() {
    loadLessonList();
}

// Start on DOM ready or if already loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
} else {
    initializeApp();
}
