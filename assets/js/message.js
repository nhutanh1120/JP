// Hàm toast để hiển thị thông báo
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    // Lấy phần tử chính của toast từ DOM
    const main = document.getElementById("toast");

    // Kiểm tra nếu tồn tại phần tử toast
    if (main) {
        // Tạo một phần tử toast mới
        const toast = document.createElement("div");

        // Tự động xóa toast sau khoảng thời gian duration
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Xóa toast khi được click
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        // Định nghĩa các biểu tượng cho các loại toast khác nhau
        const icons = {
            success: "bx bx-check-circle bx-sm",
            info: "bx bx-info-circle bx-sm",
            warning: "bx bx-error-circle bx-sm",
            error: "bx bx-error-circle bx-sm",
        };

        // Lấy biểu tượng cho loại toast
        const icon = icons[type];

        // Tính toán thời gian delay theo giây
        const delay = (duration / 1000).toFixed(2);

        // Thêm các lớp và hiệu ứng cho toast
        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        // Thiết lập nội dung của toast
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class='bx bx-x bx-sm'></i>
            </div>
        `;

        // Thêm toast vào trong phần tử chính
        main.appendChild(toast);
    }
}
