var vocabulary;
var lstFilterVocabulary;
var global;
var countError = 0;
var countSuccess = 0;

fetch('./../json/data/topic.json')
    .then(response => response.json())
    .then(lstTopic => {
        fetch('./../json/data/vocabulary.json')
            .then(response => response.json())
            .then(result => {
                randomVocabulary(result);

                // append option all
                $('#list-vocabulary-option').append(`<option value='all'>Tất cả (${result.length})</option>`);
                $('#topic').append('<option value="all" selected>Tất cả</option>');

                const listTopic = uniqueTopic(result);

                listTopic.sort(function (a, b) { return a - b });
                swapFirstToLast(listTopic, 0, listTopic.length);

                listTopic.slice(1).map((topic) => {
                    let arrTopic = result.filter(item => item.topic == topic);
                    let titleName = lstTopic[0][topic];
                    if (topic !== null) {
                        $('#list-vocabulary-option').append(`<option value='${topic}'>${titleName} (${arrTopic.length})</option>`);
                        $('#topic').append(`<option value='${topic}'>${titleName}</option>`);
                    } else {
                        $('#list-vocabulary-option').append(`<option value='${topic}'>${titleName} (${arrTopic.length})</option>`);
                        $('#topic').append(`<option value='${topic}'>${titleName}</option>`);
                    }
                })

                // render all vocabulary items
                result.map(item => {
                    let strDescription = '';
                    let special = item.special !== null ? '<span style="color: red">*</span>' : '';
                    if (item.description !== null) {
                        strDescription = `<span class="description">-
                                            <span>${item.description}</span>
                                        </span>`;
                    }
                    $('.list-vocabulary-content ul').append(
                        `<li>
                            ${item.japanese}: ${item.translate} ${special}
                            <span class="spelling">+
                                <span>${item.spelling}</span>
                            </span>
                            ${strDescription}
                        </li>`);
                });

                // set list vocabulary
                vocabulary = result;
                lstFilterVocabulary = result;
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
            let special = item.special !== null ? '<span style="color: red">*</span>' : '';
            if (item.description !== null) {
                strDescription = `<span class="description">-
                                    <span>${item.description}</span>
                                </span>`;
            }
            $('.list-vocabulary-content ul').append(
                `<li>
                    ${item.japanese}: ${item.translate} ${special}
                    <span class="spelling">+
                        <span>${item.spelling}</span>
                    </span>
                    ${strDescription}
                </li>`);
        });
    }
    let value = $(this).val() === 'null' ? null : $(this).val();
    vocabulary.map(item => {
        if (value == item.topic) {
            let strDescription = '';
            let special = item.special !== null ? '<span style="color: red">*</span>' : '';
            if (item.description !== null) {
                strDescription = `<span class="description">-
                                    <span>${item.description}</span>
                                </span>`;
            }
            $('.list-vocabulary-content ul').append(
                `<li>
                    ${item.japanese}: ${item.translate} ${special}
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
        message(check, true);
    }
})

$('#result').click(function () {
    let value = $('#topic').val() === 'null' ? null : $('#topic').val();
    if (value === 'all') {
        randomVocabulary(vocabulary);
    } else {
        let lstData = filterVocabulary(value);
        randomVocabulary(lstData);
    }
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
        randomVocabulary(lstFilterVocabulary);
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
    handleResult();
});

$('.list-vocabulary-title').click(function () {
    $(".list-vocabulary-content").slideToggle('fast');
});

$('#topic').change(function () {
    let value = $(this).val() == 'null' ? null : $(this).val();
    let lstData = filterVocabulary(value);
    randomVocabulary(lstData);
});

$(document).keyup(function (event) {
    let value = $('#topic').val() === 'null' ? null : $('#topic').val();
    switch (event.which) {
        case 32:
            handleResult();
            $('#vocabulary-input').val('');
            break;
        case 37:
            if (value === 'all') {
                randomVocabulary(vocabulary);
            } else {
                let lstData = filterVocabulary(value);
                randomVocabulary(lstData);
            }
            break;
        case 38:
            handleSelectType(true, '#topic');
            break;
        case 39:
            if (value === 'all') {
                randomVocabulary(vocabulary);
            } else {
                let lstData = filterVocabulary(value);
                randomVocabulary(lstData);
            }
            break;
        case 40:
            handleSelectType(false, '#topic');
            break;
        default:
            break;
    }
})

const filterVocabulary = (topic) => {
    lstFilterVocabulary = vocabulary.filter(item => item.topic == topic);
    return lstFilterVocabulary;
}

const handleResult = () => {
    $('.vocabulary-result-view').addClass('success');
    if (global.length === undefined) {
        $('.vocabulary-result-view').html(`<span>${global.translate}: ${global.japanese}, phiên âm: ${global.spelling}</span>`);
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

const uniqueTopic = (arr) => {
    let arrTopic = [];
    arr.filter((item) => {
        return arrTopic.includes(item.topic) ? '' : arrTopic.push(item.topic);
    });
    return arrTopic;
}

const swapFirstToLast = (array, a, b) => {
    array[b] = array[a];
}