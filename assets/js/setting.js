$('.setting-icon').click(function() {
    $(this).find('i').toggleClass('bx-spin');
    $(this).next().toggleClass('active');
})

document.oncontextmenu = (event) => {
    event.preventDefault();
    return false;
}