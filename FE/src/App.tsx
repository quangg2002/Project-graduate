import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import Forgotpass from "./pages/authentication/Forgotpass";
import MyProfile from "./pages/employee/MyProfile";
import Getstart from "./pages/Getstart";
import Navbar from "./components/Header";
import Addjob from "./pages/company/Addjob";
import MyMessages from "./pages/messages/MyMessages"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from "react-router-dom";
import Overview from "./pages/company/Overview";
import Candidate from "./pages/company/Candidate";
import Listjob from "./pages/company/Listjob";
import Layout1 from "./pages/cv/Layout1";
import Uploadcv from "./pages/employee/Uploadcv";
import Info from "./pages/employee/Info";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import JobPosting from "./pages/job/JobPosting";
import JobApplied from "./pages/job/JobApplied";
import JobSaved from "./pages/job/JobSaved";

const customTheme = extendTheme({
  fontFamily: {
    display: '"Sansita", sans-serif',
    body: '"Sansita", sans-serif',
  },
});

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      {/* <ThemeCustomization> */}
      <Routes >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpass" element={<Forgotpass />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/getstart" element={<Getstart />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/mes" element={<MyMessages />} />
        <Route path="/addjob" element={<Addjob />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/listjob" element={<Listjob />} />
        <Route path="/layout1" element={<Layout1 />} />
        <Route path="/upcv" element={<Uploadcv />} />
        <Route path="/info" element={<Info />} />
        <Route path="/jobposting" element={<JobPosting />} />
        <Route path="/jobapplied" element={<JobApplied />} />
        <Route path="/jobsaved" element={<JobSaved />} />
      </Routes>
      
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme="light"
        pauseOnFocusLoss={false}
        stacked
      />
    </CssVarsProvider>
  );
}

export default App;
