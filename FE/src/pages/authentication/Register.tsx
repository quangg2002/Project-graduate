import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { registerEmployee } from '../../services/authApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';

const SignUpSchema = Yup.object().shape({
    username: Yup.string()
        .required('Username là bắt buộc')
        .max(255, 'User không được quá 255 ký tự'),
    fullname: Yup.string()
        .max(255, 'Họ và tên không được quá 255 ký tự')
        .required('Họ và tên là bắt buộc'),
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(25, 'Mật khẩu không được vượt quá 25 ký tự')
        .matches(/[a-z]/, 'Mật khẩu phải bao gồm chữ thường')
        .matches(/[A-Z]/, 'Mật khẩu phải bao gồm chữ hoa')
        .matches(/\d/, 'Mật khẩu phải bao gồm ký tự số')
        .matches(/[!#@$%^&*)(+=._-]/, 'Mật khẩu phải bao gồm ít nhất một ký tự đặc biệt')
        .required('Mật khẩu là bắt buộc'),
    retryPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        .required('Nhập lại mật khẩu là bắt buộc'),
});

export default function Register() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': '0.4s',
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: { xs: '100%', md: '100%' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: 'rgba(19 19 24 / 0.4)',
                    },
                })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: '100%',
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
                            <img src={require('../../assets/images/logocompany.png')} style={{ width: '35px', height: 'auto', marginLeft: 10 }} alt="My Image" />
                            <Typography level="title-lg">Company</Typography>
                        </Box>
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 400,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden',
                            },
                        }}
                    >
                        <Stack sx={{ gap: 4 }}>
                            <Stack sx={{ gap: 1 }}>
                                <Typography component="h1" level="h3">
                                    Sign up
                                </Typography>
                                <Typography level="body-sm">
                                    Have a account?{' '}
                                    <Link href="/login" level="title-sm">
                                        Sign in!
                                    </Link>
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack sx={{ gap: 1, mt: 2 }}>
                            <Formik
                                initialValues={{
                                    username: '',
                                    fullname: '',
                                    email: '',
                                    password: '',
                                    retryPassword: '',
                                }}
                                validationSchema={SignUpSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        dispatch(startLoading());
                                        const result = await dispatch(
                                            registerEmployee({
                                                username: values.username,
                                                fullname: values.fullname,
                                                email: values.email,
                                                password: values.password,
                                                retryPassword: values.retryPassword
                                            })
                                        );
                                        dispatch(stopLoading());

                                        console.log(result?.payload?.response?.success)

                                        if (result?.payload?.response?.success == true) {
                                            navigate("/login");
                                            toast.success('Đăng ký thành công');
                                        } else {
                                            toast.error('Đăng ký thất bại');
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
                                                <FormLabel>Username</FormLabel>
                                                <Field name="username" as={Input} />
                                                {errors.username && touched.username && (
                                                    <Typography color="danger" level='body-xs'>
                                                        {errors.username}
                                                    </Typography>
                                                )}
                                            </FormControl>

                                            <FormControl required>
                                                <FormLabel>Họ và tên</FormLabel>
                                                <Field name="fullname" as={Input} />
                                                <Typography color="danger" level='body-xs'>
                                                    {errors.fullname}
                                                </Typography>
                                            </FormControl>

                                            <FormControl required>
                                                <FormLabel>Email</FormLabel>
                                                <Field name="email" as={Input} type="email" />
                                                <Typography color="danger" level='body-xs'>
                                                    {errors.email}
                                                </Typography>
                                            </FormControl>

                                            <FormControl required>
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <Field
                                                    name="password"
                                                    as={Input}
                                                    type={showPassword ? 'text' : 'password'}
                                                    endDecorator={
                                                        <IconButton onClick={togglePasswordVisibility} sx={{ marginLeft: 1 }}>
                                                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                        </IconButton>
                                                    }
                                                />
                                                <Typography color="danger" level='body-xs'>
                                                    {errors.password}
                                                </Typography>
                                            </FormControl>

                                            <FormControl required>
                                                <FormLabel>Nhập lại mật khẩu</FormLabel>
                                                <Field
                                                    name="retryPassword"
                                                    as={Input}
                                                    type={showPassword ? 'text' : 'password'}
                                                    endDecorator={
                                                        <IconButton onClick={togglePasswordVisibility} sx={{ marginLeft: 1 }}>
                                                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                        </IconButton>
                                                    }
                                                />
                                                <Typography color="danger" level='body-xs'>
                                                    {errors.retryPassword}
                                                </Typography>
                                            </FormControl>

                                            <Stack sx={{ gap: 4, mt: 2 }}>
                                                <Button type="submit" fullWidth disabled={isSubmitting}>
                                                    Đăng ký
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Form>
                                )}
                            </Formik>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                            © Find word {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: 0 },
                    transition:
                        'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
                    },
                })}
            />
        </CssVarsProvider>
    );
}