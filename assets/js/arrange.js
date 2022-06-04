var furigana;
var transfiguration;
$(function () {
    const fetchData = (url = 'transfiguration', type = null) => {
        fetch(`./../json/${url}.json`)
            .then(response => response.json())
            .then(result => {
                result.map((item) => {
                    $('.dropp').append(`<div class="dropp-items" data-id="${item.id}">
                                    <div class="character"></div>
                                    <span>${item.translate}</span>
                                </div>`);
                });
                result.sort(function (a, b) { return 0.5 - Math.random() });
                result.map((item) => {
                    let character;
                    switch (type) {
                        case 'katakana':
                            furigana = result;
                            character = item.katakana;
                            break;
                        case 'hiragana':
                            furigana = result;
                            character = item.hiragana;
                            break;
                        case 'kanji':
                            break;
                        default:
                            transfiguration = result;
                            character = item.transfiguration;
                            break;
                    }
                    $('.dragg').append(`<span class="dragg-data" class="ui-widget-content" data-id="${item.id}" data-name="${item.translate}">
                                            ${character}
                                        </span>`);
                });
                return true;
            })
            .then(result => {
                if (result == true) {
                    dragg();
                    dropp();
                }
            });
    }
    fetchData();

    $(document).bind('mousedown', '.dragg-data', function (event) {
        if (event.buttons == 2) {
            let character = event?.toElement?.innerText;
            event.preventDefault();
            if (typeof character !== 'undefined' && event?.toElement?.localName == 'span') {
                $(event.toElement).html(event.toElement.dataset.name);
                event.toElement.dataset.name = character;
            }
        }
    });

    $('.selector-title').click(function () {
        $(this).next().toggleClass('active');
    });

    $('.border-animation').click(function () {
        $(this).parent().find('.active').removeClass('active');
        $(this).toggleClass('active');
        $('.dropp').empty();
        $('.dragg').empty();
        if ($(this).data('type') == 'katakana' || $(this).data('type') == 'hiragana') {
            fetchData('furigana', $(this).data('type'));
        } else {
            fetchData();
        }
        $('.selector-title').next().removeClass('active');
    });
});

const dragg = () => {
    $('.dragg-data').draggable({
        revert: function (event) {
            if (event == false) {
                return false;
            }
            if (event.data('id') == $(this).data('id')) {
                $(this).remove();
                return false;
            }
            return true;
        }
    });
}

const dropp = () => {
    $('.dropp-items').droppable({
        drop: function (event, ui) {
            if (ui.draggable.data('id') == $(this).data('id')) {
                $(this).addClass('ui-state-highlight');
                $(this).find('.character').html(ui.draggable[0].innerText);
            }
        }
    });
}