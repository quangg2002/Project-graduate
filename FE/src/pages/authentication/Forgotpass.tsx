import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import bg from '../../assets/images/bg-login.jpg';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { processForgotPassword } from "../../services/authApi"
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function Forgotpass() {
    const dispatch = useAppDispatch();

    const handleSubmit = async (values) => {
        try {
            console.log(values)
            dispatch(startLoading());
            const result = await dispatch(processForgotPassword({ email: values.email }))
            dispatch(stopLoading())

            if(result?.payload?.response?.success) toast.success("Mật khẩu đã được gửi về gmail của bạn. Vui lòng kiểm tra gmail")
            else toast.error("Gmail không tồn tại.")
        }
        catch (error) {
            toast.error('Đã có lỗi xảy ra.');
        }
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ":root": {
                        "--Form-maxWidth": "800px",
                        "--Transition-duration": "0.4s",
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: { xs: "100%", md: "100%" },
                    transition: "width var(--Transition-duration)",
                    transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    backdropFilter: "blur(12px)",
                    backgroundColor: "rgba(255 255 255 / 0.2)",
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundColor: "rgba(19 19 24 / 0.4)",
                    },
                })}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "100dvh",
                        width: "100%",
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{ py: 3, display: "flex", justifyContent: "space-between" }}
                    >
                        <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
                            <img src={require('../../assets/images/logocompany.png')} style={{ width: '35px', height: 'auto', marginLeft: 10 }} alt="My Image" />
                            <Typography level="title-lg">FindJob Company</Typography>
                        </Box>
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: "auto",
                            py: 2,
                            pb: 5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: 400,
                            maxWidth: "100%",
                            mx: "auto",
                            borderRadius: "sm",
                            "& form": {
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: "hidden",
                            },
                        }}
                    >
                        <Stack sx={{ gap: 4, mb: 2 }}>
                            <Stack sx={{ gap: 1 }}>
                                <Typography component="h1" level="h3">
                                    Quên mật khẩu
                                </Typography>
                                <Typography level="body-sm">
                                    Bạn đã có tài khoản?  &nbsp;
                                    <Link href="/login" level="title-sm">
                                        Đăng nhập ngay!
                                    </Link>
                                </Typography>
                            </Stack>
                        </Stack>
                        <Formik
                            initialValues={{
                                email: "",
                            }}
                            validationSchema={SignInSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors }) => (
                                <Form>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                                        <FormControl required sx={{ width: '100%' }}>
                                            <FormLabel><Typography level="title-md">Nhập địa chỉ email</Typography></FormLabel>
                                            <Field name="email" as={Input} type="email" fullWidth />
                                        </FormControl>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Gửi....' : 'Gửi'}
                                        </Button>
                                    </Box>
                                    <Typography color="danger" sx={{ fontSize: '12px' }}>
                                        {errors.email}
                                    </Typography>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" sx={{ textAlign: "center" }}>
                            © Find word {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: "100%",
                    position: "fixed",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: 0 },
                    transition:
                        "background-image var(--Transition-duration), left var(--Transition-duration) !important",
                    transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                    backgroundColor: "background.leve2",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url(${bg})`
                })}
            />
        </CssVarsProvider>
    );
}
