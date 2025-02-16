import Box from "@mui/material/Box";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Typography, Card, CardCover, CardContent, Link, Tooltip, IconButton, Breadcrumbs, Stack, CardOverflow, Input, Snackbar, Divider, Avatar, Button } from "@mui/joy";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CampaignIcon from '@mui/icons-material/Campaign';
import TaskIcon from '@mui/icons-material/Task';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { useState, useEffect } from "react";
import { getCompany, getBoardCompany } from '../../services/companyApi';
import { denormalizeTextAreaContent } from '../../utils/utils';
import { getListCompany } from '../../services/companyApi';
import { updateCompanyEmployer } from '../../services/employerApi';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

interface CompanyBoardResponse {
    jobQuantity: number;
    cvQuantity: number;
    cvQuantityNew: number;
}

interface Company {
    id: number;
    companyName: string;
    logo: string;
    address: string;
}

export default function Overview() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [openAlert, setOpenAlert] = useState(false);
    const [companyBoard, setCompanyBoard] = useState<CompanyBoardResponse | null>(null);
    const [company, setCompany] = useState({
        companyName: '',
        description: '',
        website: '',
        logo: '',
        address: '',
        scale: '',
        city: '',
        district: '',
    });

    const [listCompany, setListCompany] = useState<Company[]>([]);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                dispatch(startLoading)
                const action = await dispatch(getBoardCompany());
                dispatch(stopLoading)
                if (getBoardCompany.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response)
                        setCompanyBoard(response)
                }
            } catch (error) {
                console.error('Failed to fetch company data:', error);
            }
        };

        fetchCompanyData();
    }, [dispatch]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                dispatch(startLoading)
                const action = await dispatch(getCompany());
                dispatch(stopLoading)
                if (getCompany.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response)
                        setCompany({
                            companyName: response.companyName,
                            description: response.description,
                            website: response.website,
                            logo: response.logo,
                            address: response.address,
                            city: response.city,
                            scale: response.scale,
                            district: response.district
                        });
                }
            } catch (error) {
                console.error('Failed to fetch company data:', error);
            }
        };

        fetchEmployeeData();
    }, [dispatch]);

    const handleCopy = () => {
        navigator.clipboard.writeText(company.website).then(() => {
            setOpenAlert(true);
            setTimeout(() => setOpenAlert(false), 3000);
        });
    };

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const action = await dispatch(getListCompany());
                if (getListCompany.fulfilled.match(action)) {
                    const response = action.payload.response?.data;

                    if (response) {
                        setListCompany(response.map((cpn: any) => ({ id: cpn.id, companyName: cpn.companyName, logo: cpn.logo, address: cpn.address })));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch employer data:', error);
            }
        };

        fetchCompanyData();
    }, [dispatch]);

    const handleUpdateCompany = async (idCompany: number) => {
        try {
            const result = await dispatch(updateCompanyEmployer(idCompany));
            toast.success("Cập nhật thành công");
            navigate('/setting')
        } catch (error) {
            console.error("Lỗi khi cập nhật công ty:", error);
        }
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header />
            <Box
                sx={[
                    {
                        bgcolor: "background.level1",
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
                        }
                    ]}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
                                Tổng quan
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    {company.companyName ? (
                        <Stack gap={4}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "repeat(1fr)",
                                        sm: "repeat(2, 1fr)",
                                        md: "repeat(3, 1fr)",
                                    },
                                    gap: 3,
                                }}
                            >
                                <Stack sx={{ bgcolor: '#FBFCFE' }} border={'1px solid #007bff'} borderRadius={10} p={1}>
                                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} flexGrow={1} m={2}>
                                        <Stack flex={9}>
                                            <Typography color='primary' level="h4">{companyBoard?.jobQuantity}</Typography>
                                            <Typography color='primary' level="h4">Tin tuyển dụng</Typography>
                                        </Stack>
                                        <Stack flex={1}>
                                            <CampaignIcon color='primary' sx={{ fontSize: '30px' }} />
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ bgcolor: '#F5FFF9' }} border={'1px solid #28a745'} borderRadius={10}>
                                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} flexGrow={1} m={2}>
                                        <Stack flex={9}>
                                            <Typography color='success' level="h4">{companyBoard?.cvQuantity}</Typography>
                                            <Typography color='success' level="h4">CV tiếp nhận</Typography>
                                        </Stack>
                                        <Stack flex={1}>
                                            <TaskIcon color='success' sx={{ fontSize: '30px' }} />
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ bgcolor: '#FFF3F2' }} border={'1px solid red'} borderRadius={10}>
                                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} flexGrow={1} m={2}>
                                        <Stack flex={9}>
                                            <Typography color='danger' level="h4">{companyBoard?.cvQuantityNew}</Typography>
                                            <Typography color='danger' level="h4">CV ứng tuyển mới</Typography>
                                        </Stack>
                                        <Stack flex={1}>
                                            <LibraryAddIcon sx={{ fontSize: '30px', color: '#C41C1C' }} />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>

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
                                    src={company?.logo}
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
                                    <Stack flex={3} />
                                    <Stack direction={'row'} flex={8} justifyContent={'space-between'} alignItems={'center'} gap={1} mr={4}>
                                        <Stack gap={1}>
                                            <Typography level="h3" sx={{ color: '#FFF' }}>{company?.companyName}</Typography>
                                            <Stack direction={'row'} gap={4}>
                                                <Typography sx={{ color: '#FFF' }} startDecorator={<LanguageIcon sx={{ color: '#FFF', fontSize: 18 }} />}> {company?.website}</Typography>
                                                <Typography sx={{ color: '#FFF' }} startDecorator={<BusinessIcon sx={{ color: '#FFF', fontSize: 18 }} />}> {company?.scale}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Card>

                            <Stack gap={3}>
                                <Stack
                                    direction={'row'}
                                    gap={2}
                                    flexWrap={'wrap'}
                                >

                                    <Stack flex={2} >
                                        <Card>
                                            <CardOverflow sx={{ background: "linear-gradient(90deg, #22c96d, #BFFFC7)", py: 1 }} >
                                                <Typography level="h4">Giới thiệu công ty</Typography>
                                            </CardOverflow>
                                            <p dangerouslySetInnerHTML={{ __html: denormalizeTextAreaContent(company?.description) || '' }} />
                                        </Card>
                                    </Stack>
                                    <Stack flex={1}>
                                        <Card>
                                            <CardOverflow sx={{ background: "linear-gradient(90deg, #22c96d, #BFFFC7)", py: 1 }} >
                                                <Typography level="h4">Thông tin liên hệ</Typography>
                                            </CardOverflow>
                                            <Typography level="title-md"><LocationOnIcon sx={{ color: '#00b14f' }} />Địa chỉ công ty</Typography>
                                            <Typography ml={1}>{company?.address}, {company?.district}, {company?.city}</Typography>
                                            <Typography level="title-md"><NearMeIcon sx={{ color: '#00b14f' }} />Sao chép đường dẫn</Typography>
                                            <Input
                                                size="sm"
                                                endDecorator={
                                                    <IconButton variant="soft" onClick={handleCopy}>
                                                        <ContentCopyIcon />
                                                    </IconButton>
                                                }
                                                value={company?.website}
                                            />
                                        </Card>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography level="h4">Chọn công ty có sẵn</Typography>
                                <Button color="success" onClick={() => navigate('/setting')}>Tạo công ty mới</Button>
                            </Stack>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "repeat(1fr)",
                                        sm: "repeat(2, 1fr)",
                                        md: "repeat(3, 1fr)",
                                    },
                                    gap: 3,
                                    mt: 2,
                                }}
                            >
                                {listCompany.map((company, index) => (
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
                                        <Stack direction={'row'} gap={1}>
                                            <img
                                                src={`${company?.logo}`}
                                                alt="Company Logo"
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '5px',
                                                }}
                                            />

                                            <Stack>
                                                <Tooltip title={company?.companyName} placement="top" arrow>
                                                    <Link href={`/company-details/${company.id}`} underline="none">
                                                        <Typography
                                                            level="title-md"
                                                            className="hover-text"  
                                                            sx={{
                                                                transition: 'color 0.3s',
                                                            }}
                                                        >
                                                            {company?.companyName}
                                                        </Typography>
                                                    </Link>
                                                </Tooltip>
                                                <Stack direction={'row'} gap={2} >
                                                    <Stack><p className="line-clamp-1 text-sm">{company?.address}</p></Stack>
                                                    <Button size="sm" onClick={() => handleUpdateCompany(company?.id)}>Chọn</Button>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Card>
                                ))}
                            </Box>
                        </Stack>
                    )}
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
            </Box>
        </CssVarsProvider>
    );
}
