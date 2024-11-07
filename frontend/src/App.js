// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

const API_BASE_URL = "https://fluffy-unicorns-employee-management.onrender.com";

function App() {
  const [employees, setEmployees] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    fullname: "",
    email: "",
    tel: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employee`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showSnackbar("Không thể tải danh sách nhân viên", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginData);
      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      showSnackbar("Đăng nhập thành công");
    } catch (error) {
      showSnackbar("Đăng nhập thất bại", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    showSnackbar("Đã đăng xuất");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditing) {
        await axios.patch(
          `${API_BASE_URL}/employee/${currentEmployee.id}`,
          currentEmployee,
          config
        );
        showSnackbar("Cập nhật nhân viên thành công");
      } else {
        await axios.post(`${API_BASE_URL}/employee`, currentEmployee, config);
        showSnackbar("Thêm nhân viên thành công");
      }

      setOpenDialog(false);
      // Always fetch fresh data after any operation
      await fetchEmployees();
    } catch (error) {
      console.error("Operation error:", error);
      showSnackbar(
        error.response?.data?.message || "Thao tác thất bại",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== id)
      );
      showSnackbar("Xóa nhân viên thành công");
    } catch (error) {
      showSnackbar("Xóa nhân viên thất bại", "error");
    }
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEmployee({
      fullname: "",
      email: "",
      tel: "",
      address: "",
    });
    setIsEditing(false);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý nhân viên
        </Typography>

        {!token ? (
          <Paper sx={{ p: 2, mb: 2 }}>
            <form onSubmit={handleLogin}>
              <TextField
                label="Username"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                margin="normal"
                fullWidth
                required
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Đăng nhập
              </Button>
            </form>
          </Paper>
        ) : (
          <Box sx={{ mb: 2 }}>
            <Button onClick={handleLogout} variant="outlined" sx={{ mr: 2 }}>
              Đăng xuất
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setCurrentEmployee({
                  fullname: "",
                  email: "",
                  tel: "",
                  address: "",
                });
                setIsEditing(false);
                setOpenDialog(true);
              }}
            >
              Thêm nhân viên
            </Button>
          </Box>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              {token && <TableCell>Thao tác</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.fullname}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.tel}</TableCell>
                <TableCell>{employee.address}</TableCell>
                {token && (
                  <TableCell>
                    <Button onClick={() => handleEdit(employee)} sx={{ mr: 1 }}>
                      Sửa
                    </Button>
                    <Button
                      onClick={() => handleDelete(employee.id)}
                      color="error"
                    >
                      Xóa
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {isEditing ? "Sửa nhân viên" : "Thêm nhân viên"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                label="Họ và tên"
                value={currentEmployee.fullname}
                onChange={(e) =>
                  setCurrentEmployee({
                    ...currentEmployee,
                    fullname: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                type="email"
                value={currentEmployee.email}
                onChange={(e) =>
                  setCurrentEmployee({
                    ...currentEmployee,
                    email: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Điện thoại"
                value={currentEmployee.tel}
                onChange={(e) =>
                  setCurrentEmployee({
                    ...currentEmployee,
                    tel: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Địa chỉ"
                value={currentEmployee.address}
                onChange={(e) =>
                  setCurrentEmployee({
                    ...currentEmployee,
                    address: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Hủy</Button>
              <Button type="submit" variant="contained">
                {isEditing ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App;
