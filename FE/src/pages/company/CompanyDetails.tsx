import { useState, useEffect } from "react";
import { Avatar, Box, Button, Card, CardContent, CardCover, CardOverflow, Chip, Divider, IconButton, Input, Option, Select, selectClasses, Snackbar, Stack, Typography } from "@mui/joy";
import Header from "../../components/Header";
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BusinessIcon from '@mui/icons-material/Business';
import DoneIcon from '@mui/icons-material/Done';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LanguageIcon from '@mui/icons-material/Language';
import { Empty, Spin } from 'antd';
import city from '../../utils/citis.json';
import { Field, FieldProps, Form, Formik } from "formik";
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { useParams } from 'react-router-dom';
import useAppDispatch from '../../hooks/useAppDispatch';
import { favoriteJobCreate } from '../../services/favoriteJobApi';
import { getFavoriteJob } from '../../services/favoriteJobApi';
import { getFollowCompany } from '../../services/followCompanyApi';
import { followCompany } from '../../services/followCompanyApi';
import { getCompanyDetails } from '../../services/companyApi';
import { toast } from 'react-toastify';
import { denormalizeTextAreaContent } from '../../utils/utils';
import { css, keyframes } from "@emotion/react";

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface CompanyResponse {
    companyName: string;
    description: string;
    website: string;
    logo: string;
    address: string;
    city: string;
    district: string;
    scale: string;
}

interface Job {
    jobId: number;
    jobTitle: string;
    jobSalary: string;
    jobDeadline: string;
    jobCity: string;
}

interface DataResponse {
    companyResponse: CompanyResponse;
    listJob: Job[];
}


const rotateAnimation = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const iconStyle = css`
    animation: ${rotateAnimation} 1s ease-in-out;
`;

