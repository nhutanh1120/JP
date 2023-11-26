// Các biến toàn cục để lưu trữ dữ liệu từ API
var furiganaData;
var transfigurationData;
var ligaturesData;
var kanjiData;

// Hàm fetch dữ liệu từ API và trả về promise
const fetchData = (url) => {
    return fetch(url).then((response) => response.json());
};

// Sử dụng Promise.all để chờ tất cả các promise hoàn thành
Promise.all([
    fetchData("./json/data/furigana.json"),
    fetchData("./json/data/transfiguration.json"),
    fetchData("./json/data/ligatures.json"),
    fetchData("./json/data/kanji.json"),
])
    .then(([furigana, transfiguration, ligatures, kanji]) => {
        furiganaData = furigana;
        transfigurationData = transfiguration;
        ligaturesData = ligatures;
        kanjiData = kanji;
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });

$(document).keyup(function (event) {
    switch (event.which) {
        // Nếu phím "Enter" được nhấn
        case 13:
            // Xử lý hiển thị kết quả
            handleResult();
            break;

        // Nếu phím mũi tên bên trái hoặc bên phải được nhấn
        case 37:
        case 39:
            // Xử lý lấy từ vựng ngẫu nhiên
            handleRandomVocabulary();
            break;

        // Nếu phím mũi tên lên hoặc xuống được nhấn
        case 38:
        case 40:
            // Xử lý chọn loại ký tự
            handleSelectType(event.which === 38, "#type_character");
            break;

        // Trường hợp mặc định
        default:
            break;
    }
});

// Hàm xử lý lấy từ vựng ngẫu nhiên
const handleRandomVocabulary = () => {
    let selectedType = $("#type_character").val();
    let randomIndex = 1;

    switch (selectedType) {
        case "all":
            let allData = [...furiganaData, ...transfigurationData, ...ligaturesData, ...kanjiData];
            randomIndex = Math.floor(Math.random() * allData.length);
            currentVocabulary = allData[randomIndex];
            break;
        case "kanji":
            randomIndex = Math.floor(Math.random() * kanjiData.length);
            currentVocabulary = kanjiData[randomIndex];
            break;
        case "transfiguration":
            randomIndex = Math.floor(Math.random() * transfigurationData.length);
            currentVocabulary = transfigurationData[randomIndex];
            break;
        case "ligatures":
            randomIndex = Math.floor(Math.random() * ligaturesData.length);
            currentVocabulary = ligaturesData[randomIndex];
            break;
        default:
            randomIndex = Math.floor(Math.random() * furiganaData.length);
            currentVocabulary = furiganaData[randomIndex];
            break;
    }

    if (typeof currentVocabulary !== "undefined") {
        $("#text").text(currentVocabulary.translate);
        if (currentVocabulary.audio !== null) {
            const audioSrc = "./audio/" + currentVocabulary.audio;
            loadAudio(audioSrc);
        }
    }
};

// Hàm xử lý hiển thị kết quả
const handleResult = () => {
    let selectedType = $("#type_character").val();

    if (typeof currentVocabulary !== "undefined") {
        switch (selectedType) {
            case "all":
                if (
                    typeof currentVocabulary.transfiguration === "undefined" &&
                    typeof currentVocabulary.kanji === "undefined"
                ) {
                    $("#text").text(`Hiragana: ${currentVocabulary.hiragana}, Katakana: ${currentVocabulary.katakana}`);
                    break;
                } else if (typeof currentVocabulary.kanji !== "undefined") {
                    $("#text").text(currentVocabulary.kanji);
                    break;
                } else {
                    $("#text").text(currentVocabulary.transfiguration);
                }
                break;
            case "hiragana":
                $("#text").text(currentVocabulary.hiragana);
                break;
            case "katakana":
                $("#text").text(currentVocabulary.katakana);
                break;
            case "kanji":
                $("#text").text(`Kanji: ${currentVocabulary.kanji}, Vietnamese: ${currentVocabulary.vietnamese}`);
                break;
            case "ligatures":
                $("#text").text(`Hiragana: ${currentVocabulary.hiragana}, Katakana: ${currentVocabulary.katakana}`);
                break;
            default:
                $("#text").text(currentVocabulary.transfiguration);
                break;
        }
    }
};

// Hàm tải và phát audio
const loadAudio = async (src) => {
    const audio = new Audio(src);
    await audio.load();
    audio.play();
    $("#audio").html(`<source src="${src}" type="audio/mp3">`);
};

// Xử lý sự kiện click của button và phím mũi tên
$("#click").click(handleRandomVocabulary);

// Xử lý sự kiện click cho nút "result"
$("#result").click(handleResult);
