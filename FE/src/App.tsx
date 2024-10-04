import MyComponent from "./pages/MyComponent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import Getstart from "./pages/Getstart";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {/* <ThemeCustomization> */}
        <Routes>
          <Route path="/" element={<MyComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/myprofile" element={<MyProfile/>}/>
          <Route path="/getstart" element={<Getstart/>}/>
        </Routes>
      {/* </ThemeCustomization> */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
