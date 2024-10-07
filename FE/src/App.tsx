import MyComponent from "./pages/MyComponent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import Getstart from "./pages/Getstart";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
// import Notification2 from "./components/Notification2";
import MyMessages from "./pages/messages/components/MyMessages"
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
          <Route path="/navbar" element={<Navbar/>}/> 
          <Route path="/notification" element={<Notification/>}/>
          {/* <Route path="/notification2" element={<Notification2/>}/> */}
          <Route path="/mes" element={<MyMessages/>}/>
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
