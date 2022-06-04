document.oncontextmenu = (event) => {
    event.preventDefault();
    return false;
}
$(function () {
    (() => {
        $('#loader').css({ 'display': 'none' });
        const currentStatus = localStorage.getItem('darkmode');
        if (currentStatus) {
            document.documentElement.setAttribute('data-theme', currentStatus);
            setTimeout(function () {
                if (currentStatus === 'dark' && $('lord-icon').attr('src')) {
                    $('lord-icon').attr({ 'colors': 'primary:#fff' });
                }
            }, 2000);
        }
    })();
});

$('.setting-icon').click(function () {
    $(this).find('i').toggleClass('bx-spin');
    $(this).next().toggleClass('active');
})

$('#slidebar').click(function () {
    const currentStatus = localStorage.getItem('darkmode');
    if (currentStatus === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkmode', 'dark');
        $('lord-icon').attr({ 'colors': 'primary:#fff' });
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('darkmode', 'light');
        $('lord-icon').attr({ 'colors': '' });
    }
});