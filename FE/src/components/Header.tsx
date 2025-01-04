import { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import TeamNav from './Navigation'
import { Button, Divider } from "@mui/joy";
import ForumIcon from '@mui/icons-material/Forum';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { openMessenger } from "../redux/slice/messageSlice";
import Notification from "./Notification";
import useAppDispatch from "../hooks/useAppDispatch";
import User from "./User";


export default function Header() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);
    const dispatch = useAppDispatch();

    const rawRole = sessionStorage.getItem('role');
    const role = rawRole ? rawRole.replace(/"/g, '') : null;

    const items = ['Công việc', 'Hồ sơ & CV', 'Danh sách công ty'];

    const isSelected = (item) => {
        const paths = {
            'Công việc': ['/home', '/jobapplied', '/jobsaved', '/job-details'],
            'Hồ sơ & CV': ['/cv', '/resume', '/layout1'],
            'Danh sách công ty': ['/company'],
        };

        return paths[item]?.some(path => location.pathname.includes(path));
    };

    const getLinkForItem = (item) => {
        const paths = {
            'Công việc': '/home',
            'Hồ sơ & CV': '/layout1',
            'Danh sách công ty': '/company',
        };
        return paths[item] || '/';
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            {/* <Stack
                id="tab-bar"
                direction="row"
                spacing={1}
                sx={{
                    justifyContent: 'space-around',
                    display: { xs: 'flex', sm: 'none' },
                    zIndex: '999',
                    bottom: 0,
                    position: 'fixed',
                    width: '100dvw',
                    py: 2,
                    backgroundColor: 'background.body',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/joy-ui/getting-started/templates/email/"
                    size="sm"
                    startDecorator={<EmailRoundedIcon />}
                    sx={{ flexDirection: 'column', '--Button-gap': 0 }}
                >
                    Email
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    aria-pressed="true"
                    component="a"
                    href="/joy-ui/getting-started/templates/team/"
                    size="sm"
                    startDecorator={<PeopleAltRoundedIcon />}
                    sx={{ flexDirection: 'column', '--Button-gap': 0 }}
                >
                    Team
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/joy-ui/getting-started/templates/files/"
                    size="sm"
                    startDecorator={<FolderRoundedIcon />}
                    sx={{ flexDirection: 'column', '--Button-gap': 0 }}
                >
                    Files
                </Button>
            </Stack> */}
            <Box
                component="header"
                className="Header"
                sx={[
                    {
                        p: 2,
                        gap: 2,
                        // backgroundImage: `url(${backgroundImg})`, 
                        bgcolor: "background.body",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gridColumn: "1 / -1",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        position: "sticky",
                        top: 0,
                        zIndex: 1100,
                    },
                ]}
            >
                <Box
                    sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            display: { xs: "none", sm: "flex" },
                        }}
                    >
                        <img
                            src={require("../assets/images/logocompany.png")}
                            style={{
                                width: "35px",
                                height: "auto",
                                marginLeft: 10,
                                marginRight: 5,
                            }}
                            alt="My Image"
                        />
                        {items.map((item, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setOpenDropdown(item)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Dropdown
                                    open={openDropdown === item}
                                    onOpenChange={(event, isOpen) => setOpenDropdown(isOpen ? item : null)}
                                >
                                    <NavLink to={getLinkForItem(item)} style={{ textDecoration: 'none' }}>
                                        <MenuButton
                                            variant="plain"
                                            sx={{
                                                color: isSelected(item) ? '#00b14f' : 'inherit',
                                                '&:hover': {
                                                    color: '#00b14f'
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: isSelected(item) ? '#00b14f' : 'inherit',
                                                    '&:hover': {
                                                        color: '#00b14f'
                                                    },
                                                }}
                                            >
                                                {item}
                                            </Typography>
                                        </MenuButton>
                                    </NavLink>
                                    {index === 0 && (
                                        <Menu
                                            placement="bottom-start"
                                            size="sm"
                                            sx={{
                                                zIndex: "99999",
                                                p: 1,
                                                gap: 1,
                                                "--ListItem-radius": "var(--joy-radius-sm)",
                                                minWidth: '300px',
                                            }}
                                        >
                                            <MenuItem
                                                selected={['/findjob'].includes(location.pathname)}
                                                variant="soft"
                                            >
                                                <SearchIcon color="success" />
                                                <Typography level="title-sm" py={1}>Tìm việc làm</Typography>
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem
                                                variant="soft"
                                                selected={['/jobapplied'].includes(location.pathname)}
                                                onClick={() => {
                                                    navigate('/jobapplied');
                                                }}
                                            >
                                                <BusinessCenterOutlinedIcon color="success" />
                                                <Typography level="title-sm" py={1}>Việc làm đã ứng tuyển</Typography>
                                                <LocalFireDepartmentIcon sx={{ color: '#f95825' }} />
                                            </MenuItem>

                                            <MenuItem
                                                variant="soft"
                                                selected={['/jobsaved'].includes(location.pathname)}
                                                onClick={() => {
                                                    navigate('/jobsaved');
                                                }}
                                            >
                                                <FavoriteBorderIcon color="success" />
                                                <Typography level="title-sm" py={1}>Việc làm đã lưu</Typography>
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem
                                                variant="soft"
                                            >
                                                <TaskOutlinedIcon color="success" />
                                                <Typography level="title-sm" py={1}>Việc làm phù hợp</Typography>
                                            </MenuItem>
                                        </Menu>
                                    )}

                                    {index === 1 && (
                                        <Menu
                                            placement="bottom-start"
                                            size="sm"
                                            sx={{
                                                zIndex: "99999",
                                                p: 1,
                                                gap: 1,
                                                "--ListItem-radius": "var(--joy-radius-sm)",
                                                minWidth: '300px',
                                            }}
                                        >
                                            <MenuItem
                                                variant="soft"

                                            >
                                                <NoteAddOutlinedIcon color="success" />
                                                <Typography level="title-sm" py={1}>Tạo CV</Typography>
                                            </MenuItem>
                                            <MenuItem
                                                variant="soft"
                                            >
                                                <FolderOpenOutlinedIcon color="success" />
                                                <Typography level="title-sm" py={1}>Quản lý CV</Typography>
                                            </MenuItem>
                                        </Menu>
                                    )}
                                </Dropdown>
                            </div>
                        ))}
                    </Stack>
                    <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
                        <IconButton
                            variant="plain"
                            color="neutral"
                            onClick={() => setOpen(true)}
                        >
                            <MenuRoundedIcon />
                        </IconButton>
                        <Drawer
                            sx={{ display: { xs: "inline-flex", sm: "noninline-flexe", md: "none" } }}
                            open={open}
                            onClose={() => setOpen(false)}
                        >
                            <ModalClose />
                            <DialogTitle></DialogTitle>
                            <Box sx={{ p: 1, pt: 2 }}>
                                <TeamNav />
                            </Box>
                        </Drawer>
                    </Box>
                    {role ? (
                        <Stack
                            direction={'row'}
                            gap={2}
                        >
                            <Notification />

                            <Tooltip title="Tin nhắn" variant="outlined">
                                <IconButton
                                    size="sm"
                                    variant="soft"
                                    sx={{ alignSelf: "center", borderRadius: '50%' }}
                                    onClick={() => {
                                        window.open('http://localhost:3000/chat')
                                        dispatch(openMessenger())
                                    }}
                                >
                                    <ForumIcon color="success" />
                                </IconButton>
                            </Tooltip>

                            <User />
                        </Stack>
                    ) : (
                        <Stack direction={'row'} gap={2}>
                            <Button variant="outlined" onClick={() => navigate('/register')}>Đăng ký</Button>
                            <Button
                                sx={{
                                    bgcolor: '#00b14f',
                                    '&:hover': {
                                        bgcolor: '#00A14E'
                                    },
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
