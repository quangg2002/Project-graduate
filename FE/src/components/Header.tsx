import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
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
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import TeamNav from './Navigation'
import { Divider } from "@mui/joy";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ForumIcon from '@mui/icons-material/Forum';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


export default function Header() {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [openDropdown, setOpenDropdown] = React.useState(null);

    const items = ['Công việc', 'Hồ sơ & CV', 'Danh sách công ty'];

    const isSelected = (item) => {
        const paths = {
            'Công việc': ['/info', '/jobapplied', '/jobsaved'],
            'Hồ sơ & CV': ['/cv', '/resume'],
            'Danh sách công ty': ['/company'],
        };

        return paths[item]?.some(path => location.pathname.includes(path));
    };

    const getLinkForItem = (item) => {
        const paths = {
            'Công việc': '/info',
            'Hồ sơ & CV': '/cv',
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
                    <Stack
                        direction={'row'}
                        gap={2}
                    >
                        <Dropdown>
                            <MenuButton
                                variant="plain"
                                size="sm"
                                sx={{
                                    maxWidth: "32px",
                                    maxHeight: "32px",
                                    borderRadius: "9999999px",
                                }}

                            >
                                <Tooltip title="Thông báo" variant="outlined">
                                    <IconButton
                                        size="sm"
                                        variant="soft"
                                        sx={{ alignSelf: "center", borderRadius: '50%' }}
                                    >
                                        <NotificationsIcon color="success" />
                                    </IconButton>
                                </Tooltip>
                            </MenuButton>
                            <Menu
                                sx={{
                                    zIndex: "99999",
                                    maxHeight: '400px',
                                    minWidth: '300px',
                                    maxWidth: '300px',
                                    p: 1,
                                    gap: 1,
                                    "--ListItem-radius": "var(--joy-radius-sm)",
                                }}
                                placement="bottom-end"
                            >
                                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography level="title-md">Thông báo</Typography>
                                    <Tooltip title="Đánh dấu tất cả đã đọc" variant="outlined" color="success" sx={{zIndex: '999999999999999'}}>
                                        <IconButton
                                            size="sm"
                                            sx={{ borderRadius: '50%' }}
                                        >
                                            <CheckCircleOutlineIcon color="success" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                <Divider/>
                                <MenuItem>
                                    <Stack direction={'row'} alignItems={'center'} gap={2}>
                                        <Avatar/>
                                        <Stack>
                                            <Typography level="title-sm">Công ty đã xác nhận thư xin việc của bạn</Typography>
                                            <Typography level="body-xs">2 ago</Typography>
                                        </Stack>
                                        <Typography level="body-xs">3:00AM</Typography>
                                    </Stack>
                                </MenuItem>
                                <MenuItem selected>
                                    <Stack direction={'row'} alignItems={'center'} gap={2}>
                                        <Avatar/>
                                        <Stack>
                                            <Typography level="title-sm">Công ty đã xác nhận thư xin việc của bạn</Typography>
                                            <Typography level="body-xs">2 ago</Typography>
                                        </Stack>
                                        <Typography level="body-xs">3:00AM</Typography>
                                    </Stack>
                                </MenuItem>
                                
                            </Menu>
                        </Dropdown>

                        <Dropdown>
                            <MenuButton
                                variant="plain"
                                size="sm"
                                sx={{
                                    maxWidth: "32px",
                                    maxHeight: "32px",
                                    borderRadius: "9999999px",
                                }}
                            >
                                <Tooltip title="Tin nhắn" variant="outlined">
                                    <IconButton
                                        size="sm"
                                        variant="soft"
                                        sx={{ alignSelf: "center", borderRadius: '50%' }}
                                    >
                                        <ForumIcon color="success" />
                                    </IconButton>
                                </Tooltip>
                            </MenuButton>
                        </Dropdown>

                        <Dropdown>
                            <MenuButton
                                variant="plain"
                                size="sm"
                                sx={{
                                    maxWidth: "32px",
                                    maxHeight: "32px",
                                    borderRadius: "9999999px",
                                }}
                            >
                                <Avatar
                                    src="https://i.pravatar.cc/40?img=2"
                                    srcSet="https://i.pravatar.cc/80?img=2"
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
                                            src="https://i.pravatar.cc/40?img=2"
                                            srcSet="https://i.pravatar.cc/80?img=2"
                                            sx={{ borderRadius: "50%" }}
                                        />
                                        <Box sx={{ ml: 1.5 }}>
                                            <Typography level="title-sm" textColor="text.primary">
                                                Rick Sanchez
                                            </Typography>
                                            <Typography level="body-xs" textColor="text.tertiary">
                                                rick@email.com
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                                <ListDivider />
                                <MenuItem>
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
                    </Stack>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
