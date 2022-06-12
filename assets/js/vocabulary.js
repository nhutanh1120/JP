var vocabulary;
var global;
var countError = 0;
var countSuccess = 0;

fetch('./../json/data/vocabulary.json')
    .then(response => response.json())
    .then(result => {
        randomVocabulary(result);
        vocabulary = result;

        let different = result.filter(item => item.topic == null);
        let exercise_1 = result.filter(item => item.topic == 'exercise_1');
        $('#list-vocabulary-option').append(`<option value='all'>Tất cả (${result.length})</option>`);
        $('#list-vocabulary-option').append(`<option value='${exercise_1[0].topic}'>Bài 1 (${exercise_1.length})</option>`);
        $('#list-vocabulary-option').append(`<option value='${different[0].topic}'>Khác (${different.length})</option>`);

        result.map(item => {
            let strDescription = '';
            if (item.description !== null) {
                strDescription = `<span class="description">-
                                    <span>${item.description}</span>
                                </span>`;
            }
            $('.list-vocabulary-content ul').append(
                `<li>
                    ${item.japanese}: ${item.translate} 
                    <span class="spelling">+
                        <span>${item.spelling}</span>
                    </span>
                    ${strDescription}
                </li>`);
        });
    });

$(document).on('click', '.list-vocabulary-content ul li .spelling', function () {
    $('.list-vocabulary-content ul').find('.show-spelling').removeClass('show-spelling');
    $('.list-vocabulary-content ul').find('.active').removeClass('active');
    $(this).addClass('show-spelling');
})

$(document).on('click', '.list-vocabulary-content ul li .description', function () {
    $('.list-vocabulary-content ul').find('.show-spelling').removeClass('show-spelling');
    $('.list-vocabulary-content ul').find('.active').removeClass('active');
    $(this).addClass('active');
})

$(document).on('change', '#list-vocabulary-option', function () {
    $('.list-vocabulary-content ul').empty();
    if ($(this).val() === 'all') {
        vocabulary.map(item => {
            let strDescription = '';
            if (item.description !== null) {
                strDescription = `<span class="description">-
                                    <span>${item.description}</span>
                                </span>`;
            }
            $('.list-vocabulary-content ul').append(
                `<li>
                    ${item.japanese}: ${item.translate} 
                    <span class="spelling">+
                        <span>${item.spelling}</span>
                    </span>
                    ${strDescription}
                </li>`);
        });
    }
    vocabulary.map(item => {
        value = item.topic == null ? 'null' : item.topic;
        if (value === $(this).val()) {
            let strDescription = '';
            if (item.description !== null) {
                strDescription = `<span class="description">-
                                    <span>${item.description}</span>
                                </span>`;
            }
            $('.list-vocabulary-content ul').append(
                `<li>
                    ${item.japanese}: ${item.translate} 
                    <span class="spelling">+
                        <span>${item.spelling}</span>
                    </span>
                    ${strDescription}
                </li>`);
        }
    });
})

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

$('.list-vocabulary-title').click(function () {
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