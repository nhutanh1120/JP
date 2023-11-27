window.onload = function () {
    // Định nghĩa các phần tử trên trang
    var canvas = document.getElementById("paint-canvas");
    var context = canvas.getContext("2d");
    var canvasBounds = canvas.getBoundingClientRect();

    // Đặt giá trị mặc định cho tọa độ chuột
    var mouseX = 0;
    var mouseY = 0;

    // Màu sắc và độ dày bút mặc định
    context.strokeStyle = "black";
    context.lineWidth = 1;

    // Trạng thái vẽ
    var isDrawing = false;

    // Xử lý sự kiện chọn màu
    var colorPalette = document.getElementsByClassName("colors")[0];
    colorPalette.addEventListener("click", function (event) {
        context.strokeStyle = event.target.value || "black";
    });

    // Xử lý sự kiện chọn độ dày bút
    var brushOptions = document.getElementsByClassName("brushes")[0];
    brushOptions.addEventListener("click", function (event) {
        context.lineWidth = event.target.value || 1;
    });

    // Sự kiện nhấn chuột để bắt đầu vẽ
    canvas.addEventListener("mousedown", function (event) {
        updateMouseCoordinates(event);
        isDrawing = true;

        // Bắt đầu vẽ
        context.beginPath();
        context.moveTo(mouseX, mouseY);
    });

    // Sự kiện di chuyển chuột để vẽ
    canvas.addEventListener("mousemove", function (event) {
        updateMouseCoordinates(event);

        if (isDrawing) {
            context.lineTo(mouseX, mouseY);
            context.stroke();
        }
    });

    // Sự kiện nhả chuột để kết thúc vẽ
    canvas.addEventListener("mouseup", function (event) {
        updateMouseCoordinates(event);
        isDrawing = false;
    });

    // Hàm cập nhật tọa độ chuột
    function updateMouseCoordinates(event) {
        mouseX = event.clientX - canvasBounds.left;
        mouseY = event.clientY - canvasBounds.top;
    }

    // Xử lý sự kiện nút Xóa
    var clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Xử lý sự kiện nút Lưu
    var saveButton = document.getElementById("save");
    saveButton.addEventListener("click", function () {
        var imageName = prompt("Vui lòng nhập tên ảnh");
        var canvasDataURL = canvas.toDataURL();
        var downloadLink = document.createElement("a");
        downloadLink.href = canvasDataURL;
        downloadLink.download = imageName || "drawing";
        downloadLink.click();
    });
};
