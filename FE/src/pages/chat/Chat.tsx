import { Box, Button, Stack, Typography } from "@mui/joy";
import { getUserInfo } from "../../services/authApi";
import { useDispatch, useSelector } from "react-redux";
import useAppDispatch from "../../hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import { useCallback, useEffect, useState } from "react";
import { getConversations } from "../../services/messageApi";
import websocketService from '../../utils/WebSocketService';
import { setUserInfo } from "../../redux/slice/authSlice";
import Messenger, { ChatMessage, Status, VIDEO_CALL_RESPONSE } from "./Messenger";
import { Client, Message as MessageStompjs, over } from 'stompjs';
import { addMessage, closeMessenger, setToCaller } from "../../redux/slice/messageSlice";
import { applicationLists } from '../../services/applicationApi';
import { applicationWithCompany } from '../../services/applicationApi';
import VideoCallRequest from "./VideoCallRequest";
import { Empty, Modal, Spin } from "antd";

export default function Chat() {
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState([])
    const [candidate, setCandidate] = useState([]);
    
    const rawRole = sessionStorage.getItem('role');
    const role = rawRole ? rawRole.replace(/"/g, '') : null;
    const [error, setError] = useState(null);

    console.log("ROLE: " + role);

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
            if (res) {
                dispatch(setUserInfo({ fullName: res?.fullName, avatar: res?.avatar }));
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

    const handleRefuseCall = () => {
        const acceptPayload = {
            fromUser: userId,
            toUser: toCaller?.id,
            status: VIDEO_CALL_RESPONSE.REFUSE,
        };
        websocketService.sendMessage(acceptPayload, '/app/accept');
    };

    useEffect(() => {
        websocketService.subscribe('messenger', onReceive);
        return () => {
            websocketService.unsubscribe('messenger');
        };
    }, []);


    useEffect(() => {
        const fetchApplicationsData = async () => {
            try {
                const action = await dispatch(applicationLists());
                if (applicationLists.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) setApplications(response)
                }
            }
            catch (error) {
                console.error('Failed to fetch applications data:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchApplicationsData();
    }, [dispatch]);

    useEffect(() => {
        const fetchJobDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await dispatch(applicationWithCompany());
                const data = result?.payload?.response?.data || [];
                setCandidate(data);
            } catch (err) {
                setError(err || 'Không thể tải danh sách ứng viên');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetail();
    }, [dispatch]);

    return (
        <Stack height={'100vh'} direction={'row'} >
            <Stack flex={3}>
                <Messenger />
            </Stack>
            {role === 'EMPLOYEE' && (
                <Stack flex={1}>
                    <Stack mx={3} mt={3} gap={2}>
                        <Typography level="title-lg">Tin tuyển dụng đã ứng tuyển</Typography>
                        {isLoading ? (
                            <Stack justifyContent="center" alignItems="center" minHeight="200px">
                                <Spin size="large"> Đang tải dữ liệu...</Spin>
                            </Stack>
                        ) : applications.length !== 0 ? (
                            applications.map((application, index) => (
                                <Stack direction={'row'} alignItems="center" justifyContent={'space-between'}>
                                    <Stack direction={'row'} gap={1} justifyContent={'center'} alignItems={'center'}>
                                        <img
                                            src={`${application?.companyAvata}`}
                                            alt="Company Logo"
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '5px',
                                            }}
                                        />
                                        <Stack sx={{ width: '150px' }}>
                                            <Typography whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>{application?.jobTitle}</Typography>
                                            <Typography whiteSpace={'nowrap'} overflow={'hidden'} level="body-sm" textOverflow={'ellipsis'}>{application?.companyName}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        sx={{ borderRadius: 20 }}
                                        onClick={() => {
                                            const msg: ChatMessage = {
                                                receiver: String(userId),
                                                status: 'MESSAGE',
                                                id: null,
                                                senderName: application?.fullName,
                                                direction: 'outgoing',
                                                position: 'normal',
                                                message: String(application?.jobId),
                                                sender: String(application?.userEmployerId),
                                                sentTime: new Date().toLocaleString(),
                                                type: 'html',
                                            };

                                            application?.userEmployerId
                                                && dispatch(
                                                    addMessage({
                                                        converId: application?.userEmployerId,
                                                        avtUrl: application?.avatarEmployer,
                                                        fullName: application?.fullNameEmployer,
                                                        msg,
                                                        openMessenger: true
                                                    })
                                                )
                                                && websocketService.sendMessage(msg);
                                        }}
                                    >
                                        Nhắn tin
                                    </Button>
                                </Stack>
                            ))
                        ) : (
                            role == 'EMPLOYEE' ?
                                <Stack>
                                    <Empty
                                        description="Bạn chưa ứng tuyển công việc nào!"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                    <Stack justifyContent={'center'} alignItems="center">
                                        <Button color="success">Tìm việc ngay</Button>
                                    </Stack>
                                </Stack>
                                :
                                <Stack mt={10}>
                                    <Empty
                                        description="Chưa có ai ứng tuyển!"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />

                                </Stack>
                        )}
                    </Stack>
                </Stack>
            )}


            {role === 'EMPLOYER' && (
                <Stack flex={1}>
                    <Stack mx={3} mt={3} gap={2}>
                        <Typography level="title-lg">Ứng viên</Typography>
                        {isLoading ? (
                            <Stack justifyContent="center" alignItems="center" minHeight="200px">
                                <Spin size="large"> Đang tải dữ liệu...</Spin>
                            </Stack>
                        ) : candidate.length !== 0 ? (
                            candidate.map((application, index) => (
                                <Stack direction={'row'} alignItems="center" justifyContent={'space-between'}>
                                    <Stack direction={'row'} gap={1} justifyContent={'center'} alignItems={'center'}>
                                        <img
                                            src={`${application?.avatarEmployee}`}
                                            alt="Company Logo"
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '5px',
                                            }}
                                        />
                                        <Stack sx={{ width: '150px' }}>
                                            <Typography whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>{application?.fullName}</Typography>
                                            <Typography whiteSpace={'nowrap'} overflow={'hidden'} level="body-sm" textOverflow={'ellipsis'}>{application?.jobTitle}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        sx={{ borderRadius: 20 }}
                                        onClick={() => {
                                            const msg: ChatMessage = {
                                                receiver: String(application?.userEmployeeId),
                                                status: 'MESSAGE',
                                                id: null,
                                                senderName: application?.fullName,
                                                direction: 'outgoing',
                                                position: 'normal',
                                                message: String(application?.jobId),
                                                sender: String(application?.userEmployerId),
                                                sentTime: new Date().toLocaleString(),
                                                type: 'html',
                                            };

                                            application?.userEmployeeId
                                                && dispatch(
                                                    addMessage({
                                                        converId: application?.userEmployeeId,
                                                        avtUrl: application?.avatarEmployee,
                                                        fullName: application?.fullName,
                                                        msg,
                                                        openMessenger: true
                                                    })
                                                )
                                                && websocketService.sendMessage(msg);
                                        }}
                                    >
                                        Nhắn tin
                                    </Button>
                                </Stack>
                            ))
                        ) : (
                            role == 'EMPLOYER' &&
                                <Stack>
                                    <Empty
                                        description="Chưa có ứng viên ứng tuyển!"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                    {/* <Stack justifyContent={'center'} alignItems="center">
                                        <Button color="success">Tìm việc ngay</Button>
                                    </Stack> */}
                                </Stack>
                                // :
                                // <Stack mt={10}>
                                //     <Empty
                                //         description="Chưa có ai ứng tuyển!"
                                //         image={Empty.PRESENTED_IMAGE_SIMPLE}
                                //     />

                                // </Stack>
                        )}
                    </Stack>
                </Stack>
            )}

            <Modal
                open={showCallRqModal}
                closable={false}
                footer={null}
            >
                <VideoCallRequest
                    fromUser={toCaller?.id}
                    toUser={userId + ''}
                    fromUserFullname={toCaller?.fullname}
                    setShowCallRequestModal={setShowCallRqModal}
                    handleRefuseCall={handleRefuseCall}
                />
            </Modal>
        </Stack>
    )
}