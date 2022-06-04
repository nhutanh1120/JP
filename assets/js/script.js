$('#btn-close').click(function () {
    $(this).parents('.sidebar').toggleClass('open');
    $(this).toggleClass('bx bx-menu');
    $(this).toggleClass('bx bx-menu-alt-right');
})

$('.section-search-input input').keyup(async function () {
    $(this).next().removeClass('bx-search');
    $(this).next().addClass('bx-x');
    $(this).parent().parent().find('.search-result').addClass('active');
    $(this).parent().parent().find('.search-result').empty();
    let keyword = $(this).val().replace(/^\s/g, "");
    if (keyword === '') {
        $(this).val(keyword);
        return;
    }
    let result = await search(keyword);
    $(this).parent().parent().find('.search-result').append(result.data);
    if (result.success === false) {
        $(this).parent().parent().find('.search-result').addClass('data-none');
    } else {
        $(this).parent().parent().find('.search-result').removeClass('data-none');
    }
})

$('#close-search').click(function () {
    $(this).removeClass('bx-x');
    $(this).addClass('bx-search');
    $(this).parent().next().removeClass('active');
    $(this).parent().next().empty();
    $(this).prev().val('');
})