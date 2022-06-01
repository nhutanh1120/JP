(() => {
    const currentStatus = localStorage.getItem('darkmode');
    if (currentStatus) {
        document.documentElement.setAttribute('data-theme', currentStatus);
    }
})();

document.oncontextmenu = (event) => {
    event.preventDefault();
    return false;
}

$('.setting-icon').click(function () {
    $(this).find('i').toggleClass('bx-spin');
    $(this).next().toggleClass('active');
})

$('#slidebar').click(function () {
    const currentStatus = localStorage.getItem('darkmode');
    if (currentStatus === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkmode', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('darkmode', 'light');
    }
});