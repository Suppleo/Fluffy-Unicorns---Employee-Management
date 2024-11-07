exports.seed = function (knex) {
  return knex("employees")
    .del()
    .then(function () {
      return knex("employees").insert([
        {
          fullname: "Nguyễn Văn An",
          email: "nguyenvanan@example.com",
          tel: "0901234567",
          address: "Hà Nội",
        },
        {
          fullname: "Trần Thị Bình",
          email: "tranthibinh@example.com",
          tel: "0902345678",
          address: "Hồ Chí Minh",
        },
        {
          fullname: "Lê Hoàng Cường",
          email: "lehoangcuong@example.com",
          tel: "0903456789",
          address: "Đà Nẵng",
        },
        {
          fullname: "Phạm Thị Dung",
          email: "phamthidung@example.com",
          tel: "0904567890",
          address: "Hải Phòng",
        },
      ]);
    });
};
