import MyComponent from "./pages/MyComponent";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import Forgotpass from "./pages/authentication/Forgotpass";
import MyProfile from "./pages/MyProfile";
import Getstart from "./pages/Getstart";
import Navbar from "./components/Header";
import Addjob from "./pages/company/Addjob";
import MyMessages from "./pages/messages/MyMessages"
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Overview from "./pages/company/Overview";
import Candidate from "./pages/company/Candidate";

function App() {
  return (
    <>
      {/* <ThemeCustomization> */}
        <Routes>
          <Route path="/" element={<MyComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/forgotpass" element={<Forgotpass />}/>
          <Route path="/myprofile" element={<MyProfile/>}/>
          <Route path="/getstart" element={<Getstart/>}/>
          <Route path="/navbar" element={<Navbar/>}/> 
          <Route path="/mes" element={<MyMessages/>}/>
          <Route path="/addjob" element={<Addjob/>}/>
          <Route path="/overview" element={<Overview/>}/>
          <Route path="/candidate" element={<Candidate/>}/>
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