export default function CompanyDetails() {
    const dispatch = useAppDispatch();
    const [openAlert, setOpenAlert] = useState(false);
    const [data, setData] = useState<DataResponse | null>(null);
    const [originalData, setOriginalData] = useState<DataResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { companyId } = useParams();
    const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([]);
    const [followCompanies, setFollowCompanies] = useState<number[]>([]);

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteSave = async (jobId) => {
        try {
            const result = await dispatch(favoriteJobCreate(jobId));
            if (result?.payload?.response?.success) {
                if (bookmarkedJobs.includes(jobId)) {
                    toast.success('Đã gỡ công việc khỏi danh sách đã lưu!');
                } else {
                    toast.success('Đã lưu công việc vào danh sách đã lưu!');
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

    const handleFollowCompany = async (companyId: number) => {
        setOpen(false)
        try {
            const result = await dispatch(followCompany(companyId));
            if (result?.payload?.response?.success) {
                if (followCompanies.includes(companyId)) {
                    toast.success('Đã gỡ bỏ theo dõi công ty!');
                } else {
                    toast.success('Đã theo dõi công ty!');
                }
                setFollowCompanies((prev) =>
                    prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]
                );
            } else {
                toast.error('Đã có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                dispatch(startLoading)
                const action = await dispatch(getCompanyDetails(companyId));
                if (getCompanyDetails.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) {
                        setData(response);
                        setOriginalData(response);
                    }
                }
                dispatch(stopLoading)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchCompanyData();
    }, [dispatch]);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                dispatch(startLoading)
                const action = await dispatch(getFollowCompany());
                if (getFollowCompany.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) {
                        const companyIds = response.map(data => data?.companyId);
                        setFollowCompanies(companyIds);
                    }
                }
                dispatch(stopLoading)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                console.log("aaaaaaaaaaaa" + data?.companyResponse.description)
                setIsLoading(false)
            }
        };

        fetchCompanyData();
    }, []);


    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                dispatch(startLoading)
                const action = await dispatch(getFavoriteJob());
                if (getFavoriteJob.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) {
                        const jobIds = response.map(job => job.jobId);
                        setBookmarkedJobs(jobIds);
                    }
                }
                dispatch(stopLoading)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchCompanyData();
    }, []);

    function calculateDaysLeft(deadline: string): number {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        const diffTime = deadlineDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data?.companyResponse.website).then(() => {
            setOpenAlert(true);
            setTimeout(() => setOpenAlert(false), 3000);
        });
    };

    return (
        <Stack bgcolor={'#f4f5f5'} minHeight={'100vh'}>
            <Header />
            <Box width={'80%'} justifySelf={'center'} alignSelf={'center'} mt={4}>
                <Stack gap={3}>
                    <Card
                        sx={{
                            position: "relative",
                            overflow: "hidden",
                            minHeight: '270px'
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "150px",
                                backgroundImage: "url('https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/cover/company_cover_1.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                zIndex: 1,
                            }}
                        />

                        <Avatar
                            src={data?.companyResponse?.logo}
                            alt="Logoo"
                            sx={{
                                width: 160,
                                height: 160,
                                position: "absolute",
                                top: 80,
                                left: 40,
                                zIndex: 2,
                                border: "4px solid white",
                            }}
                        />

                        <Stack
                            sx={{
                                background: 'linear-gradient(90deg, #1c4742, #22c96d)',
                                zIndex: 1,
                                position: "absolute",
                                top: 150,
                                left: 0,
                                width: "100%",
                                height: 120,
                            }}
                            direction={'row'}
                        >
                            <Stack flex={2} />
                            <Stack direction={'row'} flex={8} justifyContent={'space-between'} alignItems={'center'} gap={1} mr={4}>
                                <Stack gap={1}>
                                    <Typography level="h3" sx={{ color: '#FFF' }}>{data?.companyResponse?.companyName}</Typography>
                                    <Stack direction={'row'} gap={4}>
                                        <Typography sx={{ color: '#FFF' }} startDecorator={<LanguageIcon sx={{ color: '#FFF', fontSize: 18 }} />}> {data?.companyResponse?.website}</Typography>
                                        <Typography sx={{ color: '#FFF' }} startDecorator={<BusinessIcon sx={{ color: '#FFF', fontSize: 18 }} />}> {data?.companyResponse?.scale}</Typography>
                                    </Stack>
                                </Stack>
                                <Button
                                    size="lg"
                                    startDecorator={
                                        followCompanies.includes(Number(companyId)) ?
                                            <DoneIcon
                                                sx={iconStyle}
                                                color="success"
                                            />
                                            :
                                            <AddIcon
                                                sx={iconStyle}
                                                color="success"
                                            />
                                    }
                                    sx={{
                                        backgroundColor: '#FFF',
                                        color: '#FFF',
                                        ':hover': {
                                            backgroundColor: '#f4f5f5',
                                        },
                                    }}
                                    onClick={() => {
                                        if (followCompanies.includes(Number(companyId))) {
                                            setOpen(true)
                                            setMessage(data?.companyResponse?.companyName)
                                            //   showConfirmModal(Number(companyId)); // Hiển thị modal khi người dùng muốn gỡ theo dõi
                                        } else {
                                            handleFollowCompany(Number(companyId)); // Theo dõi ngay
                                        }
                                    }}
                                >
                                    <Typography color="success" level="body-md">
                                        {followCompanies.includes(Number(companyId)) ? "Đã theo dõi" : "Theo dõi công ty"}
                                    </Typography>
                                </Button>
                            </Stack>
                        </Stack>
                    </Card>
                    <Stack direction={'row'} gap={3} flexWrap={'wrap'} mb={2}>
                        <Stack flex={2}>
                            <Stack gap={3}>
                                <Card>
                                    <CardOverflow sx={{ background: "linear-gradient(90deg, #22c96d, #BFFFC7)", py: 1 }} >
                                        <Typography level="h4">Giới thiệu công ty</Typography>
                                    </CardOverflow>
                                    <p dangerouslySetInnerHTML={{ __html: denormalizeTextAreaContent(data?.companyResponse?.description) || '' }} />
                                </Card>

                                <Card>
                                    <CardOverflow sx={{ background: "linear-gradient(90deg, #22c96d, #BFFFC7)", py: 1 }} >
                                        <Typography level="h4">Tuyển dụng</Typography>
                                    </CardOverflow>

                                    <Formik
                                        initialValues={{
                                            jobCategory: '',
                                            jobPosition: '',
                                            location: '',
                                        }}
                                        // validationSchema={FindJobSchema}
                                        onSubmit={(values) => {
                                            const filteredJobs = originalData?.listJob.filter((job) => {
                                                const matchesTitle =
                                                    values.jobPosition.trim() === '' ||
                                                    job?.jobTitle?.toLowerCase().includes(values.jobPosition.trim().toLowerCase());
                                                const matchesCity =
                                                    values.jobCategory.trim() === '' ||
                                                    job?.jobCity?.toLowerCase() === values.jobCategory.trim().toLowerCase();
                                                return matchesTitle && matchesCity;
                                            });
                                            console.log('Filtered Jobs:', filteredJobs);


                                            setData((prevData) => ({
                                                ...prevData!,
                                                listJob: filteredJobs,
                                            }));

                                        }}
                                    >
                                        {({ handleSubmit, setFieldValue }) => (
                                            <Form >
                                                <Stack direction={'row'} gap={1} flexWrap={'wrap'} mt={2} mb={1}>
                                                    <Stack flex={2}>
                                                        <Field name="jobPosition" size={'lg'} as={Input} placeholder="Vị trí tuyển dụng" />
                                                    </Stack>
                                                    <Field name="jobCategory">
                                                        {({ field, form }: FieldProps) => (
                                                            <Select
                                                                {...field}
                                                                onChange={(event, newValue) => {
                                                                    setFieldValue(field.name, newValue)
                                                                }}
                                                                startDecorator={<RoomOutlinedIcon sx={{ fontSize: 'medium' }} />}
                                                                // indicator={<KeyboardArrowDownIcon/>}
                                                                sx={{
                                                                    [`& .${selectClasses.indicator}`]: {
                                                                        transition: '0.2s',
                                                                        [`&.${selectClasses.expanded}`]: {
                                                                            transform: 'rotate(-180deg)',
                                                                        },
                                                                    },
                                                                }}
                                                                value={field.value}
                                                            >
                                                                <Option value="">
                                                                    Địa điểm
                                                                </Option>
                                                                {city.map(city => (
                                                                    <Option key={city.id} value={city.name}>
                                                                        {city.name}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <Button type="submit" startDecorator={<SearchIcon />}
                                                        sx={{
                                                            bgcolor: '#00b14f',
                                                            '&:hover': {
                                                                bgcolor: '#008f3e',
                                                            },
                                                        }}>
                                                        Tìm kiếm
                                                    </Button>
                                                </Stack>
                                            </Form>
                                        )}
                                    </Formik>
                                    {isLoading ? (
                                        <Stack justifyContent="center" alignItems="center" minHeight="200px">
                                            <Spin size="large"> Đang tải dữ liệu...</Spin>
                                        </Stack>
                                    ) :
                                        originalData?.listJob.length !== 0 ? (
                                            data?.listJob.length !== 0 ? (
                                                data?.listJob.map((job, index) => (
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
                                                            <img src={data?.companyResponse?.logo} alt="Company Logo" style={{ width: 100, height: 100, border: '1px solid #e9eaec', borderRadius: '5px' }} />
                                                            <Stack flexGrow={1} gap={1}>
                                                                <Stack direction={'row'} justifyContent={'space-between'}>
                                                                    <Typography
                                                                        level="title-lg"
                                                                        className="hover-text"
                                                                        sx={{
                                                                            transition: 'color 0.3s',
                                                                        }}
                                                                    >
                                                                        {job?.jobTitle}
                                                                    </Typography>
                                                                    <Typography color="success" fontWeight={'600'}>{job?.jobSalary}</Typography>

                                                                </Stack>
                                                                <Typography>{data?.companyResponse?.companyName}</Typography>
                                                                <Stack direction={'row'} justifyContent={'space-between'} alignItems="center" flexWrap={'wrap'} gap={1}>
                                                                    <Stack direction={'row'} gap={1}>
                                                                        <Chip
                                                                            variant="solid"
                                                                            color="neutral"
                                                                            size="sm"
                                                                            sx={{ lineHeight: 'normal' }}
                                                                        >
                                                                            {job?.jobCity}
                                                                        </Chip>
                                                                        <Chip
                                                                            variant="solid"
                                                                            color="neutral"
                                                                            size="sm"
                                                                            sx={{ lineHeight: 'normal' }}
                                                                        >
                                                                            Còn {calculateDaysLeft(job?.jobDeadline)} ngày ứng tuyển
                                                                        </Chip>
                                                                    </Stack>
                                                                    <Stack direction={'row'} gap={1}>
                                                                        <Button
                                                                            sx={{
                                                                                bgcolor: '#00b14f',
                                                                                '&:hover': {
                                                                                    bgcolor: '#008f3e',
                                                                                },
                                                                            }}
                                                                            size="sm">
                                                                            Ứng tuyển
                                                                        </Button>
                                                                        <IconButton variant="outlined" onClick={() => handleDeleteSave(job?.jobId)}>
                                                                            {bookmarkedJobs.includes(job?.jobId) ? (
                                                                                <BookmarkIcon color="success" />
                                                                            ) : (
                                                                                <BookmarkBorderIcon color="success" />
                                                                            )}
                                                                        </IconButton>
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                    </Card>
                                                ))
                                            ) : (
                                                <Stack>
                                                    <Empty
                                                        description="Không tìm thấy công việc nào!"
                                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    />
                                                    <Stack justifyContent={'center'} alignItems="center">
                                                        <Button color="success">Tìm việc ngay</Button>
                                                    </Stack>
                                                </Stack>
                                            )
                                        ) : (
                                                <Stack>
                                                    <Empty
                                                        description="Không có chưa công việc tuyển dụng!"
                                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    />
                                                    <Stack justifyContent={'center'} alignItems="center">
                                                        <Button color="success">Tìm việc ngay</Button>
                                                    </Stack>
                                                </Stack>
                                            )
                                    }
                                </Card>
                            </Stack>
                        </Stack>
                        <Stack flex={1}>
                            <Card>
                                <CardOverflow sx={{ background: "linear-gradient(90deg, #22c96d, #BFFFC7)", py: 1 }} >
                                    <Typography level="h4">Thông tin liên hệ</Typography>
                                </CardOverflow>
                                <Typography level="title-md"><LocationOnIcon sx={{ color: '#00b14f' }} />Địa chỉ công ty</Typography>
                                <Typography ml={1}>{data?.companyResponse?.address}, {data?.companyResponse?.district}, {data?.companyResponse?.city}</Typography>
                                <Typography level="title-md"><NearMeIcon sx={{ color: '#00b14f' }} />Sao chép đường dẫn</Typography>
                                <Input
                                    size="sm"
                                    endDecorator={
                                        <IconButton variant="soft" onClick={handleCopy}>
                                            <ContentCopyIcon />
                                        </IconButton>
                                    }
                                    value={data?.companyResponse?.website}
                                />
                            </Card>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
            <Snackbar
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                color='success'
                variant='solid'
                open={openAlert}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setOpenAlert(false);
                }}
                sx={{ justifyContent: 'center' }}
                startDecorator={<InsertLinkIcon />}
            >
                Sao chép thành công
            </Snackbar>

            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handleClose}
            >
                <Stack spacing={2}>
                    <Typography level="title-lg">Bỏ theo dõi</Typography>
                    <Divider />
                    <Stack>
                        <Typography>Bỏ theo dõi sẽ không tiếp tục nhận được thông tin tuyển dụng từ</Typography>
                        <Typography level="title-md">
                            {message}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} justifyContent={"flex-end"}>
                        <Button color="neutral" variant="solid" onClick={handleClose}>Hủy</Button>
                        <Button
                            onClick={() => handleFollowCompany(Number(companyId))}
                            sx={{
                                bgcolor: '#00b14f',
                                '&:hover': {
                                    bgcolor: '#008f3e',
                                },
                            }}
                        >
                            Xác nhận
                        </Button>
                    </Stack>
                </Stack>
            </Snackbar>
        </Stack>
    )
}   