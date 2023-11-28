var vocabulary;
var lstFilterVocabulary;
var currentVocabulary;
var countError = 0;
var countSuccess = 0;
var listTopic;

// Fetch dữ liệu từ tệp vocabulary.json cùng một lúc
fetch("./../json/data/vocabulary.json")
    .then((response) => response.json())
    .then((result) => {
        randomVocabulary(result);

        const listVocabularyOption = $("#list-vocabulary-option");
        const topicDropdown = $("#topic");
        const listVocabularyContent = $(".list-vocabulary-content ul");

        // Lấy danh sách các chủ đề duy nhất từ kết quả
        listTopic = sortByTopic(result);

        // Thêm các tùy chọn chủ đề vào dropdown
        listTopic.forEach((obj, index) => {
            // Thêm tùy chọn chủ đề vào dropdown
            listVocabularyOption.append(`<option value='${index}'>${obj.titleName} (${obj.titleCount})</option>`);
            topicDropdown.append(`<option value='${index}'>${obj.titleName}</option>`);
        });

        // Hiển thị tất cả các mục từ vựng
        result.forEach((item) => {
            let strDescription = "";
            let special = item.special !== null ? '<span style="color: red">*</span>' : "";
            if (item.description !== null) {
                strDescription = `<span class="description">-
                                <span>${item.description}</span>
                            </span>`;
            }

            // Thêm từng mục từ vựng vào danh sách từ vựng
            listVocabularyContent.append(
                `<li>
                ${item.japanese}: ${item.translate} ${special}
                <span class="spelling">+
                    <span>${item.spelling}</span>
                </span>
                ${strDescription}
            </li>`,
            );
        });

        // Thiết lập danh sách từ vựng
        vocabulary = result;
        lstFilterVocabulary = result;
    })
    .catch((error) => {
        console.error("Error fetching vocabulary data:", error);
    });

// Đăng ký sự kiện click cho các phần tử có class ".spelling" trong danh sách từ vựng
$(document).on("click", ".list-vocabulary-content ul li .spelling", function () {
    const listVocabularyContent = $(".list-vocabulary-content ul");
    const allShowSpelling = listVocabularyContent.find(".show-spelling");
    const allActive = listVocabularyContent.find(".active");

    allShowSpelling.removeClass("show-spelling");
    allActive.removeClass("active");

    $(this).addClass("show-spelling");
});

$(document).on("click", ".list-vocabulary-content ul li .description", function () {
    const listVocabularyContent = $(".list-vocabulary-content ul");
    listVocabularyContent.find(".show-spelling").removeClass("show-spelling");
    listVocabularyContent.find(".active").removeClass("active");

    $(this).addClass("active");
});

$(document).on("change", "#list-vocabulary-option", function () {
    // Lưu trữ tham chiếu đến danh sách từ vựng
    const listVocabularyContent = $(".list-vocabulary-content ul");

    // Xóa nội dung hiện tại của danh sách từ vựng
    listVocabularyContent.empty();

    // Lấy giá trị được chọn từ dropdown
    const selectedValue = $(this).val();

    // Lọc từ vựng dựa trên giá trị được chọn
    const filteredVocabulary =
        selectedValue === "0"
            ? vocabulary
            : vocabulary.filter((item) => item.topic === listTopic[selectedValue].titleName);

    // Lặp qua từng từ vựng trong danh sách đã lọc và thêm chúng vào danh sách từ vựng hiển thị
    filteredVocabulary.forEach((item) => {
        // Tạo biến strDescription chứa mô tả nếu tồn tại
        const strDescription = item.description
            ? `<span class="description">-<span>${item.description}</span></span>`
            : "";

        // Tạo biến special chứa dấu * nếu từ vựng đặc biệt
        const special = item.special ? '<span style="color: red">*</span>' : "";

        // Thêm từ vựng vào danh sách từ vựng hiển thị
        listVocabularyContent.append(
            `<li>
                ${item.japanese}: ${item.translate} ${special}
                <span class="spelling">+
                    <span>${item.spelling}</span>
                </span>
                ${strDescription}
            </li>`,
        );
    });
});

