import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import Forgotpass from "./pages/authentication/Forgotpass";
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
import ViewPdf from "./pages/cv/VIewPdf";
import Setting from "./pages/company/Setting";
import Findjob from "./pages/employee/Findjob";

import { getUserInfo } from "./services/authApi";
import { useDispatch, useSelector } from "react-redux";
import useAppDispatch from "./hooks/useAppDispatch";
import { RootState } from "./redux/store";
import { useCallback, useEffect, useState } from "react";
import { getConversations } from "./services/messageApi";
import websocketService from './utils/WebSocketService';
import { setUserInfo } from "./redux/slice/authSlice";
import Messenger, { ChatMessage, Status, VIDEO_CALL_RESPONSE } from "./pages/chat/Messenger";
import { Client, Message as MessageStompjs, over } from 'stompjs';
import { addMessage, closeMessenger, setToCaller } from "./redux/slice/messageSlice";
import CustomModal from "./components/CustomModal";

const customTheme = extendTheme({
  fontFamily: {
    display: '"Sansita", sans-serif',
    body: '"Sansita", sans-serif',
  },
});

function App() {

  const wsUrl = process.env.REACT_APP_BASE_WS_URL;
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.authReducer);
  const dispatch = useAppDispatch();
  const [showCallRqModal, setShowCallRqModal] = useState(false);
  const { showMessenger, toCaller } = useSelector((state: RootState) => state.messageReducer);

  const updateLstConvers = useCallback((chatMessage: ChatMessage) => {
    const converUserIdReceived = Number(Number(chatMessage.sender) === userId ? chatMessage.receiver : chatMessage.sender);
    dispatch(addMessage({ converId: converUserIdReceived, msg: chatMessage }));
  }, [userId]);

  const onReceive = (payload: MessageStompjs) => {
    const msgReceived: ChatMessage = { ...JSON.parse(payload.body), position: 'normal', direction: 'incoming' };
    updateLstConvers(msgReceived);
    if (msgReceived.status == Status.VIDEO_CALL_REQUEST) {
      setShowCallRqModal(true);
      dispatch(setToCaller({
        id: msgReceived.sender,
        fullname: msgReceived.senderName
      }))
    }
  };

  const fetchUserInfo = useCallback(async () => {
    if (userId) {
      const res = await getUserInfo(userId);
      console.log("aaaaaaaaaaa" + res.fullName)
      if (res) {
        dispatch(setUserInfo({ fullName: res.fullName, avatar: res.avatar }));
      }
      dispatch(getConversations());
    }
  }, [userId]);

  useEffect(() => {
    isLoggedIn && fetchUserInfo();

    if (userId && wsUrl) {
      try {
        websocketService.connect(userId.toString(), wsUrl);
      } catch (error) {
        console.log(error);
      }
    }
  }, [userId]);


  useEffect(() => {
    websocketService.subscribe('messenger', onReceive);
    // websocketService.subscribe('notification', onNotificationReceive);

    return () => {
      websocketService.unsubscribe('messenger');
      // websocketService.unsubscribe('notification');
    };
  }, []);

  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      {/* <ThemeCustomization> */}
      <Routes >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpass" element={<Forgotpass />} />
        <Route path="/getstart" element={<Getstart />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/mes" element={<MyMessages />} />
        <Route path="/addjob/:id" element={<Addjob />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/listjob" element={<Listjob />} />
        <Route path="/layout1" element={<Layout1 />} />
        <Route path="/upcv" element={<Uploadcv />} />
        <Route path="/info" element={<Info />} />
        <Route path="/jobposting" element={<JobPosting />} />
        <Route path="/jobapplied" element={<JobApplied />} />
        <Route path="/jobsaved" element={<JobSaved />} />
        <Route path="/view-cv" element={<ViewPdf />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="find-job" element={<Findjob />} />
      </Routes>
      {showMessenger && <CustomModal isOpen={showMessenger} width='large' height='large' onClose={() => { dispatch(closeMessenger()); }} children={<Messenger />} />}
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
