import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { confirmAlert } from 'react-confirm-alert'; // Import thư viện
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Box, Breadcrumbs, Button, Card, CardCover, CssBaseline, CssVarsProvider, Divider, FormControl, FormLabel, Input, Link, Modal, ModalClose, Sheet, Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Header from "../../components/Header";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { updateEmployee } from '../../services/employeeApi';
import { getEmployees } from '../../services/employeeApi';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { useNavigate } from 'react-router-dom';

const SignUpSchema = Yup.object().shape({
    fullName: Yup.string()
        .required("Họ tên là bắt buộc"),
    email: Yup.string()
        .email('Email không hợp lệ'),
    phoneNumber: Yup.string(),
    workPosition: Yup.string(),
    career: Yup.string(),
});


export default function Info() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [employeeData, setEmployeeData] = useState({
        fullName: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        email: '',
        phoneNumber: '',
    })

    const navigate = useNavigate();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        confirmAlert({
            title: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn cập nhật thông tin cá nhân với hình ảnh mới này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        const formData = new FormData();
                        formData.append('avatar', file);

                        const result = await dispatch(updateEmployee(formData));
                        if (result?.payload?.response?.success === true) {
                            toast.success('Cập nhật thông tin cá nhân thành công');
                        } else {
                            toast.error('Cập nhật thông tin cá nhân thất bại');
                        }

                        setPreviewUrl(URL.createObjectURL(file));
                    },
                    style: {
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    },
                },
                {
                    label: 'Không',
                    onClick: () => {
                        console.log('Cập nhật bị hủy bỏ');
                    },
                    style: {
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    },
                }
            ]
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif']
        }
    });

    const [openEdit, setOpenEdit] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const action = await dispatch(getEmployees());
                if (getEmployees.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) {
                        setEmployeeData({
                            fullName: response.fullName,
                            gender: response.gender,
                            dateOfBirth: response.dateOfBirth,
                            address: response.address,
                            email: response.email,
                            phoneNumber: response.phoneNumber,
                        });
                        setPreviewUrl(response.avatar)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch employee data:', error);
            }
        };

        fetchEmployeeData();
    }, [dispatch]);


    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header />

            <Box component="main" className="MainContent" width={'95%'} alignSelf={'center'} justifySelf={'center'}>
                <Box display={'flex'} alignItems={'center'} mt={2} mb={2}>
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
                        <Typography color="primary" level="body-xs">
                            Thông tin cá nhân
                        </Typography>
                    </Breadcrumbs>
                </Box>
                <Box
                    borderRadius={10}
                    boxShadow={'xl'}
                    border={'2px solid #F0F0F0'}
                    sx={{
                        bgcolor: "#f0F0F0",
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 5 },
                        maxWidth: "100vw",
                    }}>
                    <Box mb={3}>
                        <Typography level="h3">Thông tin cá nhân</Typography>
                        <Typography level="body-xs">
                            Tùy chỉnh các thông tin hồ sơ của bạn.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "minmax(180px, 300px) minmax(400px, 1fr)",
                            },
                            gap: { xs: 2, sm: 2, md: 8 },
                            width: "100%",
                            maxWidth: "100vw",
                        }}
                    >
                        <Box>
                            <Box {...getRootProps()} style={{ position: 'relative' }}>
                                <Card sx={{ height: '200px', borderRadius: 0 }}>
                                    <input {...getInputProps()} />
                                    <CardCover>
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <Typography level="body-sm" textAlign={'center'}>Kéo thả hình ảnh vào đây hoặc click để chọn file</Typography>
                                        )}
                                    </CardCover>
                                </Card>
                                {previewUrl &&
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0)), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                                            padding: 2,
                                            width: '100%'
                                        }}
                                        position={'absolute'}
                                        bottom={0}
                                    >
                                        <Typography level="body-md" textAlign={'center'} sx={{ color: '#FFF' }}>
                                            Thay đổi hình ảnh
                                        </Typography>
                                    </Box>
                                }
                            </Box>
                            <Typography level="title-md">Work Link</Typography>
                            <Typography level="title-md">Skin</Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={"column"} gap={2} maxWidth={'100%'}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Box>
                                    <Typography level="h3">{employeeData.fullName}</Typography>
                                    <Typography level="h4" color="primary">Vị trí: BackEnd</Typography>
                                </Box>
                                <Button variant="soft" color="primary" size="sm" onClick={() => setOpenEdit(true)} startDecorator={<BorderColorIcon sx={{ fontSize: 'sm' }} />}>
                                    <Typography level="body-sm">Chỉnh sửa</Typography>
                                </Button>
                            </Box>
                            <Tabs
                                defaultValue={0}
                                aria-label="Basic tabs"
                                sx={{
                                    bgcolor: 'transparent'
                                }}
                            >
                                <TabList>
                                    <Tab
                                        sx={{
                                            '&.Mui-selected': {
                                                color: 'var(--variant-plainColor, rgba(var(--joy-palette-primary-mainChannel) / 1))',
                                            },
                                        }}
                                    >
                                        Thông tin
                                    </Tab>
                                    <Tab indicatorPlacement={"bottom"}>
                                        Kinh Nghiệm
                                    </Tab>
                                </TabList>
                                <TabPanel value={0}>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "30% 60%",
                                            gap: { xs: 4, sm: 8, md: 12 }
                                        }}
                                    >
                                        <Box display={'flex'} flexDirection={'column'} gap={1}>
                                            <Typography>Họ và tên: </Typography>
                                            <Typography>Email: </Typography>
                                            <Typography>Số điện thoại: </Typography>
                                            <Typography>Giới tính: </Typography>
                                        </Box>
                                        <Box display={'flex'} flexDirection={'column'} gap={1}>
                                            <Typography color="primary">{employeeData.fullName}</Typography>
                                            <Typography
                                                color="primary"
                                                sx={{
                                                    wordBreak: 'break-word',
                                                    overflowWrap: 'break-word',
                                                    whiteSpace: 'normal'
                                                }}
                                            >
                                                {employeeData.email}
                                            </Typography>
                                            <Typography color="primary">{employeeData.phoneNumber}</Typography>
                                            <Typography color="primary">{employeeData.gender}</Typography>
                                        </Box>
                                    </Box>
                                </TabPanel>
                            </Tabs>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{ width: '70%', borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                    >
                        Thay đổi thông tin của bạn
                    </Typography>
                    <Box id="modal-desc" mt={2} gap={3}>
                        <Formik
                            initialValues={{
                                fullName: 'Ngô Minh Quang',
                                workPosition: '',
                                email: 'ngominhquang12a2nl@gmail.com',
                                phoneNumber: '',
                                career: '',
                            }}
                            validationSchema={SignUpSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    dispatch(startLoading());

                                    const formData = new FormData();
                                    formData.append('fullName', values.fullName);
                                    formData.append('email', values.email);
                                    formData.append('phoneNumber', values.phoneNumber);
                                    const result = await dispatch(updateEmployee(formData));

                                    dispatch(stopLoading());

                                    console.log(result?.payload?.response?.success)
                                    if (result?.payload?.response?.success == true) {
                                        toast.success('Cập nhật thành công');
                                        navigate('/info')
                                    } else {
                                        toast.error('Cập nhật thất bại');
                                    }

                                } catch (error) {
                                    toast.error('Đã có lỗi xảy ra.');
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <FormControl required sx={{ mb: 2 }}>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <Field
                                            name="fullName"
                                            as={Input}
                                            placeholder='Nhập họ và tên'
                                        />
                                    </FormControl>

                                    <FormControl required sx={{ mb: 2 }}>
                                        <FormLabel>Email</FormLabel>
                                        <Field
                                            name="email"
                                            as={Input}
                                            disabled
                                        />
                                    </FormControl>

                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap={'wrap'} mb={2}>

                                        <FormControl sx={{ flexGrow: 1 }}>
                                            <FormLabel>Nghề Nghiệp</FormLabel>
                                            <Field
                                                name="career"
                                                as={Input}
                                                placeholder='Nhập nghề nghiệp'
                                            />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 1 }}>
                                            <FormLabel>Vị trí làm việc</FormLabel>
                                            <Field
                                                name="workPosition"
                                                as={Input}
                                                placeholder='Nhập vị trí làm việc'
                                            />
                                        </FormControl>
                                    </Stack>

                                    <FormControl sx={{ flexGrow: 1 }}>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <Field
                                            name="phoneNumber"
                                            as={Input}
                                            placeholder='Nhập số điện thoại'
                                        />
                                    </FormControl>

                                    <Divider />
                                    <Box display="flex" alignItems={"flex-end"} justifyContent={"right"} mt={2} >
                                        <Button type="submit" size="md" variant="solid" color='success' disabled={isSubmitting}>
                                            Lưu
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Sheet>
            </Modal>
        </CssVarsProvider>
    );
}
