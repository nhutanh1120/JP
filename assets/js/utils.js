const search = (keyword) => {
    // Khởi tạo đối tượng kết quả
    const result = {
        success: true,
        data: "",
    };

    // Định nghĩa các biểu thức chính quy cho kiểm tra kiểu
    const alphabet = /^[a-zA-Z0-9\s]+$/;
    const hiragana = /^[ぁ-んァ-ン]+$/;

    // Khởi tạo mảng từ khóa và kiểu tìm kiếm
    let arrKeywords = [];
    let type = "";

    // Kiểm tra kiểu từ khóa và phân tách thành mảng
    if (alphabet.test(keyword)) {
        type = "alphabet";
        arrKeywords = keyword.trim().split(" ");
    } else if (hiragana.test(keyword)) {
        type = "hiragana";
        arrKeywords = [...keyword.trim()];
    }

    // Thực hiện tìm kiếm dựa trên từng từ khóa
    if (type !== "") {
        unique(arrKeywords).map((item) => {
            result.data += searchByChar(item, type);
        });
    }

    // Kiểm tra nếu không tìm thấy dữ liệu
    if (!result.data) {
        result.success = false;
        result.data = "<span>Không tìm thấy dữ liệu!</span>";
    }

    // Trả về kết quả
    return result;
};

function unique(arr) {
    // Sử dụng Set để lọc giá trị duy nhất
    const uniqueSet = new Set(arr);

    // Chuyển Set thành mảng
    const newArr = [...uniqueSet];

    // Trả về mảng mới chứa các giá trị duy nhất
    return newArr;
}

const handleSelectType = (button, element) => {
    // Lấy tùy chọn hiện tại đang được chọn
    let key = $(element + " option:selected");
    key.prop("selected", false); // Bỏ chọn tùy chọn hiện tại

    // Lấy tất cả tùy chọn
    const options = $(element + " option");
    const lastIndex = options.length - 1;

    // Xác định tùy chọn tiếp theo dựa trên hướng của nút
    if (button) {
        const prevOption = key.prev()[0] || options.eq(lastIndex)[0];
        $(prevOption).prop("selected", true); // Chọn tùy chọn trước đó hoặc cuối cùng nếu không có trước đó
    } else {
        const nextOption = key.next()[0] || options.eq(0)[0];
        $(nextOption).prop("selected", true); // Chọn tùy chọn tiếp theo hoặc đầu tiên nếu không có tiếp theo
    }
};

// Hàm tìm kiếm theo ký tự
const searchByChar = (keyword, type) => {
    let result = "";

    // Hàm tìm kiếm trong mảng và thêm kết quả vào biến result
    const searchInArray = (array, keyField, additionalFields) => {
        if (array) {
            array.forEach((item) => {
                // Tìm kiếm dựa trên từ khóa
                if (item[keyField].toLowerCase().includes(keyword.toLowerCase())) {
                    // Thêm kết quả vào biến result
                    result += `<span>${item.translate}: ${additionalFields
                        .map((field) => item[field])
                        .join(", ")}</span>`;
                }
            });
        }
    };

    // Tìm kiếm dựa trên loại
    if (type === "alphabet") {
        // Tìm kiếm trong furigana và thêm vào result
        searchInArray(furigana, "translate", ["katakana", "hiragana"]);

        // Tìm kiếm trong transfiguration và thêm vào result
        searchInArray(transfiguration, "translate", ["transfiguration"]);
    } else if (type === "hiragana") {
        // Tìm kiếm trong furigana và thêm vào result
        searchInArray(furigana, "katakana", ["katakana", "hiragana"]);

        // Tìm kiếm trong transfiguration và thêm vào result
        searchInArray(transfiguration, "transfiguration", ["transfiguration"]);
    }

    return result;
};
