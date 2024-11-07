import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { login } from '../../services/authApi';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';


const SignInSchema = Yup.object().shape({
  email: Yup.string(),
  password: Yup.string()
    .min(6, "Password is too short")
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const { isLoading } = useSelector((state: RootState) => state.loadingReducer);
  const [sessionExp, setSessionExp] = useState(queryParams.get('expired') == null ? false : true);

  useEffect(() => {
    sessionExp && toast.info("Phiên đăng nhập của bạn đã kết thúc", { autoClose: false })
    console.log(sessionExp)
  }, [sessionExp]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
 
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
              <Typography level="title-lg">Company</Typography>
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
                  Sign in
                </Typography>
                <Typography level="body-sm">
                  New to member?{" "}
                  <Link href="/register" level="title-sm">
                    Sign up!
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Stack sx={{ gap: 4, mt: 2 }}>
              <Formik
                initialValues={{
                  username: "",
                  password: "",
                }}
                validationSchema={SignInSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    dispatch(startLoading());
                    const result = await dispatch(login({ username: values.username, password: values.password }));
                    dispatch(stopLoading());

                    console.log(result?.payload?.response?.success)

                    if (result?.payload?.response?.success) {
                      if (result?.payload?.response?.data.role === 'EMPLOYEE') {
                        navigate('/info');
                      } else {
                        navigate('/info');
                      }
                    } else {
                      toast.error('Đăng nhập thất bại. Kiểm tra lại tài khoản mật khẩu của bạn');
                    }
                  } catch (error) {
                    toast.error('Đã có lỗi xảy ra.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, errors }) => (
                  <Form>
                    <FormControl required>
                      <FormLabel>Tài khoản</FormLabel>
                      <Field name="username" as={Input} placeholder="Nhập tên tài khoản"/>
                      <Typography color="danger" sx={{ fontSize: '12px' }}>
                        {errors.username}
                      </Typography>
                    </FormControl>

                    <FormControl required>
                      <FormLabel>Mật khẩu</FormLabel>
                      <Field
                        name="password"
                        as={Input}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        endDecorator={
                          <IconButton
                            onClick={handleClickShowPassword}
                            aria-label="toggle password visibility"
                            sx={{ marginLeft: 1 }}
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        }
                      />

                      <Typography color="danger" sx={{ fontSize: '12px' }}>
                        {errors.password}
                      </Typography>
                    </FormControl>

                    <Stack sx={{ gap: 4, mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Field
                          name="persistent"
                          type="checkbox"
                          as={Checkbox}
                          label="Remember me"
                        />
                        <Link level="title-sm" href="#replace-with-a-link">
                          Forgot your password?
                        </Link>
                      </Box>

                      <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Stack>
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
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
          },
        })}
      />
    </CssVarsProvider>
  );
}
