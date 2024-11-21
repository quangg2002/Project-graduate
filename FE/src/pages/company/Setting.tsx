import Box from "@mui/material/Box";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Tabs, TabList, Tab, TabPanel, Stack, FormControl, FormLabel, Input, IconButton, Typography, Button, Drawer, ModalClose, DialogTitle, Autocomplete, Card, CardCover, Textarea } from '@mui/joy';
import LockIcon from '@mui/icons-material/Lock';
import Person2Icon from '@mui/icons-material/Person2';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { changePassword } from '../../services/authApi';
import { useCallback, useState, useEffect } from "react";
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import city from '../../utils/citis.json';
import districts from '../../utils/districts.json';
import { useDropzone } from "react-dropzone";

const SignUpSchema2 = Yup.object().shape({
    currentPassword: Yup.string()
        .required('Mật khẩu là bắt buộc')
    ,
    newPassword: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(25, 'Mật khẩu không được vượt quá 25 ký tự')
        //   .matches(/[a-z]/, 'Mật khẩu phải bao gồm chữ thường')
        //   .matches(/[A-Z]/, 'Mật khẩu phải bao gồm chữ hoa')
        //   .matches(/\d/, 'Mật khẩu phải bao gồm ký tự số')
        //   .matches(/[!#@$%^&*)(+=._-]/, 'Mật khẩu phải bao gồm ít nhất một ký tự đặc biệt')
        .required('Mật khẩu là bắt buộc'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Mật khẩu không khớp')
        .required('Nhập lại mật khẩu là bắt buộc'),
});


export default function Setting() {

    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewUrlAvata, setPreviewUrlAvata] = useState<string | null>(null);

    const genderOptions = [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
    ];


    const onDropLogo = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    }, []);

    const onDropAvata = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setPreviewUrlAvata(URL.createObjectURL(file));
        }
    }, []);

    const {
        getRootProps: getRootPropsLogo,
        getInputProps: getInputPropsLogo,
    } = useDropzone({
        onDrop: onDropLogo,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png", ".gif"],
        },
    });

    const {
        getRootProps: getRootPropsAvata,
        getInputProps: getInputPropsAvata,
    } = useDropzone({
        onDrop: onDropAvata,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png", ".gif"],
        },
    });


    const handleCityChange = (event, newValue) => {
        setSelectedCity(newValue);
        setSelectedDistrict(null);
        if (newValue) {
            const districtsForCity = districts.filter(
                (district: any) => district.city_id === newValue.id
            );
            setFilteredDistricts(districtsForCity);
        } else {
            setFilteredDistricts([]);
        }
    }

    const dispatch = useAppDispatch();
    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field: string) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmitChangeInfoCity = async (values) => {

    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header />
            <Stack
                sx={[
                    {
                        bgcolor: "background.appBody",
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(150px, 200px) minmax(450px, 1fr)",
                            md: "minmax(200px, 300px) minmax(600px, 1fr)",
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
                    component="main"
                    className="MainContent"
                    sx={{
                        bgcolor: "background.level1",
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        gap: 2,
                        minHeight: '89vh'
                    }}
                >
                    <Tabs
                        aria-label="Vertical tabs"
                        orientation="vertical"
                    >
                        <TabList sx={{ gap: 1 }}>
                            <Tab><LockIcon /> Đổi mật khẩu</Tab>
                            <Tab><Person2Icon />Thông tin cá nhân</Tab>
                            <Tab><ApartmentIcon />Thông tin công ty</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <Stack width={'80%'} justifySelf={'center'} mt={1} mb={1}>
                                <Formik
                                    initialValues={{
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: '',
                                    }}
                                    validationSchema={SignUpSchema2}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        try {
                                            dispatch(startLoading());
                                            const result = await dispatch(
                                                changePassword({
                                                    oldPassword: values.currentPassword,
                                                    newPassword: values.newPassword,
                                                    confirmPassword: values.confirmPassword,
                                                })
                                            );
                                            dispatch(stopLoading());

                                            if (result?.payload?.response?.success === true) {
                                                toast.success('Thay đổi mật khẩu thành công');
                                            } else if (result?.payload?.response?.message === "Auth password old incorrect") {
                                                toast.error('Mật khẩu không chính xác');
                                            } else if (result?.payload?.response?.message === "Auth password same as old") {
                                                toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại');
                                            } else {
                                                toast.error('Thay đổi mật khẩu thất bại');
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
                                            <Stack sx={{ gap: 2 }}>
                                                <FormControl required>
                                                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                                                    <Field
                                                        name="currentPassword"
                                                        as={Input}
                                                        type={passwordVisibility.currentPassword ? 'text' : 'password'}
                                                        endDecorator={
                                                            <IconButton onClick={() => togglePasswordVisibility('currentPassword')}>
                                                                {passwordVisibility.currentPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                            </IconButton>
                                                        }
                                                    />
                                                    <Typography color="danger" sx={{ fontSize: '12px' }}>
                                                        {errors.currentPassword}
                                                    </Typography>
                                                </FormControl>

                                                <FormControl required>
                                                    <FormLabel>Mật khẩu</FormLabel>
                                                    <Field
                                                        name="newPassword"
                                                        as={Input}
                                                        type={passwordVisibility.newPassword ? 'text' : 'password'}
                                                        endDecorator={
                                                            <IconButton onClick={() => togglePasswordVisibility('newPassword')}>
                                                                {passwordVisibility.newPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                            </IconButton>
                                                        }
                                                    />
                                                    <Typography color="danger" sx={{ fontSize: '12px' }}>
                                                        {errors.newPassword}
                                                    </Typography>

                                                </FormControl>

                                                <FormControl required>
                                                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                                                    <Field
                                                        name="confirmPassword"
                                                        as={Input}
                                                        type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                                                        endDecorator={
                                                            <IconButton onClick={() => togglePasswordVisibility('confirmPassword')}>
                                                                {passwordVisibility.confirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                            </IconButton>
                                                        }
                                                    />
                                                    <Typography color="danger" sx={{ fontSize: '12px' }}>
                                                        {errors.confirmPassword}
                                                    </Typography>
                                                </FormControl>
                                                <Stack direction={'row'} justifyContent={'flex-end'}>
                                                    <Button type="submit" variant="solid" color='success' disabled={isSubmitting}>
                                                        Cập nhật
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Form>
                                    )}
                                </Formik>
                            </Stack>
                        </TabPanel>
                        <TabPanel value={1}>

                            <Formik
                                initialValues={{
                                    avt: null,
                                    fullName: '',
                                    address: '',
                                    email: '',
                                    phoneNumber: '',
                                    gender: '',
                                    companyId: '',
                                }}
                                onSubmit={async (values, { setSubmitting }) => {

                                }}
                            >
                                {({ isSubmitting, errors, touched, setFieldValue }) => (
                                    <Form>
                                        <Stack gap={2} mt={2}>
                                            <Stack direction={'row'} gap={2}>
                                                <Stack flex={1}>
                                                    <Box {...getRootPropsAvata()} style={{ position: 'relative' }}>
                                                        <Card sx={{ height: '150px', borderRadius: 0 }}>
                                                            <input
                                                                {...getInputPropsAvata()}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const file = event.currentTarget.files?.[0];
                                                                    if (file) {
                                                                        setPreviewUrlAvata(URL.createObjectURL(file))
                                                                        setFieldValue('avt', file);
                                                                    }
                                                                }}
                                                            />
                                                            <CardCover>
                                                                {previewUrlAvata ? (
                                                                    <img
                                                                        src={previewUrlAvata}
                                                                        alt="Preview"
                                                                        style={{ objectFit: "cover" }}
                                                                    />
                                                                ) : (
                                                                    <Typography level="body-xs" textAlign={'center'}>Kéo thả hình ảnh vào đây hoặc click để chọn file</Typography>
                                                                )}
                                                            </CardCover>
                                                        </Card>
                                                        {previewUrlAvata &&
                                                            <Box
                                                                sx={{
                                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0)), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                                                                    padding: 2,
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
                                                </Stack>
                                                <Stack flex={4} gap={2}>
                                                    <FormControl required>
                                                        <FormLabel>Họ và tên</FormLabel>
                                                        <Field
                                                            name="fullName"
                                                            as={Input}
                                                            placeholder='Nhập họ và tên'
                                                        />
                                                    </FormControl>

                                                    <FormControl required>
                                                        <FormLabel>Email</FormLabel>
                                                        <Field
                                                            name="email"
                                                            as={Input}
                                                            disabled
                                                        />
                                                    </FormControl>
                                                </Stack>
                                            </Stack>

                                            <FormControl>
                                                <FormLabel>Giới tính</FormLabel>
                                                <Field name="gender">
                                                    {() => (
                                                        <Autocomplete
                                                            options={genderOptions}
                                                            getOptionLabel={(option: any) => option.label}
                                                            onChange={(event, newValue: any) =>
                                                                setFieldValue("gender", newValue?.value || "")
                                                            }

                                                        />
                                                    )}
                                                </Field>
                                            </FormControl>

                                            <FormControl sx={{ flex: 1 }}>
                                                <FormLabel>Công ty</FormLabel>
                                                <Field name="companyId">
                                                    {() => (
                                                        <Autocomplete
                                                            options={genderOptions} 
                                                            getOptionLabel={(option: any) => option.label}
                                                            onChange={(event, newValue: any) =>
                                                                setFieldValue("companyId", newValue?.value || "")
                                                            }
                                                            defaultValue={[genderOptions[0]]}
                                                        />
                                                    )}
                                                </Field>
                                            </FormControl>

                                            <FormControl sx={{ flex: 1 }}>
                                                <FormLabel>Địa chỉ cư trú</FormLabel>
                                                <Field
                                                    name="address"
                                                    as={Input}
                                                    placeholder='Nhập vị trí làm việc'
                                                />
                                            </FormControl>

                                            <FormControl sx={{ flex: 1 }}>
                                                <FormLabel>Số điện thoại</FormLabel>
                                                <Field
                                                    name="phoneNumber"
                                                    as={Input}
                                                    placeholder='Nhập số điện thoại'
                                                />
                                            </FormControl>

                                            <Box display="flex" alignItems={"flex-end"} justifyContent={"right"} mt={2} >
                                                <Button type="submit" size="md" variant="solid" color='success' disabled={isSubmitting}>
                                                    Cập nhật
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Form>
                                )}
                            </Formik>

                        </TabPanel>
                        <TabPanel value={2}>
                            <Formik
                                initialValues={{
                                    nameCity: '',
                                    location: '',
                                    city: '',
                                    district: '',
                                    website: '',
                                    scale: '',
                                    logo: '',
                                    description: ''
                                }}
                                onSubmit={handleSubmitChangeInfoCity}
                            >
                                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                                    <Form>
                                        <Stack gap={2}>
                                            <FormControl required>
                                                <FormLabel>Tên công ty</FormLabel>
                                                <Field
                                                    name="nameCity"
                                                    as={Input}
                                                    placeholder="Nhập tên công ty"
                                                />
                                            </FormControl>

                                            <FormControl required>
                                                <FormLabel>Trụ sở chính</FormLabel>
                                                <Field
                                                    name="location"
                                                    as={Input}
                                                    placeholder="Trụ sở chính"
                                                />
                                            </FormControl>

                                            <Stack direction={'row'} gap={2} flexWrap={'wrap'}>
                                                <Stack flex={1} gap={1}>
                                                    <FormLabel>Tỉnh / Thành phố</FormLabel>
                                                    <Autocomplete
                                                        placeholder="Tỉnh/ Thành phố"
                                                        options={city}
                                                        getOptionLabel={(option: any) => option.name}
                                                        onChange={(event, newValue: any) => {
                                                            handleCityChange(event, newValue)
                                                            setFieldValue("city", newValue ? newValue.id.toString() : "");
                                                        }}
                                                    />
                                                </Stack>
                                                <Stack flex={1} gap={1}>
                                                    <FormLabel>Quận / Huyện</FormLabel>
                                                    <Autocomplete
                                                        placeholder="Quận Huyện"
                                                        options={filteredDistricts}
                                                        getOptionLabel={(option: any) => option.name}
                                                        value={selectedDistrict}
                                                        onChange={(event, newValue: any) => {
                                                            setSelectedDistrict(newValue)
                                                            setFieldValue("district", newValue ? newValue.id.toString() : "");
                                                        }}
                                                        disabled={!selectedCity}
                                                    />
                                                </Stack>
                                            </Stack>

                                            <Stack direction={'row'} gap={2} flexWrap={'wrap'}>
                                                <Stack flex={1}>
                                                    <FormControl>
                                                        <FormLabel>Website</FormLabel>
                                                        <Field
                                                            name="website"
                                                            as={Input}
                                                            placeholder="https://example.com"
                                                        />
                                                    </FormControl>
                                                </Stack>
                                                <Stack flex={1} gap={1}>
                                                    <FormLabel>Quy mô</FormLabel>
                                                    <Autocomplete
                                                        placeholder="Quy mô"
                                                        options={filteredDistricts}
                                                        getOptionLabel={(option: any) => option.name}
                                                        value={selectedDistrict}
                                                        onChange={(event, newValue: any) => {
                                                            setSelectedDistrict(newValue)
                                                            setFieldValue("district", newValue ? newValue.id.toString() : "");
                                                        }}
                                                    />
                                                </Stack>
                                            </Stack>

                                            <FormControl>
                                                <FormLabel>Logo</FormLabel>
                                                <Box {...getRootPropsLogo()} style={{ position: 'relative' }}>
                                                    <Card sx={{ height: '200px', maxWidth: "200px", borderRadius: 0 }}>
                                                        <input
                                                            {...getInputPropsLogo()}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                const file = event.currentTarget.files?.[0];
                                                                if (file) {
                                                                    setFieldValue('logo', file);
                                                                    setPreviewUrl(URL.createObjectURL(file))
                                                                }
                                                            }}
                                                        />
                                                        <CardCover>
                                                            {previewUrl ? (
                                                                <img
                                                                    src={previewUrl}
                                                                    alt="Preview"
                                                                    style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
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
                                                                minWidth: '200px'
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
                                            </FormControl>

                                            <FormControl required>
                                                <FormLabel>Mô Tả</FormLabel>
                                                <Field
                                                    name="description"
                                                    as={Textarea}
                                                    fullWidth
                                                    minRows={3}
                                                    placeholder="Mô tả công ty"
                                                />
                                            </FormControl>
                                            <Stack direction={'row'} justifyContent={'flex-end'} >
                                                <Button type="submit" color="success" disabled={isSubmitting}>
                                                    Cập nhật
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Form>
                                )}
                            </Formik>
                        </TabPanel>
                    </Tabs>

                </Box>
            </Stack>
        </CssVarsProvider>
    );
}
