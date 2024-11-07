# Fluffy Unicorns - Week 4 - Employee Management System

Bài tập tuần 4 môn Công nghệ phát triển phần mềm web  
Giảng viên: Trần Duy Quang  
Trường Đại học Quản lý và Công nghệ Thành phố Hồ Chí Minh (UMT)

## Thông tin nhóm

Tên nhóm: Fluffy Unicorns

### Thành viên nhóm

1. Nguyễn Ngọc Thạch - 2201700077
2. Hoàng Anh - 2201700173
3. Lê Đức Long - 2201700192

## Demo dự án

Một app React đơn giản có tích hợp gọi API từ server với các endpoints đã tạo, bạn có thể truy cập tại đây: [https://suppleo.github.io/Fluffy-Unicorns---Employee-Management/](https://suppleo.github.io/Fluffy-Unicorns---Employee-Management/)

## Nội dung bài tập

### Tuần 4 - Basic CRUD endpoints

Tạo ra REST API endpoint /employee, hỗ trợ thao tác CRUD cho kiểu dữ liệu nhân viên như sau:

- fullname: Họ và tên đầy đủ, kiểu string
- email: Email, kiểu string
- tel: Số điện thoại, kiểu string
- address: Địa chỉ, kiểu string.

Các endpoint cần xây dựng:

- GET /employee: trả về danh sách các nhân viên của công ty
- POST /employee: Thêm mới một nhân viên
- DELETE /employee/:id: Xóa một nhân viên dựa trên id
- GET /employee/:id: Xem thông tin một nhân viên dựa trên id
- PATCH /employee/:id: Cập nhật thông tin một nhân viên dựa trên id

Các thao tác POST, DELETE, PATCH cần được bảo vệ bởi json web token (có được qua đăng nhập).

## Công nghệ sử dụng

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: JSON Web Tokens (JWT)
- ORM: Knex.js

## Cài đặt và Chạy ứng dụng

### Backend

1. Di chuyển vào thư mục backend:

```bash
cd backend
```

2. Cài đặt các dependencies:

```bash
npm install
```

3. Tạo file .env và cấu hình các biến môi trường:

```
PORT=3001
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

4. Chạy migrations:

```bash
npx knex migrate:latest
```

5. Khởi động server:

```bash
npm start
```

### Frontend

1. Di chuyển vào thư mục frontend:

```bash
cd frontend
```

2. Cài đặt các dependencies:

```bash
npm install
```

3. Khởi động ứng dụng:

```bash
npm start
```

Ứng dụng sẽ chạy tại http://localhost:3000

## API Documentation

### Authentication

```http
POST /login
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `username` | `string` | **Required**. |
| `password` | `string` | **Required**. |

### Employee Endpoints

```http
GET /employee
```

Trả về danh sách tất cả nhân viên

```http
GET /employee/:id
```

Trả về thông tin của một nhân viên

```http
POST /employee
```

Thêm nhân viên mới (Yêu cầu JWT)

```http
PATCH /employee/:id
```

Cập nhật thông tin nhân viên (Yêu cầu JWT)

```http
DELETE /employee/:id
```

Xóa nhân viên (Yêu cầu JWT)
