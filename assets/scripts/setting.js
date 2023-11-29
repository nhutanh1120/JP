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

// Hàm cập nhật đồng hồ
function updateClock() {
    // Lấy thời gian hiện tại
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Lấy các phần tử của kim đồng hồ
    const hourElement = $("#hour");
    const minuteElement = $("#minute");
    const secondElement = $("#second");

    // Tính góc xoay cho từng kim
    const hourRotation = ((hours + minutes / 60) * 360) / 12 + 90; // Mỗi giờ tương ứng với 30 độ
    const minuteRotation = ((minutes + seconds / 60) * 360) / 60 + 90; // Mỗi phút tương ứng với 6 độ
    const secondRotation = (seconds * 360) / 60 + 90; // Mỗi giây tương ứng với 6 độ

    // Áp dụng góc xoay bằng cách thay đổi thuộc tính transform của từng kim
    hourElement.css("transform", `rotate(${hourRotation}deg)`);
    minuteElement.css("transform", `rotate(${minuteRotation}deg)`);
    secondElement.css("transform", `rotate(${secondRotation}deg)`);

    // Lấy phần tử hiển thị thời gian
    const clockElement = $("#clock-footer");
    // Hiển thị thời gian dưới định dạng hh:mm:ss
    clockElement.text(`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
}

// Hàm định dạng thời gian để hiển thị số đầu tiên có thêm số 0 nếu nhỏ hơn 10
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Cập nhật đồng hồ mỗi giây
setInterval(updateClock, 1000);
// Gọi hàm cập nhật đồng hồ để đặt trạng thái ban đầu
updateClock();
