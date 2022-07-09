var furigana;
var transfiguration;
var ligatures;
var kanji;
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

fetch('./json/data/kanji.json')
    .then(response => response.json())
    .then(result => {
        kanji = result;
    });

$('#click').click(function () {
    handleRandomVocabulary();
});

$(document).keyup(function (event) {
    switch (event.which) {
        case 13:
            handleResult();
            break;
        case 37:
            handleRandomVocabulary();
            break;
        case 38:
            handleSelectType(true, '#type_character');
            break;
        case 39:
            handleRandomVocabulary();
            break;
        case 40:
            handleSelectType(false, '#type_character');
            break;
        default:
            break;
    }
});

const handleRandomVocabulary = () => {
    let key = $('#type_character').val();
    let id = 1;
    switch (key) {
        case 'all':
            let dataAll = [...furigana, ...transfiguration, ...ligatures, ...kanji];
            id = Math.floor(Math.random() * dataAll.length);
            global = dataAll[id];
            break;
        case 'kanji':
            id = Math.floor(Math.random() * kanji.length);
            global = kanji[id];
            break;
        case 'transfiguration':
            id = Math.floor(Math.random() * transfiguration.length);
            global = transfiguration[id];
            break;
        case 'ligatures':
            id = Math.floor(Math.random() * ligatures.length);
            global = ligatures[id];
            break;
        default:
            id = Math.floor(Math.random() * furigana.length);
            global = furigana[id];
            break;
    }
    if (typeof global !== 'undefined') {
        $('#text').text(global.translate)
        if (global.audio !== null) {
            const src = './audio/' + global.audio;
            loadAudio(src);
        }
    }
}

$('#result').click(function () {
    handleResult();
})

const handleResult = () => {
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
                $('#text').text(`Kanji: ${global.kanji}, vietnamese: ${global.vietnamese}`);
                break;
            case 'ligatures':
                $('#text').text(`Hiragana: ${global.hiragana}, Katakana: ${global.katakana}`);
                break;
            default:
                $('#text').text(global.transfiguration);
                break;
        }
    }
}

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