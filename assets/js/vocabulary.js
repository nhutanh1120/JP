var vocabulary;
var global;
var countError = 0;
var countSuccess = 0;

fetch('./../json/data/vocabulary.json')
    .then(response => response.json())
    .then(result => {
        randomVocabulary(result);
        vocabulary = result;
        result.map(item => $('.list-vocabulary-content ul').append(`<li>${item.japanese}: ${item.translate}</li>`));
    });

$('#vocabulary-input').keyup(function (event) {
    let check = false;
    let result = null;
    let value = $(this).val();
    if (value.trim() === '') return;
    $('.vocabulary-result-view').removeClass('success');
    $('.vocabulary-result-view').empty();
    if (global.length !== undefined) {
        result = vocabulary.find(item => item.japanese === value);
    }
    if (value === global.japanese || (typeof result !== 'undefined' && result !== null)) {
        check = true;
    }
    if (event.which === 13) {
        message(check, true)
    }
})

$('#result').click(function () {
    let value = $('#vocabulary-input').val();
    if (value.trim() === '') return;
    message(value, global.japanese);
})

const randomVocabulary = (array) => {
    const id = Math.floor(Math.random() * (array.length - 1));
    let objectVocabulary = array[id];
    if (objectVocabulary.synonyms !== null) {
        global = array.filter(item => (item.synonyms === objectVocabulary.synonyms && item.synonyms !== null));
    } else {
        global = objectVocabulary;
    }
    $('#vocabulary-text').text(objectVocabulary.translate);
    return objectVocabulary;
}

const message = (data, value) => {
    if (data === value) {
        toast({
            title: 'Chính xác!',
            message: 'Bạn đã nhập chính xác.',
            type: 'success',
            duration: 5000
        });
        if ((countSuccess + 1) % 5 === 0) {
            const number = countSuccess + 1;
            setTimeout(function () {
                toast({
                    title: 'Giỏi quá!',
                    message: `Bạn đã nhập đúng ${number} từ liên tiếp.`,
                    type: 'info',
                    duration: 5000
                });
            }, 1000);
        }
        randomVocabulary(vocabulary);
        $('#vocabulary-input').val('');
        $('.vocabulary-result-view').empty();
        $('.vocabulary-result-view').removeClass('success');
        countError = 0;
        countSuccess++;
    } else {
        toast({
            title: 'Sai rồi!',
            message: 'Từ bạn nhập không chính xác.',
            type: 'error',
            duration: 5000
        });
        if ((countError + 1) % 5 === 0) {
            const number = countError + 1;
            setTimeout(function () {
                toast({
                    title: 'Thông tin!',
                    message: `Bạn đã nhập sai ${number} từ liên tiếp.`,
                    type: 'warning',
                    duration: 5000
                });
            }, 1000);
        }
        countSuccess = 0;
        countError++;
    }
}

$('#view-result').click(function () {
    viewResult();
});

$('.list-vocabulary-title').click(function() {
    $(".list-vocabulary-content").slideToggle('fast');
});

const viewResult = () => {
    $('.vocabulary-result-view').addClass('success');
    if (global.length === undefined) {
        $('.vocabulary-result-view').html(`<span>${global.translate}: ${global.japanese}</span>`);
    } else {
        $('.vocabulary-result-view').empty();
        global.map(item => $('.vocabulary-result-view').append(`<span>${item.translate}: ${item.japanese}</span>`));
    }
}

const searchByChar = (keyword, type) => {
    let result = '';
    if (type == 'alphabet') {
        if (typeof vocabulary !== 'undefined') {
            vocabulary.map((item) => {
                if (item.translate.toLowerCase().search(keyword.toLowerCase()) !== -1) {
                    result = result + `<span>${item.translate}: ${item.japanese}</span>`;
                }
            });
        }
    } else if (type == 'hiragana') {
        if (typeof vocabulary !== 'undefined') {
            vocabulary.map((item) => {
                if (item.japanese.search(keyword) !== -1) {
                    result = result + `<span>${item.translate}: ${item.japanese}</span>`;
                }
            });
        }
    }
    return result;
}