var furigana;
var transfiguration;
var global;

fetch('./json/furigana.json')
    .then(response => response.json())
    .then(result => {
        furigana = result;
    });
fetch('./json/transfiguration.json')
    .then(response => response.json())
    .then(result => {
        transfiguration = result;
    });

$('#click').click(function () {
    let key = $('#type_character').val();
    let id = 1;
    switch (key) {
        case 'all':
            id = Math.floor(Math.random() * 68);
            let dataAll = [ ...furigana, ...transfiguration];
            global = dataAll[id];
            break;
        case 'kanji': 
            break;
        case 'transfiguration': 
            id = Math.floor(Math.random() * 24);
            global = transfiguration.find(result => result.id == id);
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
})

$('#result').click(function () {
    let key = $('#type_character').val();
    if (typeof global !== 'undefined') {
        switch (key) {
            case 'all':
                $('#text').text(`hiragana: ${global.hiragana}, katakana: ${global.katakana}`);
                break;
            case 'hiragana':
                $('#text').text(global.hiragana);
                break;
            case 'katakana':
                $('#text').text(global.katakana);
                break;
            case 'kanji':
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