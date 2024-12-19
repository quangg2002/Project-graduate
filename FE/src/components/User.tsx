import { useState, useEffect } from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Dropdown, Avatar, Divider, Menu, MenuButton, MenuItem, Typography, Box, ListDivider  } from "@mui/joy";

import useAppDispatch from "../hooks/useAppDispatch";
import { getEmployees } from '../services/employeeApi';
import { getEmployer } from '../services/employerApi';
import { useNavigate } from "react-router-dom";

interface UserData {
    fullName: string;
    gender: string;
    address: string;
    email: string;
    phoneNumber: string;
    career: string;
    avatar: string;
}

export default function User() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [user, setUserData] = useState<UserData>();

    const rawRole = sessionStorage.getItem('role');
    const role = rawRole ? rawRole.replace(/"/g, '') : null;

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {

                if(role === "EMPLOYEE"){
                    const action = await dispatch(getEmployees());

                    if (getEmployees.fulfilled.match(action)) {
                        const response = action.payload.response?.data;
                        if (response) {
                            setUserData(response);
                        }
                    }
                }

                if(role === "EMPLOYER"){
                    const action = await dispatch(getEmployer());

                    if (getEmployer.fulfilled.match(action)) {
                        const response = action.payload.response?.data;
                        if (response) {
                            setUserData(response);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch employee data:', error);
            }
        };

        fetchEmployeeData();
    }, [dispatch]);

    return (
        <Dropdown>
            <MenuButton
                variant="solid"
                size="sm"
                sx={{
                    maxWidth: "34px",
                    maxHeight: "34px",
                    borderRadius: "9999999px",
                    border: '2px solid #bebebe'
                }}
            >
                <Avatar
                    src={user?.avatar}
                    srcSet={user?.avatar}
                    sx={{ maxWidth: "32px", maxHeight: "32px" }}
                />
            </MenuButton>
            <Menu
                placement="bottom-end"
                size="sm"
                sx={{
                    zIndex: "99999",
                    p: 1,
                    gap: 1,
                    "--ListItem-radius": "var(--joy-radius-sm)",
                }}
            >
                <MenuItem>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            src={user?.avatar}
                            srcSet={user?.avatar}
                            sx={{ borderRadius: "50%" }}
                        />
                        <Box sx={{ ml: 1.5 }}>
                            <Typography level="title-sm" textColor="text.primary">
                                {user?.fullName}
                            </Typography>
                            <Typography level="body-xs" textColor="text.tertiary">
                                {user?.email}
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <ListDivider />
                <MenuItem onClick={() => navigate(role === 'EMPLOYEE' ? `/info` : `/setting`)}>
                    <SettingsRoundedIcon />
                    Cài đặt thông tin cá nhân
                </MenuItem>
                <Divider />
                <MenuItem>
                    <LogoutRoundedIcon />
                    Đăng xuất
                </MenuItem>
            </Menu>
        </Dropdown>
    )
}