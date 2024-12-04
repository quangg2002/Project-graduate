import { useEffect, useState } from 'react';
import { Box, Button, Card, CardOverflow, Chip, Divider, FormControl, IconButton, Link, Option, Radio, RadioGroup, Select, selectClasses, Stack, Tooltip, Typography } from "@mui/joy";
import Header from "../../components/Header";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PaidIcon from '@mui/icons-material/Paid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getFavoriteJob } from '../../services/favoriteJobApi';
import { favoriteJobCreate } from '../../services/favoriteJobApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { Empty } from 'antd';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export default function JobSaved() {
    const [favoriteJobs, setFavoriteJobs] = useState([]);
    const dispatch = useAppDispatch();
    const [sortState, setSortState] = useState(false);

    useEffect(() => {
        const fetchFavoriteJobs = async () => {
            try {
                const action = await dispatch(getFavoriteJob());
                if (getFavoriteJob.fulfilled.match(action)) {
                    setFavoriteJobs(action.payload?.response?.data || []);
                } else {
                    console.error('Failed to fetch favorite jobs:', action.error);
                }
            } catch (error) {
                console.error('Failed to fetch employee data:', error);
            }
        }
        fetchFavoriteJobs()
    }, [dispatch]);

    const handleDeleteSave = async (jobId) => {
        try {
            const result = await dispatch(favoriteJobCreate(jobId));
            if (result?.payload?.response?.success) {
                toast.success('Đã gỡ công việc khỏi danh sách đã lưu!');
                setFavoriteJobs((prevJobs) => prevJobs.filter((job) => job.jobId !== jobId));
            } else {
                toast.error('Đã có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleSortChange = (event) => {
        setSortState((prevState) => !prevState);
        const respone = favoriteJobs;
        if (event.target.value === "recent_update") {
            const sortedJobs = [...favoriteJobs].sort((a, b) => {
                const dateA = new Date(a.updatedAt).getTime();
                const dateB = new Date(b.updatedAt).getTime();
                return dateB - dateA;
            });
            setFavoriteJobs(sortedJobs); 
            toast.success('Danh sách đã được sắp xếp theo cập nhật gần nhất!');
        }
        else{
            setFavoriteJobs(respone)
        }
    };

    return (
        <Box bgcolor={'#f4f5f5'} minHeight={'100vh'}>
            <Header />
            <Box width={'80%'} justifySelf={'center'} alignSelf={'center'} mt={4}>
                <Stack
                    direction={'row'}
                    gap={2}
                    flexWrap={'wrap'}
                >
                    <Stack flex={2}>
                        <Card>
                            <CardOverflow sx={{ py: 4, bgcolor: '#f2fbf6', borderBottom: '1px solid rgba(99 107 116 / 0.2)' }}  >
                                <Typography level="title-lg">Việc làm đã lưu</Typography>
                                <Typography>Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.</Typography>
                            </CardOverflow>
                            <Typography>Danh sách {favoriteJobs.length} việc làm đã lưu</Typography>
                            <Divider />
                            <Stack direction={'row'} gap={4} alignItems={'center'}>
                                <Typography level="body-sm">Ưu tiên hiển thị:</Typography>
                                <FormControl>
                                    <RadioGroup defaultValue="outlined" name="radio-buttons-group">
                                        <Radio value="recent_update" label="Cập nhật gần nhất" onClick={handleSortChange} />
                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                            <Divider />

                            <Stack gap={2}>
                                {favoriteJobs.length !== 0 ? (
                                    favoriteJobs.map((job, index) => (
                                        <Card
                                            key={index}
                                            variant="outlined"
                                            sx={{
                                                transition: 'border 0.3s, box-shadow 0.3s',
                                                '&:hover': {
                                                    borderColor: '#00B14F',
                                                    boxShadow: '0 1px 3px #00B14F',
                                                    '& .hover-text': {
                                                        color: '#00B14F',
                                                    },
                                                }
                                            }}
                                        >
                                            <Stack direction={'row'} gap={2}>
                                                <img src={job?.companyLogo} alt="Company Logo" style={{ width: 100, height: 100, border: '1px solid #e9eaec', borderRadius: '5px' }} />
                                                <Stack flexGrow={1} gap={1}>
                                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                                        <Typography
                                                            level="title-lg"
                                                            className="hover-text"
                                                            sx={{
                                                                transition: 'color 0.3s',
                                                            }}
                                                        >
                                                            {job?.title}
                                                        </Typography>
                                                        <Typography color="success" fontWeight={'600'}>{job?.salary}</Typography>
                                                    </Stack>
                                                    <Typography>{job?.companyName}</Typography>
                                                    <Typography>Đã lưu: {job?.createdAt.substring(0, 10) + " " + job?.createdAt.substring(11, 16)}</Typography>
                                                    <Stack direction={'row'} justifyContent={'space-between'} alignItems="center" flexWrap={'wrap'} gap={1}>
                                                        <Stack direction={'row'} gap={1}>
                                                            <Chip
                                                                variant="solid"
                                                                color="neutral"
                                                                size="sm"
                                                                sx={{ lineHeight: 'normal' }}
                                                            >
                                                                {job?.companyAddress}
                                                            </Chip>
                                                            <Chip
                                                                variant="solid"
                                                                color="neutral"
                                                                size="sm"
                                                                sx={{ lineHeight: 'normal' }}
                                                            >
                                                                Cập nhật {" " + dayjs(job?.updateAtJob).fromNow()}
                                                            </Chip>
                                                        </Stack>
                                                        <Stack direction={'row'} gap={1}>
                                                            <Button color="success" size="sm">Ứng tuyển</Button>
                                                            <Button
                                                                startDecorator={<DeleteOutlineIcon />}
                                                                color="danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteSave(job?.jobId)}
                                                            >
                                                                Bỏ lưu
                                                            </Button>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Card>
                                    ))
                                ) : (
                                    <Stack>
                                        <Empty description="Bạn chưa lưu công việc nào!" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                        <Stack justifyContent={'center'} alignItems="center">
                                            <Button color="success">Tìm việc ngay</Button>
                                        </Stack>
                                    </Stack>
                                )}
                            </Stack>
                        </Card>
                    </Stack>
                    <Stack flex={1}>
                        <Card variant="outlined">
                            <Stack gap={2}>
                                <Typography level="title-lg">Gợi ý việc làm phù hợp</Typography>
                                <Card variant="outlined">
                                    <Stack gap={1}>
                                        <Stack direction={'row'} gap={1}>
                                            <img src={require('../../assets/images/instagram.png')} alt="Company Logo" style={{ width: 60, height: 60, border: '1px solid #e9eaec', borderRadius: '15px' }} />
                                            <Stack flexGrow={1}>
                                                <Typography level="title-md">Chương Trình Thực Tập Sinh Tiềm Năng 2024</Typography>
                                                <Typography level="body-sm">Chương Trình Thực Tập Sinh Tiềm Năng 2024</Typography>
                                            </Stack>
                                        </Stack >
                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems="center">
                                            <Stack direction={'row'} gap={1}>
                                                <Chip
                                                    variant="soft"
                                                    color="success"
                                                    size="sm"
                                                    sx={{ lineHeight: 'normal' }}
                                                    startDecorator={<PaidIcon />}
                                                >
                                                    Thoả thuận
                                                </Chip>
                                                <Chip
                                                    variant="soft"
                                                    color="success"
                                                    size="sm"
                                                    sx={{ lineHeight: 'normal' }}
                                                    startDecorator={<LocationOnIcon />}
                                                >
                                                    Hà Nội
                                                </Chip>
                                            </Stack>
                                            <Tooltip title="Lưu" placement="bottom" arrow>
                                                <IconButton variant="outlined" sx={{ borderRadius: '50%' }}>
                                                    <BookmarkBorderIcon />
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