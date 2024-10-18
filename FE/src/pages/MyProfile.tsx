import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from 'react';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';


const SignUpSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Mật khẩu là bắt buộc')
  ,
  newPassword: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(25, 'Mật khẩu không được vượt quá 25 ký tự')
    .matches(/[a-z]/, 'Mật khẩu phải bao gồm chữ thường')
    .matches(/[A-Z]/, 'Mật khẩu phải bao gồm chữ hoa')
    .matches(/\d/, 'Mật khẩu phải bao gồm ký tự số')
    .matches(/[!#@$%^&*)(+=._-]/, 'Mật khẩu phải bao gồm ít nhất một ký tự đặc biệt')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu không khớp')
    .required('Nhập lại mật khẩu là bắt buộc'),
});

export default function MyProfile() {

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center' }} flexWrap={'wrap'}>
      <Stack
        spacing={4}
        sx={{
          margin: { xs: 2, md: 2 },
          width: { xs: '98%', md: '50%' },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Personal info</Typography>
            <Typography level="body-xs">
              Customize how your profile information will appear to the networks.
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
          >
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap={'wrap'}>
                <FormControl sx={{ flexGrow: 1 }} required>
                  <FormLabel>Full name</FormLabel>
                  <Input size="md" placeholder="full name" startDecorator={<PersonOutlineOutlinedIcon />} />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }} required>
                  <FormLabel>Phone Number </FormLabel>
                  <Input size="md" placeholder="phone number" color="primary" />
                </FormControl>
              </Stack>
              <Stack spacing={2}>
                <FormControl sx={{ flexGrow: 1 }} required>
                  <FormLabel>Email</FormLabel>
                  <Input
                    size="md"
                    type="email"
                    startDecorator={
                      <svg className="w-6 h-6 text-gray-800 dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="1.2" d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                      </svg>
                    }
                    placeholder="email"
                    disabled
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>Username</FormLabel>
                  <Input size="md" defaultValue=""/>
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
              <Button size="sm" variant="outlined">
                Cancel
              </Button>
              <Button size="sm" variant="solid">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>

        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Account</Typography>
            <Typography level="body-xs">
              Change the password for your account
            </Typography>
          </Box>
          <Divider />
          <Stack sx={{ gap: 1, mt: 2 }}>
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={SignUpSchema}
              onSubmit={(values, { setSubmitting }) => {
                console.log(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Stack sx={{ gap: 2 }}>
                    <FormControl required>
                      <FormLabel>Current password</FormLabel>
                      <Field name="currentPassword" as={Input} type="password"/>
                      <Typography color="danger" sx={{ fontSize: '12px' }}>
                        {errors.currentPassword}
                      </Typography>
                    </FormControl>

                    <FormControl required>
                      <FormLabel>Mật khẩu</FormLabel>
                      <Field
                        name="newPassword"
                        as={Input}
                        type={showPassword ? 'text' : 'password'}
                        endDecorator={
                          <IconButton onClick={togglePasswordVisibility} sx={{ marginLeft: 1 }}>
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
                        type={showPassword ? 'text' : 'password'}
                        endDecorator={
                          <IconButton onClick={togglePasswordVisibility} sx={{ marginLeft: 1 }}>
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        }
                      />
                      <Typography color="danger" sx={{ fontSize: '12px' }}>
                        {errors.confirmPassword}
                      </Typography>
                    </FormControl>
                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                      <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                        <Button size="sm" variant="outlined">
                          Cancel
                        </Button>
                        <Button size="sm" variant="solid" type="submit" fullWidth disabled={isSubmitting}>
                          Save
                        </Button>
                      </CardActions>
                    </CardOverflow>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Card>
      </Stack>

      <Stack
        spacing={4}
        sx={{
          maxWidth: { xs: '100%', md: '25%' },
          margin: { xs: 2, md: 2 },
          width: '100%',
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }} display={'flex'} columnGap={2} alignContent={'center'} justifyContent={'center'}>
            <AspectRatio
              ratio="1"
              maxHeight={60}
              sx={{ flex: 1, maxWidth: 60, borderRadius: '100%' }}
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                loading="lazy"
                alt=""
              />
              <IconButton
                aria-label="upload new picture"
                size="sm"
                variant="outlined"
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  borderRadius: '50%',
                  right: -5,
                  bottom: -5,
                  boxShadow: 'sm',
                  backgroundColor: 'neutral.50'
                }}
              >
                <EditRoundedIcon />
              </IconButton>
            </AspectRatio>
            <Box alignContent={'center'}>
              <Typography level='body-sm' noWrap>Ngô Minh Quang</Typography>
              <Typography level='body-sm' noWrap>ngominhquang12a2nl@gmail.com</Typography>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={2} p={0}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5, backgroundColor: 'primary.50' }}
              defaultValue="I'm a software developer based in Bangkok, Thailand. My goal is to solve UI problems with neat CSS without using too much JavaScript."
            />
          </Stack>
          <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
              <Button size="sm" variant="outlined">
                Cancel
              </Button>
              <Button size="sm" variant="solid">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
    </Box>
  );
}
