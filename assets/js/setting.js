document.oncontextmenu = (event) => {
    event.preventDefault();
    return false;
};

$(function () {
    // Ẩn loader khi trang web được tải
    $("#loader").css({ display: "none" });

    // Kiểm tra trạng thái chủ đề hiện tại từ localStorage
    const currentStatus = localStorage.getItem("darkmode");
    if (currentStatus) {
        // Đặt chủ đề dựa trên giá trị từ localStorage
        document.documentElement.setAttribute("data-theme", currentStatus);

        // Nếu chủ đề là tối và có hình ảnh lord-icon, thay đổi màu sắc
        setTimeout(function () {
            if (currentStatus === "dark" && $("lord-icon").attr("src")) {
                $("lord-icon").attr({ colors: "primary:#fff" });
            }
        }, 2000);
    }
});

$(".setting-icon").click(function () {
    // Xoay biểu tượng khi nhấp vào
    $(this).find("i").toggleClass("bx-spin");
    // Chuyển đổi trạng thái của phần cài đặt (thêm/loại bỏ lớp 'active')
    $(this).next().toggleClass("active");
});

$("#slidebar").click(function () {
    // Lấy trạng thái chủ đề hiện tại từ localStorage
    const currentStatus = localStorage.getItem("darkmode");
    // Đảo ngược chủ đề và cập nhật localStorage
    const newStatus = currentStatus === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newStatus);
    localStorage.setItem("darkmode", newStatus);
    // Cập nhật màu sắc cho lord-icon nếu đang trong chủ đề tối
    if (newStatus === "dark" && $("lord-icon").attr("src")) {
        $("lord-icon").attr({ colors: "primary:#fff" });
    } else {
        $("lord-icon").attr({ colors: "" });
    }
});
