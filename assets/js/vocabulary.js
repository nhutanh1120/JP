var vocabulary;
var global;
var countError = 0;
var countSuccess = 0;

fetch('./../json/data/vocabulary.json')
    .then(response => response.json())
    .then(result => {
        randomVocabulary(result);
        vocabulary = result;
    });

$('#vocabulary-input').keyup(function (event) {
    let check = false;
    let result = null;
    $('.vocabulary-result-view').removeClass('success');
    $('.vocabulary-result-view').empty();
    if (global.length !== undefined) {
        result = vocabulary.find(item => item.japanese === $(this).val());
    }
    if ($(this).val() === global.japanese || (typeof result !== 'undefined' && result !== null)) {
        check = true;
    }
    if (event.which === 13) {
        message(check, true)
    }
})

$('#vocabulary-result').click(function () {
    message($('#vocabulary-input').val(), global.japanese);
})

const randomVocabulary = (array) => {
    const id = Math.floor(Math.random() * (array.length - 1));
    let objectVocabulary = array[id];
    if(objectVocabulary.synonyms !== null) {
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

$('#vocabulary-view').click(function () {
    viewResult();
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