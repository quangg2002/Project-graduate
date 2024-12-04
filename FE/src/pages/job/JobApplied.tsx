import { Box, Button, Card, Chip, Divider, IconButton, Link, Option, Select, selectClasses, Stack, Tooltip, Typography } from "@mui/joy";
import Header from "../../components/Header";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ForumIcon from '@mui/icons-material/Forum';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaidIcon from '@mui/icons-material/Paid';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useState, useEffect } from "react";
import { applicationLists } from '../../services/applicationApi';
import { useNavigate } from 'react-router-dom';
import { Empty, Spin } from "antd";


export default function JobApplied() {
    const [applications, setApplications] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchApplicationsData = async () => {
            try {
                const action = await dispatch(applicationLists());
                if (applicationLists.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) setApplications(response)
                }
            }
            catch (error) {
                console.error('Failed to fetch applications data:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchApplicationsData();
    }, [dispatch]);

    useEffect(() => {
        if (selectedStatus !== "ALL") {
            const filtered = applications.filter((app: any) => app.status === selectedStatus);
            setFilteredApplications(filtered);
        } else {
            setFilteredApplications(applications);
        }
    }, [selectedStatus, applications]);

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
                            <Stack gap={2}>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Typography level="title-lg">Việc làm đã ứng tuyển</Typography>
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
                                        onChange={(e, newValue) => setSelectedStatus(newValue as string || '')}
                                    >
                                        <Option value="ALL">Tất cả</Option>
                                        <Option value="PENDING">Đã ứng tuyển</Option>
                                        <Option value="ACCEPTED">NTD đã xem CV</Option>
                                        <Option value="REJECTED">NTD từ chối</Option>
                                    </Select>
                                </Stack>
                                {isLoading ? (
                                    <Stack justifyContent="center" alignItems="center" minHeight="200px">
                                        <Spin size="large"> Đang tải dữ liệu...</Spin>
                                    </Stack>
                                ) : applications.length !== 0 ? (
                                    filteredApplications.map((application, index) => (
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
                                                },
                                            }}
                                        >
                                            <Stack direction={'row'} gap={3}>
                                                <img
                                                    src={`${application?.companyAvata}`}
                                                    alt="Company Logo"
                                                    style={{
                                                        width: 100,
                                                        height: 100,
                                                        border: '1px solid #000',
                                                        borderRadius: '5px',
                                                    }}
                                                />
                                                <Stack flexGrow={1} gap={1}>
                                                    <Stack gap={0.7}>
                                                        <Stack direction={'row'} justifyContent={'space-between'}>
                                                            <Typography
                                                                level="title-lg"
                                                                className="hover-text"
                                                                sx={{
                                                                    transition: 'color 0.3s',
                                                                }}
                                                            >
                                                                {application?.jobTitle}
                                                            </Typography>
                                                            <Typography color="success" level="title-md" fontWeight={'600'}>
                                                                $ {application?.salary}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography>{application?.companyName}</Typography>
                                                        <Typography>
                                                            Thời gian ứng tuyển: {application?.createdAt.substring(0, 10)}
                                                        </Typography>
                                                        <Stack
                                                            direction={'row'}
                                                            justifyContent={'space-between'}
                                                            flexWrap={'wrap'}
                                                            gap={1}
                                                        >
                                                            <Typography>
                                                                CV đã ứng tuyển:{' '}
                                                                <Link
                                                                    underline="always"
                                                                    color="success"
                                                                    onClick={() => window.open(`${application.cvPdf}`)}
                                                                >
                                                                    CV tải lên
                                                                </Link>
                                                            </Typography>
                                                            <Stack direction={'row'} gap={1}>
                                                                <Chip
                                                                    variant="soft"
                                                                    color="success"
                                                                    size="md"
                                                                    startDecorator={<ForumIcon />}
                                                                    onClick={() => {
                                                                        const pdfLink = application?.cvPdf;
                                                                        navigate('/view-cv', { state: { pdfUrl: pdfLink } });
                                                                    }}
                                                                >
                                                                    Nhắn tin
                                                                </Chip>
                                                                <Chip
                                                                    variant="soft"
                                                                    color="success"
                                                                    size="md"
                                                                    startDecorator={<VisibilityIcon />}
                                                                    onClick={() => {
                                                                        const pdfLink = application?.cvPdf;
                                                                        navigate('/view-cv', { state: { pdfUrl: pdfLink } });
                                                                    }}
                                                                >
                                                                    Xem CV
                                                                </Chip>
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>
                                                    <Divider />
                                                    {application?.status === 'PENDING' && (
                                                        <Typography color="primary">Đã ứng tuyển</Typography>
                                                    )}
                                                    {application?.status === 'ACCEPTED' && (
                                                        <Typography sx={{ color: '#F70' }}>NTD đã xem CV</Typography>
                                                    )}
                                                    {application?.status === 'REJECTED' && (
                                                        <Typography sx={{ color: '#da4538' }}>
                                                            Thư tuyển dụng đã bị từ chối
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Card>
                                    ))
                                ) : (
                                    <Stack>
                                        <Empty
                                            description="Bạn chưa ứng tuyển công việc nào!"
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
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
                                    <Stack gap={2}>
                                        <Stack direction={'row'} gap={1}>
                                            <img src={require('../../assets/images/instagram.png')} alt="Company Logo" style={{ width: 64, height: 64, border: '1px solid #000', borderRadius: '20px' }} />
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