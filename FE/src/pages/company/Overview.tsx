import Box from "@mui/material/Box";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Typography, Card, CardCover, CardContent, Link, Tooltip, IconButton, Breadcrumbs, Stack, CardOverflow, Input, Snackbar } from "@mui/joy";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CampaignIcon from '@mui/icons-material/Campaign';
import TaskIcon from '@mui/icons-material/Task';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { useState, useEffect } from "react";
import { getCompany } from '../../services/companyApi';
import city from '../../utils/citis.json';
import districts from '../../utils/districts.json';

export default function Overview() {

    const dispatch = useAppDispatch();
    const [openAlert, setOpenAlert] = useState(false);
    const [company, setCompany] = useState({
        companyName: '',
        description: '',
        website: '',
        logo: '',
        address: '',
        city: null,
        district: null,
    });

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
                                    <Typography color='primary' level="h4">8</Typography>
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
                                    <Typography color='success' level="h4">8</Typography>
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
                                    <Typography color='danger' level="h4">8</Typography>
                                    <Typography color='danger' level="h4">CV ứng tuyển mới</Typography>
                                </Stack>
                                <Stack flex={1}>
                                    <LibraryAddIcon sx={{ fontSize: '30px', color: '#C41C1C' }} />
                                </Stack>
                            </Stack>
                        </Stack>

                    </Box>
                    <Stack gap={3}>
                        <Stack>
                            <Typography level="h4">Thông tin công ty</Typography>
                            <Stack
                                flex={1}
                                sx={{ background: "linear-gradient(90deg, #BFFFA7, #18A5A7)", }}
                                position={'relative'}
                                minHeight={'150px'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                borderRadius={'10px'}
                            >

                                <Stack gap={2}>
                                    <Typography level="h3">{company.companyName}</Typography>
                                    <Stack direction={'row'} gap={4}>
                                        <Stack direction={'row'}>
                                            <LanguageIcon sx={{ color: '#000' }} /> &nbsp;
                                            <Typography level="title-md" >{company.website}</Typography>
                                        </Stack>

                                        <Stack direction={'row'}>
                                            <BusinessIcon sx={{ color: '#000' }} /> &nbsp;
                                            <Typography level="title-md">100-499 nhân viên</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack
                            direction={'row'}
                            gap={2}
                            flexWrap={'wrap'}
                        >
                            <Stack flex={2}>
                                <Card>
                                    <CardOverflow sx={{ background: "linear-gradient(90deg, #BFFFA7, #18A5A7)", py: 1 }} >
                                        <Typography level="h4">Giới thiệu công ty</Typography>
                                    </CardOverflow>
                                    <Typography>{company.description}</Typography>
                                </Card>
                            </Stack>
                            <Stack flex={1}>
                                <Card>
                                    <CardOverflow sx={{ background: "linear-gradient(90deg, #BFFFA7, #18A5A7)", py: 1 }} >
                                        <Typography level="h4">Thông tin liên hệ</Typography>
                                    </CardOverflow>
                                    <Typography level="title-md"><LocationOnIcon sx={{ color: '#00b14f' }} />Địa chỉ công ty</Typography>
                                    <Typography ml={1}>{company.address}, {districts.at(company.district - 1).name}, {city.at(company.city - 1).name} </Typography>

                                    <Typography level="title-md"><NearMeIcon sx={{ color: '#00b14f' }} />Sao chép đường dẫn</Typography>
                                    <Input
                                        size="sm"
                                        endDecorator={
                                            <IconButton variant="soft" onClick={handleCopy}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        }
                                        value={company.website}
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
            </Box>
        </CssVarsProvider>
    );
}
