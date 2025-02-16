import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import Forgotpass from "./pages/authentication/Forgotpass";
import Getstart from "./pages/Getstart";
import Navbar from "./components/Header";
import Addjob from "./pages/company/Addjob";
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
import ViewPdf from "./pages/cv/VIewPdf";
import Setting from "./pages/company/Setting";
import Findjob from "./pages/employee/Findjob";
import CompanyDetails from "./pages/company/CompanyDetails";
import Chat from "./pages/chat/Chat";
import Home from "./pages/employee/Home";
import Layout2 from "./pages/cv/Layout2";
import Cv from "./pages/cv/Cv";

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
        <Route path="/getstart" element={<Getstart />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/addjob/:id" element={<Addjob />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/listjob" element={<Listjob />} />
        <Route path="/layout1" element={<Layout1 />} />
        <Route path="/layout2" element={<Layout2/>} />
        <Route path="/cv" element={<Cv/>} />
        <Route path="/upcv" element={<Uploadcv />} />
        <Route path="/info" element={<Info />} />
        <Route path="/job-details/:jobId" element={<JobPosting />} />
        <Route path="/jobapplied" element={<JobApplied />} />
        <Route path="/jobsaved" element={<JobSaved />} />
        <Route path="/view-cv" element={<ViewPdf />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/find-job" element={<Findjob />} />
        <Route path="/company-details/:companyId" element={<CompanyDetails />}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>

      <ToastContainer
        position="top-right"
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
