// Khai báo biến global để lưu trữ dữ liệu
let furigana;
let transfiguration;
let ligatures;

// Hàm để lấy dữ liệu từ API và cập nhật giao diện
const fetchData = async (url = "transfiguration", type = null) => {
    try {
        // Fetch dữ liệu từ API
        const response = await fetch(`./../json/data/${url}.json`);
        const result = await response.json();

        // Xóa nội dung hiện tại trong ".dropp" và ".dragg"
        $(".dropp, .dragg").empty();

        // Thêm các phần tử vào ".dropp"
        result.forEach((item) => {
            $(".dropp").append(`<div class="dropp-items" data-id="${item.id}">
                                    <div class="character"></div>
                                    <span>${item.translate}</span>
                                </div>`);
        });

        // Sắp xếp ngẫu nhiên mảng kết quả
        result.sort(() => 0.5 - Math.random());

        // Thêm các phần tử vào ".dragg"
        result.forEach((item) => {
            let character;

            // Thiết lập biến global tương ứng với loại
            switch (type) {
                case "katakana":
                    furigana = result;
                    character = item.katakana;
                    break;
                case "hiragana":
                    furigana = result;
                    character = item.hiragana;
                    break;
                case "kanji":
                    // Xử lý khi loại là kanji (nếu cần)
                    break;
                case "ligatures":
                    ligatures = result;
                    character = item.hiragana;
                    break;
                default:
                    transfiguration = result;
                    character = item.transfiguration;
                    break;
            }

            // Thêm các phần tử vào ".dragg"
            $(".dragg")
                .append(`<span class="dragg-data ui-widget-content" data-id="${item.id}" data-name="${item.translate}">
                                        ${character}
                                    </span>`);
        });

        // Gọi hàm dragg và dropp để kích hoạt draggable và droppable
        dragg();
        dropp();

        return true;
    } catch (error) {
        console.error("Error fetching data:", error);
        return false;
    }
};

// Gọi hàm fetchData khi trang web được tải
fetchData();

// Hàm để xử lý sự kiện mousedown trên ".dragg-data"
$(document).on("mousedown", ".dragg-data", function (event) {
    if (event.buttons == 2) {
        let character = event?.toElement?.innerText;
        event.preventDefault();
        if (typeof character !== "undefined" && event?.toElement?.localName == "span") {
            $(event.toElement).html(event.toElement.dataset.name);
            event.toElement.dataset.name = character;
        }
    }
});

// Hàm để xử lý sự kiện click trên ".selector-title"
$(".selector-title").click(function () {
    $(this).next().toggleClass("active");
});

// Hàm để xử lý sự kiện click trên ".border-animation"
$(".border-animation").click(function () {
    // Loại bỏ class "active" từ các phần tử cha
    $(this).parent().find(".active").removeClass("active");

    // Thêm class "active" vào phần tử được click
    $(this).toggleClass("active");

    // Lấy loại từ data-type của phần tử được click
    const dataType = $(this).data("type");

    // Gọi hàm fetchData với loại tương ứng
    if (dataType == "katakana" || dataType == "hiragana") {
        fetchData("furigana", dataType);
    } else if (dataType == "ligatures") {
        fetchData("ligatures", "ligatures");
    } else {
        fetchData();
    }

    // Loại bỏ class "active" từ phần tử tiếp theo của ".selector-title"
    $(".selector-title").next().removeClass("active");
});

const dragg = () => {
    $(".dragg-data").draggable({
        revert: function (event, ui) {
            // Kiểm tra nếu sự kiện trả về false thì trả về false
            if (event === false) {
                return false;
            }

            // Kiểm tra nếu data-id của sự kiện bằng với data-id của phần tử hiện tại
            if (event.data("id") == $(this).data("id")) {
                $(this).remove(); // Xóa phần tử hiện tại nếu có sự kiện trùng data-id
                return false;
            }
            return true;
        },
    });
};

const dropp = () => {
    $(".dropp-items").droppable({
        drop: function (event, ui) {
            // Kiểm tra nếu data-id của phần tử kéo bằng với data-id của phần tử thả
            if (ui.draggable.data("id") == $(this).data("id")) {
                $(this).addClass("ui-state-highlight");
                $(this).find(".character").html(ui.draggable[0].innerText);
            }
        },
    });
};

// Bắt sự kiện cuộn để hiển thị/ẩn phần tử "hand-up"
window.addEventListener("scroll", function () {
    const handUpElement = document.getElementById("hand-up");
    if (window.pageYOffset > 200) {
        handUpElement.style.right = "40px";
        handUpElement.style.opacity = "0.9";
    } else {
        handUpElement.style.right = "-60px";
    }
});
