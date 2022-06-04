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

const searchByChar = (keyword, type) => {
    let result = '';
    if (type == 'alphabet') {
        if(typeof furigana !== 'undefined') {
            furigana.map((item) => {
                if (item.translate.toLowerCase().search(keyword.toLowerCase()) !== -1) {
                    result = result + `<span>${item.translate}: ${item.katakana}, ${item.hiragana}</span>`;
                }
            });
        }
        if(typeof transfiguration !== 'undefined') {
            transfiguration.map((item) => {
                if (item.translate.toLowerCase().search(keyword.toLowerCase()) !== -1) {
                    result = result + `<span>${item.translate}: ${item.transfiguration}</span>`;
                }
            });
        }
    } else if (type == 'hiragana') {
        furigana.map((item) => {
            if (item.katakana.search(keyword) !== -1 || item.hiragana.search(keyword) !== -1) {
                result = result + `<span>${item.translate}: ${item.katakana}, ${item.hiragana}</span>`;
            }
        });
        transfiguration.map((item) => {
            if (item.transfiguration.search(keyword) !== -1) {
                result = result + `<span>${item.translate}: ${item.transfiguration}</span>`;
            }
        });
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