$("#btn-close").click(function () {
    $(this).parents(".sidebar").toggleClass("open");
    $(this).toggleClass("bx bx-menu");
    $(this).toggleClass("bx bx-menu-alt-right");
});

$(".section-search-input input").keyup(async function () {
    const $searchIcon = $(this).next();
    const $searchResult = $(this).parent().parent().find(".search-result");

    // Thay đổi biểu tượng tìm kiếm/xóa
    $searchIcon.removeClass("bx-search").addClass("bx-x");

    // Hiển thị kết quả tìm kiếm và làm trống nội dung
    $searchResult.addClass("active").empty();

    let keyword = $(this).val().replace(/^\s/g, "");

    if (keyword === "") {
        // Nếu từ khóa trống, trả lại và đặt giá trị của ô nhập liệu
        $(this).val(keyword);
        return;
    }

    let result = await search(keyword);

    // Hiển thị kết quả tìm kiếm
    $searchResult.append(result.data);

    if (result.success === false) {
        $searchResult.addClass("data-none");
    } else {
        $searchResult.removeClass("data-none");
    }
});

$("#close-search").click(function () {
    // Loại bỏ lớp CSS 'bx-x' và thêm lớp 'bx-search' để thay đổi biểu tượng
    $(this).removeClass("bx-x").addClass("bx-search");

    // Tìm phần tử cha và loại bỏ lớp 'active'
    $(this).parent().next().removeClass("active");

    // Làm trống nội dung và giá trị ô nhập liệu
    $(this).parent().next().empty().prev().val("");
});