$("#vocabulary-input").keyup(function (event) {
    const value = $(this).val().trim();

    // Kiểm tra nếu giá trị trống
    if (value === "") {
        return;
    }

    const vocabularyResultView = $(".vocabulary-result-view");
    vocabularyResultView.removeClass("success").empty();

    // Kiểm tra xem currentVocabulary  có phải là mảng hay không
    const result = Array.isArray(currentVocabulary) ? currentVocabulary.find((item) => item.japanese === value) : null;

    // Kiểm tra giá trị nhập có phù hợp với currentVocabulary  hay không
    const check = value === currentVocabulary.japanese || (result !== undefined && result !== null);

    // Nếu nhấn phím Enter, gọi hàm message
    if (event.which === 13) {
        message(check, true);
    }
});

// Xử lý sự kiện khi click vào phần tử có id là "result"
$("#result").click(function () {
    // Lấy giá trị hiện tại của dropdown có id là "topic"
    const value = $("#topic").val();

    // Tạo danh sách dữ liệu để truyền vào hàm randomVocabulary
    const lstData = value === "0" || value === null ? vocabulary : filterVocabulary(value);

    // Gọi hàm randomVocabulary với danh sách dữ liệu đã xác định
    randomVocabulary(lstData);
});

// Hàm chọn một từ vựng ngẫu nhiên từ một mảng
const randomVocabulary = (array) => {
    // Tạo một số ngẫu nhiên từ 0 đến độ dài của mảng
    const id = Math.floor(Math.random() * array.length);

    // Lấy đối tượng từ vựng tại vị trí ngẫu nhiên
    const objectVocabulary = array[id];

    // Kiểm tra và lọc từ vựng có thuộc tính synonyms không và không phải là null
    currentVocabulary =
        objectVocabulary.synonyms !== null
            ? array.filter((item) => item.synonyms === objectVocabulary.synonyms && item.synonyms !== null)
            : objectVocabulary;

    // Hiển thị từ vựng được chọn lên giao diện
    $("#vocabulary-text").text(objectVocabulary.translate);

    // Trả về đối tượng từ vựng được chọn
    return objectVocabulary;
};

const message = (data, value) => {
    // Tạo hàm innerMessage để tái sử dụng code hiển thị toast
    const innerMessage = (title, message, type, duration) => {
        toast({
            title,
            message,
            type,
            duration,
        });
    };

    // Kiểm tra và hiển thị toast thông báo khi nhập đúng hoặc sai
    if (data === value) {
        countError = 0;
        countSuccess++;

        innerMessage("Chính xác!", "Bạn đã nhập chính xác.", "success", 5000);

        // Kiểm tra và hiển thị toast thông báo nếu số lần nhập đúng là bội số của 5
        if (countSuccess % 5 === 0) {
            setTimeout(function () {
                innerMessage("Giỏi quá!", `Bạn đã nhập đúng ${countSuccess} từ liên tiếp.`, "info", 5000);
            }, 1000);
        }
        // Gọi hàm randomVocabulary và làm sạch dữ liệu
        randomVocabulary(lstFilterVocabulary);
        $("#vocabulary-input").val("");
        $(".vocabulary-result-view").empty();
        $(".vocabulary-result-view").removeClass("success");
    } else {
        countSuccess = 0;
        countError++;

        innerMessage("Sai rồi!", "Từ bạn nhập không chính xác.", "error", 5000);

        // Kiểm tra và hiển thị toast thông báo nếu số lần nhập sai là bội số của 5
        if (countError % 5 === 0) {
            setTimeout(function () {
                innerMessage("Thông tin!", `Bạn đã nhập sai ${countError} từ liên tiếp.`, "warning", 5000);
            }, 1000);
        }
    }
};

$("#view-result").click(function () {
    handleResult();
});

$(".list-vocabulary-title").click(function () {
    $(".list-vocabulary-content").slideToggle("fast");
});

