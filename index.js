document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); //chặn sự kiện reset trang khi submit
  let name = document.querySelector("#name").value;
  // tạo ra 1 đối tượng có giá trị là name
  // phải có id (dùng cho việc xóa) (id dùng new Date())
  let item = {
    id: new Date().toISOString(),
    name: name.trim(),
  };

  // THêm item vào giao diện
  addItemToUI(item);
  // Lưu lại item vào localStorage
  addItemToLS(item);
});

// getList(): hàm lấy `danh sách các item đã lưu` (list) trong localStorage
const getList = () => {
  // nếu trong localStorage đã có list thì return list ép về mảng bình thường, nếu không có thì return mảng rỗng
  return JSON.parse(localStorage.getItem("list")) || [];
};

// Hàm nhận vào một item và render lên màn hình
const addItemToUI = (item) => {
  let newCard = document.createElement("div");
  newCard.className =
    "card d-flex flex-row justify-content-between align-items-center p-2 mb-3";
  newCard.innerHTML = `
    <span>${item.name}</span>
    <button type="button" class="btn btn-danger btn-sm btn-remove" data-id="${item.id}">Remove</button>
`;
  document.querySelector(".list").appendChild(newCard);
};

// Hàm nhận vào 1 item và lưu vào localStorage
const addItemToLS = (item) => {
  let list = getList();
  list.push(item); // thêm item vào danh sách
  // Lưu lại danh sách lên localStorage
  //JSON.stringify: biến Object thành JSON
  //JSON.parse: biến JSON thành Object
  localStorage.setItem("list", JSON.stringify(list));
};

// Hàm render tất cả các item có trong list lên ui mỗi lần load trang
const init = () => {
  //lấy danh sách
  let list = getList();
  list.forEach((item) => {
    addItemToUI(item);
  });
};
init();

// Sự kiện xóa 1 item
// Không được dom vào những card giả
// Giải pháp: dom vào thằng cha và duyệt id, sự kiện click cho toàn bộ list nhưng chỉ xóa khi click vào remove
document.querySelector(".list").addEventListener("click", (event) => {
  // Nễu chỗ ta click là 1 element có class là btn-remove
  if (event.target.classList.contains("btn-remove")) {
    let nameItem = event.target.previousElementSibling.innerHTML;
    let isConfirmed = confirm(`Bạn có muốn xóa item: ${nameItem}`);
    if (isConfirmed) {
      // Xóa item trên UI
      let card = event.target.parentElement;
      card.remove();

      // Xóa item trên LS (để khi reset trang thì nó mất luôn trên UI)
      let idRemove = event.target.dataset.id;
      removeItemFromLS(idRemove);
    }
  }
});
// Hàm xóa item trên LS
// Hàm nhận vào id cần xóa và xóa item có id tương ứng trong ls
const removeItemFromLS = (idRemove) => {
  let list = getList();
  //filter là method có sẵn của mảng
  list = list.filter((item) => item.id != idRemove);
  localStorage.setItem("list", JSON.stringify(list));
};

// Sự kiện click removeAll
document.querySelector("#btn-remove-all").addEventListener("click", (event) => {
  const isConfirmed = confirm("Bạn có chắc là muốn xóa tất cả Không?");
  if (isConfirmed) {
    // Cập nhật UI
    document.querySelector(".list").innerHTML = "";

    // Cập nhật LS
    localStorage.removeItem("list");
  }
});

// Sự kiện nhập filter
document.querySelector("#filter").addEventListener("keyup", (event) => {
  const valueInput = event.target.value;
  // Lấy danh sách để filter
  let list = getList();
  // Filter những item trong list có chứa valueInput
  let filterList = list.filter((item) => item.name.includes(valueInput));
  document.querySelector(".list").innerHTML = ""; // xóa trước khi hiển thị danh sách đã lọc
  // render ra danh sách vừa lọc
  filterList.forEach((item) => {
    addItemToUI(item);
  });
});
