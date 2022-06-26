var furigana;
var transfiguration;
var ligatures;
var global;

fetch('./json/data/furigana.json')
    .then(response => response.json())
    .then(result => {
        furigana = result;
    });
fetch('./json/data/transfiguration.json')
    .then(response => response.json())
    .then(result => {
        transfiguration = result;
    });
fetch('./json/data/ligatures.json')
    .then(response => response.json())
    .then(result => {
        ligatures = result;
    });

$('#click').click(function () {
    handleRandomVocabulary();
});

$(document).keyup(function (event) {
    if (event.which === 37 || event.which === 38 || event.which === 39 || event.which === 40) {
        handleRandomVocabulary();
    }
});

const handleRandomVocabulary = () => {
    let key = $('#type_character').val();
    let id = 1;
    switch (key) {
        case 'all':
            id = Math.floor(Math.random() * 104);
            let dataAll = [...furigana, ...transfiguration, ...ligatures];
            global = dataAll[id];
            break;
        case 'kanji':
            break;
        case 'transfiguration':
            id = Math.floor(Math.random() * 24);
            global = transfiguration.find(result => result.id == id);
            break;
        case 'ligatures':
            id = Math.floor(Math.random() * 24);
            global = ligatures.find(result => result.id == id);
            break;
        default:
            id = Math.floor(Math.random() * 43);
            global = furigana.find(result => result.id == id);
            break;
    }
    if (typeof global !== 'undefined') {
        $('#text').text(global.translate)
        if (global.audio !== '') {
            const src = './audio/' + global.audio;
            loadAudio(src);
        }
    }
}

$('#result').click(function () {
    let key = $('#type_character').val();
    if (typeof global !== 'undefined') {
        switch (key) {
            case 'all':
                if (typeof global.transfiguration === 'undefined') {
                    $('#text').text(`Hiragana: ${global.hiragana}, Katakana: ${global.katakana}`);
                    break;
                }
                $('#text').text(global.transfiguration);
                break;
            case 'hiragana':
                $('#text').text(global.hiragana);
                break;
            case 'katakana':
                $('#text').text(global.katakana);
                break;
            case 'kanji':
                break;
            case 'ligatures':
                $('#text').text(`Hiragana: ${global.hiragana}, Katakana: ${global.katakana}`);
                break;
            default:
                $('#text').text(global.transfiguration);
                break;
        }
    }
})

const loadAudio = async (src) => {
    const audio = new Audio(src);
    await audio.load();
    audio.play();
    $('#audio').html(`<source src="${src}" type="audio/mp3">`);
}

const searchByChar = (keyword, type) => {
    let result = '';
    if (type == 'alphabet') {
        if (typeof furigana !== 'undefined') {
            furigana.map((item) => {
                if (item.translate.toLowerCase().search(keyword.toLowerCase()) !== -1) {
                    result = result + `<span>${item.translate}: ${item.katakana}, ${item.hiragana}</span>`;
                }
            });
        }
        if (typeof transfiguration !== 'undefined') {
            transfiguration.map((item) => {
                if (item.translate.toLowerCase().search(keyword.toLowerCase()) !== -1) {
                    result = result + `<span>${item.translate}: ${item.transfiguration}</span>`;
                }
            });
        }
    } else if (type == 'hiragana') {
        if (typeof furigana !== 'undefined') {
            furigana.map((item) => {
                if (item.katakana.search(keyword) !== -1 || item.hiragana.search(keyword) !== -1) {
                    result = result + `<span>${item.translate}: ${item.katakana}, ${item.hiragana}</span>`;
                }
            });
        }
        if (typeof transfiguration !== 'undefined') {
            transfiguration.map((item) => {
                if (item.transfiguration.search(keyword) !== -1) {
                    result = result + `<span>${item.translate}: ${item.transfiguration}</span>`;
                }
            });
        }
    }
    return result;
}