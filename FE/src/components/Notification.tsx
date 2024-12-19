import { useState, useEffect } from "react";

import { Avatar, Badge, Divider, Dropdown, IconButton, Menu, MenuButton, MenuItem, Stack, Tooltip, Typography } from "@mui/joy";
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useAppDispatch from "../hooks/useAppDispatch";
import { deleteNotification, getAllNotification, markAllNotificationsAsRead, markNotificationsAsRead } from '../services/notificationApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';

interface Notification {
    id: number;
    userId: number;
    jobId?: number;
    companyId?: number;
    avatar?: string;
    content: string;
    createdAt: string;
    read: boolean;
}

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale('vi');

export default function Notification() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleReadNotification = () => {
        dispatch(markAllNotificationsAsRead())
            .then(() => {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification => ({ ...notification, read: true }))
                );
            })
            .catch((error) => {
                console.error('Failed to mark notifications as read:', error);
            });
    };

    useEffect(() => {
        const fetchNotificationData = async () => {
            try {
                const action = await dispatch(getAllNotification());
                if (getAllNotification.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) {
                        setNotifications(response)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch employee data:', error);
            }
        };

        fetchNotificationData()
        // const intervalId = setInterval(fetchNotificationData, 1000);

        // return () => clearInterval(intervalId);
    }, [dispatch]);

    const handleDeleteNotification = (id: number) => {
        dispatch(deleteNotification(id))
            .then(() => {
                setNotifications(prevNotifications =>
                    prevNotifications.filter(notification => notification.id !== id)
                );
            })
            .catch(error => {
                console.error('Error deleting notification', error);
            });
    };

    const handleMarkAsRead = (id: number) => {
        dispatch(markNotificationsAsRead(id))
            .then(() => {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === id ? { ...notification, read: true } : notification
                    )
                );
            })
            .catch(error => {
                console.error('Error marking notification as read', error);
            });
    };
    

    return (
        <Dropdown>
            <MenuButton
                variant="soft"
                size="sm"
                sx={{
                    maxWidth: "32px",
                    maxHeight: "32px",
                    borderRadius: "9999999px",
                }}
                onClick={() => setOpen(prev => !prev)}
            >
                <Tooltip title="Thông báo" variant="outlined" sx={{ zIndex: '999999999999999' }}>
                    <Badge
                        badgeContent={notifications.filter(notification => !notification.read).length}
                        color="danger"
                        size="sm"
                    >
                        <NotificationsIcon color="success" />
                    </Badge>
                </Tooltip>
            </MenuButton>
            <Menu
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    zIndex: "99999",
                    maxHeight: '400px',
                    minWidth: '350px',
                    maxWidth: '350px',
                    p: 1,
                    gap: 1,
                    "--ListItem-radius": "var(--joy-radius-sm)",
                }}
                placement="bottom-end"
            >
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography level="title-md">Thông báo</Typography>
                    <Tooltip title="Đánh dấu tất cả đã đọc" variant="outlined" color="success" sx={{ zIndex: '999999999999999' }} arrow>
                        <IconButton
                            size="sm"
                            sx={{ borderRadius: '50%' }}
                            onClick={() => handleReadNotification()}
                        >
                            <CheckCircleOutlineIcon color="success" />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Divider />
                {notifications.map((notification, index) => (
                    <MenuItem key={notification.id} selected={!notification.read} onClick={() => navigate(`/job-details/${notification?.jobId}`)}>
                        <Stack direction="row" alignItems="center" gap={2}>
                            <Avatar src={notification?.avatar} />
                            <Stack>
                                <Typography level="title-sm">{notification.content}</Typography>
                                <Typography level="body-xs">{dayjs(notification?.createdAt).fromNow()}</Typography>
                            </Stack>
                            <Dropdown>
                                <MenuButton
                                    slots={{ root: IconButton }}
                                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                                >
                                    <MoreHorizIcon />
                                </MenuButton>
                                <Menu size="sm" sx={{ minWidth: 140, zIndex: "999999" }}>
                                    <MenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                        <CheckIcon /> Đánh dấu là đã đọc
                                    </MenuItem>
                                    <MenuItem color="danger" onClick={() => handleDeleteNotification(notification?.id)}><ClearIcon />Xoá thông báo này</MenuItem>
                                </Menu>
                            </Dropdown>
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    )
}