// Bắt sự kiện khi giá trị của dropdown có id là "topic" thay đổi
$("#topic").change(function () {
    // Lấy giá trị hiện tại của dropdown và kiểm tra nếu là "null" thì gán giá trị null, ngược lại giữ nguyên giá trị
    const filteredValue = $(this).val() === "null" ? null : $(this).val();

    // Gọi hàm randomVocabulary với danh sách từ vựng đã được lọc
    randomVocabulary(filterVocabulary(filteredValue));
});

$(document).keyup(function (event) {
    // Lấy giá trị hiện tại của dropdown có id là "topic"
    const value = $("#topic").val();

    switch (event.which) {
        case 32:
            // Khi nhấn phím Space, gọi hàm xử lý kết quả và làm sạch ô nhập liệu
            handleResult();
            $("#vocabulary-input").val("");
            break;
        case 37:
        case 39:
            // Khi nhấn mũi tên trái (37) hoặc mũi tên phải (39),
            // gọi hàm randomVocabulary với dữ liệu đã lọc dựa trên giá trị dropdown
            if (value === "0") {
                randomVocabulary(vocabulary);
            } else {
                randomVocabulary(filterVocabulary(value));
            }
            break;
        case 38:
            // Khi nhấn mũi tên lên (38), gọi hàm handleSelectType với tham số là true và id là "topic"
            handleSelectType(true, "#topic");
            break;
        case 40:
            // Khi nhấn mũi tên xuống (40), gọi hàm handleSelectType với tham số là false và id là "topic"
            handleSelectType(false, "#topic");
            break;
        default:
            // Bất kỳ trường hợp nào khác không thực hiện hành động gì cả
            break;
    }
});

const filterVocabulary = (index) => {
    return vocabulary.filter((item) => item.topic == listTopic[index].titleName);
};

const handleResult = () => {
    const vocabularyResultView = $(".vocabulary-result-view");

    // Thêm lớp "success" vào thành phần chứa kết quả
    vocabularyResultView.addClass("success");

    // Kiểm tra xem currentVocabulary  có phải là một mảng hay không
    if (Array.isArray(currentVocabulary)) {
        // Nếu là mảng, xóa nội dung hiện tại của thành phần và thêm mỗi mục từ currentVocabulary
        vocabularyResultView.empty();
        currentVocabulary.forEach((item) =>
            vocabularyResultView.append(`<span>${item.translate}: ${item.japanese}</span>`),
        );
    } else {
        // Nếu không phải là mảng, thêm nội dung vào thành phần
        vocabularyResultView.html(
            `<span>${currentVocabulary.translate}: ${currentVocabulary.japanese}, phiên âm: ${currentVocabulary.spelling}</span>`,
        );
    }
};

// Hàm sắp xếp mảng theo các quy tắc
function sortByTopic(array) {
    // Lọc những phần tử có topic không phải là số
    const validTopics = array.filter((item) => typeof item.topic !== "number");

    // Kiểm tra nếu không có phần tử nào có topic không phải là số, trả về mảng rỗng
    if (validTopics.length === 0) {
        return [];
    }

    // Lấy danh sách các topic duy nhất
    const uniqueTopics = Array.from(new Set(validTopics.map((item) => item.topic)));

    // Sắp xếp topic theo quy tắc đặc biệt
    const sortedArray = uniqueTopics
        .sort((a, b) => {
            // Ưu tiên sắp xếp theo "Bài" và số theo thứ tự
            const topicA = a.startsWith("Bài") ? -1 : 1;
            const topicB = b.startsWith("Bài") ? -1 : 1;
            return topicA - topicB || Number(a.replace("Bài ", "")) - Number(b.replace("Bài ", ""));
        })
        .sort((a, b) => a.localeCompare(b)); // Sắp xếp theo thứ tự chữ cái

    // Tạo mảng kết quả với đối tượng có thuộc tính titleName và titleCount
    const resultArray = sortedArray.map((topic) => {
        const topicCount = array.filter((item) => item.topic === topic).length;
        return { titleName: topic, titleCount: topicCount };
    });

    // Thêm phần tử có topic là "Tất cả" và đưa lên đầu mảng
    resultArray.unshift({ titleName: "Tất cả", titleCount: array.length });

    // Trả về mảng kết quả
    return resultArray;
}
