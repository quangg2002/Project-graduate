import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardOverflow, Chip, Divider, FormControl, IconButton, Link, Radio, RadioGroup, Stack, Tooltip, Typography } from "@mui/joy";
import Header from "../../components/Header";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidIcon from '@mui/icons-material/Paid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getFavoriteJob } from '../../services/favoriteJobApi';
import { favoriteJobCreate } from '../../services/favoriteJobApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { Empty } from 'antd';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { startLoading, stopLoading } from "../../redux/slice/loadingSlice";
import { jobRecommend } from "../../services/jobApi";


dayjs.extend(relativeTime);
dayjs.locale('vi');

interface JobRecommend {
    jobId: number;
    jobTitle: string;
    companyName: string;
    companyLogo: string;
    jobDescription: string;
    companyId: number;
    jobDeadline: string;
    nameSkill: string[];
    jobSalary: string;
    similarity: number;
    companyCity: string;
}

export default function JobSaved() {
    const [favoriteJobs, setFavoriteJobs] = useState([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [sortState, setSortState] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [jobRecommends, setJobRecommends] = useState<JobRecommend[]>([]);
    const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([]);

    useEffect(() => {
        const fetchFavoriteJobs = async () => {
            try {
                const action = await dispatch(getFavoriteJob());
                if (getFavoriteJob.fulfilled.match(action)) {
                    setFavoriteJobs(action.payload?.response?.data || []);

                    const response = action.payload.response?.data;
                    if (response) {
                        const jobIds = response.map(job => job.jobId);
                        setBookmarkedJobs(jobIds);
                    }
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
                if (bookmarkedJobs.includes(jobId)) {
                    toast.success('Đã gỡ công việc khỏi danh sách đã lưu!');
                } else {
                    toast.success('Đã lưu công việc vào danh sách đã lưu!');
                };

                const action = await dispatch(getFavoriteJob());
                if (getFavoriteJob.fulfilled.match(action)) {
                    setFavoriteJobs(action.payload?.response?.data || []);
                } else {
                    console.error('Failed to fetch favorite jobs:', action.error);
                }

                setBookmarkedJobs((prev) =>
                    prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
                );
            } else {
                toast.error('Đã có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleSortChange = async (event) => {
        setSortState((prevState) => !prevState);
        const respone = await dispatch(getFavoriteJob());
        console.log(respone)
        if (!sortState) {
            const sortedJobs = [...favoriteJobs].sort((a, b) => {
                const dateA = new Date(a.updateAtJob).getTime();
                const dateB = new Date(b.updateAtJob).getTime();
                return dateB - dateA;
            });
            setFavoriteJobs(sortedJobs);
        }
        else {
            setFavoriteJobs(respone.payload?.response?.data || [])
        }
    };

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            try {
                dispatch(startLoading());
                const result = await dispatch(jobRecommend())

                if (jobRecommend.fulfilled.match(result)) {
                    const response = result.payload.response;

                    if (response) setJobRecommends(response)
                }

            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                dispatch(stopLoading());
                console.log("jobRecommends" + jobRecommends)
                setIsLoading(false)
            }
        };

        fetchJobs();
    }, [dispatch]);


    return (
        <Box bgcolor={'#f4f5f5'} minHeight={'100vh'}>
            <Header />
            <Box width={'80%'} justifySelf={'center'} alignSelf={'center'} mt={4} pb={4}>
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
                                        <Radio checked={sortState} value="recent_update" label="Cập nhật gần nhất" onClick={handleSortChange} />
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
                                                        <Tooltip title={job?.title} placement="top" arrow>
                                                            <Link href={`/job-details/${job.jobId}`} underline="none">
                                                                <Typography
                                                                    level="title-lg"
                                                                    className="hover-text"
                                                                    sx={{
                                                                        transition: 'color 0.3s',
                                                                    }}
                                                                >
                                                                    {job?.title}
                                                                </Typography>
                                                            </Link>
                                                        </Tooltip>
                                                        <Typography color="success" fontWeight={'600'}>{job?.salary}</Typography>
                                                    </Stack>
                                                    <Link href={`/company-details/${job?.companyId}`} underline="none" sx={{ color: "inherit", display: "inline-block" }}>
                                                            <Tooltip title={job?.companyName} placement="top" arrow>
                                                                <Typography>{job?.companyName}</Typography>
                                                            </Tooltip>
                                                        </Link>
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
                                                            <Button color="success" size="sm" onClick={() => navigate(`/company-details/${job?.companyId}`)}>Ứng tuyển</Button>
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
                                {jobRecommends.map((jobRecommend, index) => (
                                    <Card
                                        key={index}
                                        variant="outlined"
                                        sx={{
                                            transition: "border 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                                borderColor: "#00B14F",
                                                boxShadow: "0 1px 3px #00B14F",
                                                "& .hover-text": {
                                                    color: "#00B14F",
                                                },
                                            },
                                        }}
                                    >
                                        <Stack gap={1}>
                                            <Stack direction={'row'} gap={1}>
                                                <img src={jobRecommend?.companyLogo}
                                                    alt="Company Logo"
                                                    style={{ width: 64, height: 64, borderRadius: '20px' }}
                                                />
                                                <Stack>
                                                    <Link href={`/job-details/${jobRecommend.jobId}`} underline="none" sx={{ color: "inherit", display: "inline-block" }}>
                                                        <Tooltip title={jobRecommend?.jobTitle} placement="top" arrow>
                                                            <Typography
                                                                className="hover-text"
                                                                sx={{
                                                                    transition: "color 0.3s",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                <p className="line-clamp-1">
                                                                    {jobRecommend?.jobTitle}
                                                                </p>
                                                            </Typography>
                                                        </Tooltip>
                                                    </Link>
                                                    <Link href={`/company-details/${jobRecommend.companyId}`} underline="none">
                                                        <Tooltip title={jobRecommend?.companyName} placement="top" arrow>
                                                            <p className="text-gray-700 text-sm line-clamp-1">{jobRecommend?.companyName}</p>
                                                        </Tooltip>
                                                    </Link>
                                                </Stack>
                                            </Stack >
                                            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                <Stack direction={'row'} gap={1}>
                                                    <Chip
                                                        variant="soft"
                                                        color="success"
                                                        size="sm"
                                                        startDecorator={<PaidIcon />}
                                                    >
                                                        {jobRecommend?.jobSalary}
                                                    </Chip>
                                                    <Chip
                                                        variant="soft"
                                                        color="success"
                                                        size="sm"
                                                        startDecorator={<LocationOnIcon />}
                                                    >
                                                        {jobRecommend?.companyCity}
                                                    </Chip>
                                                </Stack>
                                                <Tooltip title="Lưu" placement="bottom" arrow>
                                                    <IconButton variant="outlined" onClick={() => handleDeleteSave(jobRecommend?.jobId)}>
                                                        {bookmarkedJobs.includes(jobRecommend?.jobId) ? (
                                                            <BookmarkIcon color="success" />
                                                        ) : (
                                                            <BookmarkBorderIcon color="success" />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </Stack>
                                    </Card>
                                ))}
                            </Stack>
                        </Card>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    )
}