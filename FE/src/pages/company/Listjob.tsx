import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import {
    Typography,
    Link,
    Breadcrumbs,
    Button,
    Sheet,
    Divider,
    Input,
    Select,
    Option,
    Stack,
} from "@mui/joy";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import useAppDispatch from '../../hooks/useAppDispatch';
import { jobGetWithCompany, jobDelete } from '../../services/jobApi';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Empty, Popconfirm } from 'antd';
import authService from '../../services/authService';

export default function Listjob() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userId = useState(authService.getUserId)

    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [listJob, setListJob] = useState([])

    const [expandedJobIndex, setExpandedJobIndex] = useState(null);

    const handleToggleDetails = (index) => {
        setExpandedJobIndex(expandedJobIndex === index ? null : index);
    };


    const handleSearch = () => {
        const searchInfo = {
            jobTitle: jobTitle,
            location: location,
        };
        console.log(searchInfo);
    }

    const handleDeleteJob = async (jobId) => {
        try {
            await dispatch(jobDelete(jobId));
            setListJob(listJob.filter((job) => job?.id !== jobId));
            toast.success('Xóa công việc thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa công việc');
        }
    }

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                dispatch(startLoading)
                const action = await dispatch(jobGetWithCompany());
                if (jobGetWithCompany.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) {
                        setListJob(response);
                    }
                }
                dispatch(stopLoading)
            } catch (error) {
                console.error('Failed to fetch list job data:', error);
            }
        };

        fetchCompanyData();
    }, [dispatch]);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header />
            <Box
                sx={[
                    {
                        bgcolor: "background.appBody",
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(64px, 200px) minmax(450px, 1fr)",
                            md: "minmax(180px, 300px) minmax(500px, 1fr)",
                        },
                    },
                ]}
            >
                <Box
                    component="nav"
                    sx={[
                        {
                            p: 2,
                            bgcolor: "background.surface",
                            borderRight: "1px solid",
                            borderColor: "divider",
                            display: {
                                xs: "none",
                                sm: "inherit",
                            },
                            top: 68,
                            left: 0,
                            position: "sticky",
                            height: "89vh",
                            zIndex: 1000,
                        },
                    ]}
                >
                    <Navigation />
                </Box>
                <Box
                    sx={[
                        {
                            m: 4,
                            mt: 2,
                            bgcolor: "background.appBody",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        },
                    ]}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                                <HomeRoundedIcon />
                            </Link>
                            <Link
                                underline="hover"
                                color="neutral"
                                href="#some-link"
                                sx={{ fontSize: 12, fontWeight: 500 }}
                            >
                                Nhà tuyển dụng
                            </Link>
                            <Typography
                                color="primary"
                                sx={{ fontWeight: 500, fontSize: 12 }}
                            >
                                Danh sách đăng tuyển
                            </Typography>
                        </Breadcrumbs>
                    </Box>

                    <Typography level="h3" component="h1">
                        Tuyển dụng
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', my: 1 }}>
                        <Input
                            startDecorator={<SearchIcon />}
                            placeholder="Tên công việc, vị trí ứng tuyển..."
                            sx={{ width: 300 }}
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />

                        {/* Location Selector */}
                        <Select
                            startDecorator={<LocationOnIcon />}
                            value={location}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setLocation(newValue);
                                }
                            }}
                            sx={{ width: 150 }}
                        >
                            <Option value="Ha Noi">Hà Nội</Option>
                            <Option value="Ho Chi Minh">Hồ Chí Minh</Option>
                            <Option value="Da Nang">Đà Nẵng</Option>
                        </Select>

                        <Button
                            color="success"
                            variant="solid"
                            startDecorator={<SearchIcon />}
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </Button>
                    </Box>

                    <Sheet
                        className="OrderTableContainer"
                        sx={{
                            width: "100%",
                            borderRadius: "sm",
                            flexShrink: 1,
                            overflow: "auto",
                            minHeight: 0,
                            p: 2
                        }}
                    >
                        <Box
                            display={'grid'}
                            gridTemplateColumns={'4fr 2fr 1fr 1fr'}
                            gap={2}
                            mb={1}
                            fontWeight={'bold'}
                        >
                            <Typography color="primary">Tiêu đề</Typography>
                            <Typography color="primary">Thời gian tạo / Hạn hs</Typography>
                            <Typography color="primary">Số ứng viên</Typography>
                            <Typography color="primary" textAlign={'center'}>Thao tác</Typography>
                        </Box>
                        {listJob.length !== 0 ? (
                            listJob.map((job, index) => (
                                <Stack my={1} flexWrap={'wrap'}>
                                    <Box
                                        display={'grid'}
                                        gridTemplateColumns={'4fr 2fr 1fr 1fr'}
                                        gap={2}
                                    >
                                        <Box>
                                            <Typography fontWeight={'bold'}>{job?.title}</Typography>
                                            <Typography level="body-md">📍 {job?.city}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography startDecorator={<RadioButtonCheckedIcon color="success" sx={{ fontSize: '10px' }} />} level="body-md">{job?.createdAt.substring(0, 10) + ' ' + job?.createdAt.substring(11, 19)}</Typography>
                                            <Typography startDecorator={<RadioButtonCheckedIcon sx={{ fontSize: '10px', color: 'red' }} />} level="body-md">{job?.deadline}</Typography>
                                        </Box>
                                        <Typography color="success">{job?.quantityApplication} người</Typography>
                                        <Stack direction={'row'} justifyContent={'center'} gap={1}>
                                            <VisibilityIcon color="primary" sx={{ fontSize: '19px' }} onClick={() => handleToggleDetails(index)} />
                                            {userId[0] == job?.userId && (
                                                <EditIcon color="warning" sx={{ fontSize: '19px' }} onClick={() => navigate(`/addjob/${job.id}`)} />
                                            )}
                                            <Popconfirm
                                                title={`Xoá công việc: ${job?.title}`}
                                                description="Bạn có chắc chắn xóa công việc này không?"
                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                onConfirm={() => handleDeleteJob(job?.id)}
                                                okText="Có"
                                                cancelText="Không"
                                            >
                                                <DeleteIcon sx={{ fontSize: '19px', color: '#FF6347', cursor: 'pointer' }} />
                                            </Popconfirm>
                                        </Stack>
                                    </Box>

                                    <Stack
                                        sx={{
                                            maxHeight: expandedJobIndex === index ? '1000px' : '0px',
                                            opacity: expandedJobIndex === index ? 1 : 0,
                                            overflow: 'hidden',
                                            transition: 'all 0.5s ease',
                                            bgcolor: 'background.surface',
                                            borderRadius: 'sm',
                                            pt: expandedJobIndex === index ? 3 : 0,
                                            mb: 1,
                                        }}
                                    >
                                        <Stack direction={'row'} gap={5} flexWrap={'wrap'}>
                                            <Stack flex={2} gap={1}>
                                                <Stack borderLeft={'6px solid #00b14f'}>
                                                    <Typography fontWeight={'bold'} pl={1}>Chi tiết tin tuyển dụng</Typography>
                                                </Stack>
                                                <Divider />
                                                <Stack>
                                                    <Typography fontWeight={'bold'}>Mô tả công việc</Typography>
                                                    <Typography>{job?.description}</Typography>
                                                </Stack>
                                                <Stack>
                                                    <Typography fontWeight={'bold'}>Yêu cầu</Typography>
                                                    <Typography>{job?.requirement}</Typography>
                                                </Stack>
                                                <Stack>
                                                    <Typography fontWeight={'bold'}>Quyền lợi</Typography>
                                                    <Typography>{job?.benefit}</Typography>
                                                </Stack>
                                                <Stack>
                                                    <Typography fontWeight={'bold'}>Thời gian làm việc</Typography>
                                                    <Typography>{job?.workingTime}</Typography>
                                                </Stack>
                                                <Stack>
                                                    <Typography fontWeight={'bold'}>Địa điểm</Typography>
                                                    <Typography>{job?.location},&nbsp;{job?.district},&nbsp;{job?.city}</Typography>
                                                </Stack>

                                            </Stack>
                                            <Stack gap={1} flex={1}>
                                                <Stack borderLeft={'6px solid #00b14f'}>
                                                    <Typography fontWeight={'bold'} pl={1}>Thông tin chung</Typography>
                                                </Stack>
                                                <Divider />
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <MilitaryTechIcon />
                                                    <Stack>
                                                        <Typography fontWeight={'bold'}>Vị trí</Typography>
                                                        <Typography>{job?.position}</Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <HourglassFullIcon />
                                                    <Stack>
                                                        <Typography fontWeight={'bold'}>Kinh nghiệm</Typography>
                                                        <Typography>{job?.yearExperience}</Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <PeopleIcon />
                                                    <Stack>
                                                        <Typography fontWeight={'bold'}>Số lượng tuyển</Typography>
                                                        <Typography>{job?.quantity} người</Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <BusinessCenterIcon />
                                                    <Stack>
                                                        <Typography fontWeight={'bold'}>Hình thức làm việc</Typography>
                                                        <Typography>{job?.contractType}</Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <MonetizationOnIcon />
                                                    <Stack>
                                                        <Typography fontWeight={'bold'}>Mức lương</Typography>
                                                        <Typography>{job?.salary}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <Divider />
                                </Stack>
                            ))
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có công việc đăng tuyển"/>
                        )}
                    </Sheet>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
