const search = (keyword) => {
    let result = {
        success: true,
        data: ''
    };
    const alphabet = /^[a-zA-Z0-9\s]+$/;
    const hiragana = /^[ぁ-んァ-ン]+$/;
    let arrKeywords = [];
    let type = '';
    if (alphabet.test(keyword) == true) {
        type = 'alphabet';
        arrKeywords = keyword.trim().split(" ");
    } else if (hiragana.test(keyword) == true) {
        type = 'hiragana';
        arrKeywords = keyword.trim().split("");
    }

    if (type !== '') {
        unique(arrKeywords).map(item => {
            let stringResult = searchByChar(item, type);
            result.data = result.data + stringResult;
        })
    }
    if (result.data === '') {
        result.success = false;
        result.data = '<span>Không tìm thấy dử liệu!</span>';
    }
    return result;
}

function unique(arr) {
    var newArr = [];
    newArr = arr.filter(function (item) {
        return newArr.includes(item) ? '' : newArr.push(item);
    })
    return newArr;
}

const handleSelectType = (button, element) => {
    let key = $(element + ' option:selected');
    key.attr('selected', false);
    if (button == true) {
        if (typeof key.prev()[0] !== 'undefined') {
            key.prev().attr('selected', true);
        } else {
            $(element + ' option').eq($(element + ' option').length - 1).attr('selected', true);
        }
    } else {
        if (typeof key.next()[0] !== 'undefined') {
            key.next().attr('selected', true);
        } else {
            $(element + ' option').eq(0).attr('selected', true);
        }
    }
}