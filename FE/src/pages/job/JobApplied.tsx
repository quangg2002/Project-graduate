import { Box, Breadcrumbs, Button, Card, CardContent, Chip, Divider, IconButton, Link, Option, Select, selectClasses, Stack, Tooltip, Typography } from "@mui/joy";
import Header from "../../components/Header";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ForumIcon from '@mui/icons-material/Forum';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaidIcon from '@mui/icons-material/Paid';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function JobApplied() {
    return (
        <Box bgcolor={'#f4f5f5'} minHeight={'100vh'}>
            <Header />
            <Box width={'90%'} justifySelf={'center'} alignSelf={'center'} my={2}>
                <Breadcrumbs
                    size="sm"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="small" />}
                >
                    <Link
                        underline="none"
                        color="neutral"
                        href="#some-link"
                        aria-label="Home"
                    >
                        <HomeRoundedIcon /> &nbsp;
                        <Typography level="body-xs">
                            Trang chủ
                        </Typography>
                    </Link>
                    <Typography color="primary" level="body-xs">
                        Việc làm
                    </Typography>
                    <Typography color="primary" level="body-xs">
                        Việc làm đã ứng tuyển
                    </Typography>
                </Breadcrumbs>

                <Stack
                   direction={'row'}
                   gap={2}
                   flexWrap={'wrap'}
                >
                    <Stack flex={2}>
                    <Card>
                        <Stack gap={2}>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography level="h4">Việc làm đã ứng tuyển</Typography>
                                <Select
                                    color="primary"
                                    placeholder="Trạng thái"
                                    indicator={<KeyboardArrowDown />}
                                    sx={{
                                        width: 240,
                                        [`& .${selectClasses.indicator}`]: {
                                            transition: '0.2s',
                                            [`&.${selectClasses.expanded}`]: {
                                                transform: 'rotate(-180deg)',
                                            },
                                        },
                                    }}
                                >
                                    <Option value="dog">Đã ứng tuyển</Option>
                                    <Option value="cat">NTD đã xem</Option>
                                </Select>
                            </Stack>

                            <Card variant="outlined" sx={{ bgcolor: '#f2fbf6' }}>
                                <Stack direction={'row'} gap={2}>
                                    <img src="https://example.com/logo.png" alt="Company Logo" style={{ width: 100, height: 100, border: '1px solid #000', borderRadius: '5px' }} />
                                    <Stack flexGrow={1} gap={2}>
                                        <Stack gap={1}>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <Typography level="title-lg">Fresher Java ( Có Lương Đào Tạo )</Typography>
                                                <Typography color="success" level="title-lg">6 triệu</Typography>
                                            </Stack>
                                            <Typography>BSS Group</Typography>
                                            <Typography>Thời gian ứng tuyển: 13-09-2024</Typography>
                                            <Stack direction={'row'} justifyContent={'space-between'} flexWrap={'wrap'} gap={1}>
                                                <Typography>CV đã ứng tuyển: <Link underline="always" color="success">CV tải lên</Link></Typography>
                                                <Stack direction={'row'} gap={1}>
                                                    <Chip
                                                        variant="soft"
                                                        color="success"
                                                        size="md"
                                                        startDecorator={<ForumIcon />}
                                                    >
                                                        Nhắn tin
                                                    </Chip>
                                                    <Chip
                                                        variant="soft"
                                                        color="success"
                                                        size="md"
                                                        startDecorator={<VisibilityIcon />}
                                                    >
                                                        Xem CV
                                                    </Chip>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        <Divider />
                                        <Typography color="primary">Đã ứng tuyển</Typography>
                                        <Typography sx={{ color: '#f70' }}>NTD đã xem hồ sơ (13-09-2024 13:09)</Typography>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Stack>
                    </Card>
                    </Stack>

                    <Stack flex={1}>
                    <Card variant="outlined">
                        <Stack gap={2}>
                            <Typography level="title-lg">Gợi ý việc làm phù hợp</Typography>
                            <Card variant="outlined">
                                <Stack gap={2}>
                                    <Stack direction={'row'} gap={1}>
                                        <img src="https://example.com/logo.png" alt="Company Logo" style={{ width: 64, height: 64, border: '1px solid #000', borderRadius: '5px' }} />
                                        <Stack flexGrow={1}>
                                            <Typography level="title-md">Chương Trình Thực Tập Sinh Tiềm Năng 2024</Typography>
                                            <Typography level="body-sm">Chương Trình Thực Tập Sinh Tiềm Năng 2024</Typography>
                                        </Stack>
                                    </Stack >
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <Stack direction={'row'} gap={1}>
                                            <Chip
                                                variant="soft"
                                                color="success"
                                                size="sm"
                                                startDecorator={<PaidIcon />}
                                            >
                                                Thoả thuận
                                            </Chip>
                                            <Chip
                                                variant="soft"
                                                color="success"
                                                size="sm"
                                                startDecorator={<LocationOnIcon />}
                                            >
                                                Hà Nội
                                            </Chip>
                                        </Stack>
                                        <Tooltip title="Lưu" placement="top">

                                        <IconButton variant="outlined" sx={{borderRadius: '50%'}}>
                                            <FavoriteBorderIcon/>
                                        </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Stack>
                    </Card>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    )
}