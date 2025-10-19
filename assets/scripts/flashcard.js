let words = [];
let shownIndexes = [];
let historyPos = -1;
let isFlipped = false;
let showLang = "vi"; // random sẽ hiển thị tiếng Việt hoặc Nhật

const innerCard = document.getElementById("innerCard");
const frontText = document.getElementById("frontText");
const backText = document.getElementById("backText");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const counter = document.getElementById("counter");

const lessonSelect = document.getElementById("lessonSelect");
const tableBody = document.querySelector("#sidebar table tbody");

async function loadLessonList() {
    const res = await fetch("/json/flashcard/lessonList.json");
    const list = await res.json();

    list.forEach((lesson) => {
        const option = document.createElement("option");
        option.value = lesson.fileName;
        option.textContent = lesson.name;
        lessonSelect.appendChild(option);
    });

    // load bài đầu tiên mặc định
    loadLesson(list[0].fileName, list[0].name);

    // khi người dùng chọn bài khác
    lessonSelect.addEventListener("change", (e) => {
        const selected = list.find((l) => l.fileName === e.target.value);
        loadLesson(selected.fileName, selected.name);
    });
}

// Đọc file JSON có sẵn
async function loadLesson(fileName, lessonName) {
    try {
        const res = await fetch(`/json/flashcard/${fileName}.json`);
        if (!res.ok) throw new Error("Không tìm thấy file data.json");
        const data = await res.json();
        if (Array.isArray(data)) {
            words = data;
            // reset lịch sử
            shownIndexes = [];
            historyPos = -1;

            // Load dữ liệu cho card
            nextWord();

            // Load dữ liệu cho bảng
            renderTable(data);

            // Cập nhật tiêu đề bảng
            document.querySelector("#sidebar .sidebar-header h3").textContent = `Từ vựng ${lessonName}`;
        } else {
            frontText.textContent = "Dữ liệu JSON không hợp lệ!";
        }
    } catch (err) {
        frontText.textContent = "Lỗi khi đọc file JSON!";
        console.error(err);
    }
}

// Random 1 index chưa xuất hiện
function pickRandomUnusedIndex() {
    const available = words.map((_, i) => i).filter((i) => !shownIndexes.includes(i));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
}

// Hiển thị từ
function showWordByIndex(wordIndex) {
    const word = words[wordIndex];
    isFlipped = false;
    innerCard.classList.remove("flipped");
    showLang = Math.random() > 0.5 ? "vi" : "jp";
    frontText.textContent = showLang === "vi" ? word.vi : word.jp;
    backText.textContent = showLang === "vi" ? word.jp : word.vi;
    // counter dựa vào lịch sử (historyPos)
    counter.textContent = `${historyPos + 1}/${words.length}`;
}

// Next từ: nếu đang ở giữa history -> đi tới item tiếp theo trong history; còn không -> random mới
function nextWord() {
    if (historyPos < shownIndexes.length - 1) {
        historyPos += 1;
        const idx = shownIndexes[historyPos];
        showWordByIndex(idx);
        return;
    }

    // nếu không có item tiếp theo => random mới và push vào history
    const randomIndex = pickRandomUnusedIndex();
    if (randomIndex === null) {
        frontText.textContent = "Đã hết từ!";
        backText.textContent = "";
        counter.textContent = "";
        return;
    }
    shownIndexes.push(randomIndex); // thêm vào lịch sử
    historyPos = shownIndexes.length - 1;
    showWordByIndex(randomIndex);
}

// Previous: lùi trong lịch sử nếu có
function prevWord() {
    if (historyPos > 0) {
        historyPos -= 1;
        const idx = shownIndexes[historyPos];
        showWordByIndex(idx);
    }
}

// Lật thẻ
function flipCard() {
    isFlipped = !isFlipped;
    innerCard.classList.toggle("flipped", isFlipped);
}

// Render bảng danh sách từ
function renderTable(list) {
    tableBody.innerHTML = ""; // Xóa cũ
    list.forEach((item) => {
        const row = document.createElement("tr");

        // Nếu chỉ có jp và vi → jp chiếm 3 cột
        if (Object.keys(item).length <= 3) {
              row.classList.add("colspan");
            row.innerHTML = `
                <td colspan="3" ${item.hiragana ? `data-tooltip="${item.hiragana}"` : ""}>${item.jp}</td>
                <td>${item.vi}</td>
            `;
        } else {
            row.innerHTML = `
            <td ${item.hiragana ? `data-tooltip="${item.hiragana}"` : ""}>${item.jp}</td>
            <td>${item.kanji || ""}</td>
            <td>${item.sino || ""}</td>
            <td>${item.vi}</td>
        `;
        }
        tableBody.appendChild(row);
    });
}

// Sự kiện
innerCard.addEventListener("click", flipCard);
nextBtn.addEventListener("click", nextWord);
prevBtn.addEventListener("click", prevWord);
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") flipCard();
    if (e.key === "ArrowRight") nextWord();
    if (e.key === "ArrowLeft") prevWord();
});

const vocabBtn = document.getElementById("vocabBtn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

vocabBtn.onclick = () => {
    sidebar.classList.add("active");
};

closeSidebar.onclick = () => {
    sidebar.classList.remove("active");
};

// Khởi động
loadLessonList();
