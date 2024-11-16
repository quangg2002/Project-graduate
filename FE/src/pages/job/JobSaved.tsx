import { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Button, Card, CardContent, CardOverflow, Checkbox, Chip, Divider, FormControl, IconButton, Link, Option, Radio, RadioGroup, Select, selectClasses, Stack, Tooltip, Typography } from "@mui/joy";
import Header from "../../components/Header";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PaidIcon from '@mui/icons-material/Paid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getFavoriteJob } from '../../services/favoriteJobApi';

export default function JobSaved() {
    const [favoriteJobs, setFavoriteJobs] = useState<any[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchFavoriteJobs = async () => {
            try {
                const action = await dispatch(getFavoriteJob());

                if (getFavoriteJob.fulfilled.match(action)) {
                    console.log(action.payload)
                    setFavoriteJobs(action.payload);
                } else {
                    console.error('Failed to fetch favorite jobs:', action.error);
                }

            } catch (error) {
                console.error('Failed to fetch employee data:', error);
            }
        }
        fetchFavoriteJobs()
    }, [dispatch]);

    return (
        <Box bgcolor={'#f4f5f5'} minHeight={'100vh'}>
            <Header />
            <Box width={'90%'} justifySelf={'center'} alignSelf={'center'} my={2}>
                <Breadcrumbs
                    size="sm"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="small" />}
                    sx={{ pl: 0 }}
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
                        Việc làm đã lưu
                    </Typography>
                </Breadcrumbs>

                <Stack
                    direction={'row'}
                    gap={2}
                    flexWrap={'wrap'}
                >
                    <Stack flex={2}>
                        <Card>
                            <CardOverflow sx={{ bgcolor: '#f123', py: 3 }} >
                                <Typography level="h4">Việc làm đã ứng tuyển</Typography>
                                <Typography>Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.</Typography>
                            </CardOverflow>
                            <Typography>Danh sách 1 việc làm đã lưu</Typography>
                            <Divider />
                            <Stack direction={'row'} gap={4} alignItems={'center'}>
                                <Typography level="body-sm">Ưu tiên hiển thị:</Typography>
                                <FormControl>
                                    <RadioGroup>
                                        <Stack direction={'row'} gap={4}>
                                            <Radio label="Lương cao nhất"></Radio>
                                            <Radio label="Cập nhật gần nhất"></Radio>
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                            <Divider />

                            <Stack gap={2}>
                                <Card variant="outlined" sx={{ bgcolor: '#f2fbf6' }}>
                                    <Stack direction={'row'} gap={2}>
                                        <img src="https://example.com/logo.png" alt="Company Logo" style={{ width: 100, height: 100, border: '1px solid #000', borderRadius: '5px' }} />
                                        <Stack flexGrow={1} gap={1}>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <Typography level="title-lg">Fresher Java ( Có Lương Đào Tạo )</Typography>
                                                <Typography color="success" level="title-lg">6 triệu</Typography>
                                            </Stack>
                                            <Typography>BSS Group</Typography>
                                            <Typography>Thời gian ứng tuyển: 13-09-2024</Typography>
                                            <Stack direction={'row'} justifyContent={'space-between'} flexWrap={'wrap'} gap={1}>
                                                <Stack direction={'row'} gap={1}>
                                                    <Chip
                                                        variant="solid"
                                                        color="neutral"
                                                        size="sm"
                                                    >
                                                        Hà Nội
                                                    </Chip>
                                                    <Chip
                                                        variant="solid"
                                                        color="neutral"
                                                        size="sm"
                                                    >
                                                        Cập nhật 2 giờ trước
                                                    </Chip>
                                                </Stack>
                                                <Stack direction={'row'} gap={1}>
                                                    <Button color="success" size="sm">Ứng tuyển</Button>
                                                    <Button startDecorator={<DeleteOutlineIcon />} color="danger" size="sm">Bỏ lưu</Button>
                                                </Stack>
                                            </Stack>
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
                                                <IconButton variant="outlined" sx={{ borderRadius: '50%' }}>
                                                    <FavoriteBorderIcon />
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