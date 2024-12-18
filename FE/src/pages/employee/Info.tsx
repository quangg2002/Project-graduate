import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { confirmAlert } from 'react-confirm-alert'; // Import thư viện
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Autocomplete, Box, Button, Card, CardCover, Chip, Divider, FormControl, FormLabel, IconButton, Input, Radio, RadioGroup, Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Header from "../../components/Header";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { updateEmployee } from '../../services/employeeApi';
import { changePassword } from '../../services/authApi';
import { getEmployees } from '../../services/employeeApi';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import authService from '../../services/authService';
import CustomModal from "../../components/CustomModal";
import { skillList } from '../../services/autofillApi';
import { getSkills, updateSkill } from '../../services/employeeApi';

const SignUpSchema = Yup.object().shape({
    fullName: Yup.string()
        .required("Họ tên là bắt buộc"),
    email: Yup.string()
        .email('Email không hợp lệ'),
    phoneNumber: Yup.string(),
    gender: Yup.string(),
    address: Yup.string(),
    career: Yup.string(),
});

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


export default function Info() {
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [skills, setSkills] = useState([]);
    const [skillCurrent, setSkillCurrent] = useState([]);
    const [openEditSkill, setOpenEditSkill] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

    const ROLE = useState(authService.getRole)

    const [employeeData, setEmployeeData] = useState({
        fullName: '',
        gender: '',
        address: '',
        email: '',
        phoneNumber: '',
        career: '',
    })

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        confirmAlert({
            customUI: ({ onClose }) => (
                <div
                    style={{
                        width: '400px',
                        backgroundColor: '#282c34',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <p style={{ color: '#ffcc00', fontSize: '18px' }}>Xác nhận</p>
                    <p>Bạn có chắc chắn muốn cập nhật thông tin cá nhân với hình ảnh mới này không?</p>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                            onClick={async () => {
                                const formData = new FormData();
                                formData.append('avatar', file);

                                const result = await dispatch(updateEmployee(formData));
                                if (result?.payload?.response?.success === true) {
                                    setPreviewUrl(URL.createObjectURL(file));
                                    toast.success('Cập nhật thông tin cá nhân thành công');
                                } else {
                                    toast.error('Cập nhật thông tin cá nhân thất bại');
                                }
                                onClose();
                            }}
                            style={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Có
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Không
                        </button>
                    </div>
                </div>
            ),
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif']
        }
    });

    const handleUpdateSkill = async (values, setSubmitting) => {
        try {
            setSubmitting(true);
            await dispatch(updateSkill({ skillIds: values.skills })).unwrap();

            const updatedSkills = skills.filter(skill => values.skills.includes(skill.id));
            setSkillCurrent(updatedSkills);

            toast.success('Cập nhật kỹ năng thành công');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lưu kỹ năng');
        } finally {
            setSubmitting(false);
            setOpenEditSkill(false)
        }
    };

    const handleUpdateEmployee = async (values, setSubmitting) => {
        try {
            dispatch(startLoading());

            const formData = new FormData();
            formData.append('fullName', values.fullName);
            formData.append('email', values.email);
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('gender', values.gender);
            formData.append('career', values.career);
            formData.append('address', values.address);

            const result = await dispatch(updateEmployee(formData));

            dispatch(stopLoading());

            console.log(result?.payload?.response?.success)
            if (result?.payload?.response?.success == true) {
                toast.success('Cập nhật thành công');

                setEmployeeData({
                    fullName: values.fullName,
                    gender: values.gender,
                    address: values.address,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    career: values.career
                });
            } else {
                toast.error('Cập nhật thất bại');
            }

        } catch (error) {
            toast.error('Đã có lỗi xảy ra.');
        } finally {
            setSubmitting(false);
            setOpenEdit(false)
        }
    };


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
                            address: response.address,
                            email: response.email,
                            phoneNumber: response.phoneNumber,
                            career: response.career
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [skillResult, skillCurrentResult] = await Promise.all([
                    dispatch(skillList()).unwrap(),
                    dispatch(getSkills()).unwrap(),
                ]);

                if (skillResult.response?.data) {
                    setSkills(skillResult.response.data);
                }

                if (skillCurrentResult.response?.data) {
                    setSkillCurrent(skillCurrentResult.response.data);
                }
            } catch (error) {
                toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
            }
        };

        fetchData();
    }, [dispatch, updateSkill]);

    return (
        <Box bgcolor={'#f0F0F0'} minHeight={'100vh'}>
            <Header />

            <Box component="main" className="MainContent" width={'65%'} alignSelf={'center'} justifySelf={'center'} mt={4} pb={4}>
                <Box
                    borderRadius={10}
                    boxShadow={'0px 4px 10px rgba(0, 0, 0, 0.25)'}
                    border={'2px solid #FFF'}
                    sx={{
                        bgcolor: "#FFF",
                        px: { xs: 2, md: 6 },
                        pt: { xs: 2, sm: 2, md: 3 },
                        pb: { xs: 2, sm: 2, md: 5 },
                        maxWidth: "100vw",
                    }}>
                    <Box mb={3}>
                        <Typography level="title-lg">Thông tin cá nhân</Typography>
                        <Typography level="body-xs">
                            Tùy chỉnh các thông tin hồ sơ của bạn.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "minmax(200px, 210px) minmax(400px, 1fr)",
                            },
                            gap: { xs: 2, sm: 2, md: 1 },
                            width: "100%",
                            maxWidth: "100vw",
                        }}
                    >
                        <Box>
                            <Box {...getRootProps()} sx={{ position: 'relative' }}>
                                <Card sx={{ width: "200px", height: "200px", borderRadius: 0 }}>
                                    <input {...getInputProps()} />
                                    <CardCover>
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{ width: "100%", objectFit: "cover" }}
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
                                            width: '200px'
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
                        </Box>
                        <Box display={'flex'} flexDirection={"column"} gap={2} maxWidth={'100%'}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Stack gap={0.5}>
                                    <Typography level="h3">{employeeData.fullName}</Typography>
                                    <Typography level="title-lg" color="primary">Nghề nghiệp: {employeeData.career}</Typography>
                                </Stack>
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
                                    <Tab
                                        sx={{
                                            '&.Mui-selected': {
                                                color: 'var(--variant-plainColor, rgba(var(--joy-palette-primary-mainChannel) / 1))',
                                            },
                                        }}
                                    >
                                        Thay đổi mật khẩu
                                    </Tab>
                                </TabList>
                                <TabPanel value={0}>
                                    <Stack gap={1}>
                                        <Stack direction={"row"}
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "25% 75%",
                                            }}
                                        >
                                            <Typography>Họ và tên: </Typography>
                                            <Typography color="primary" flex={1}>{employeeData.fullName}</Typography>
                                        </Stack>

                                        <Stack direction={"row"}
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "25% 75%",
                                            }}
                                        >
                                            <Typography>Email: </Typography>
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
                                        </Stack>

                                        <Stack direction={"row"}
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "25% 75%",
                                            }}
                                        >
                                            <Typography>Số điện thoại: </Typography>
                                            <Typography color="primary">{employeeData.phoneNumber}</Typography>
                                        </Stack>

                                        <Stack direction={"row"}
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "25% 75%",
                                            }}
                                        >
                                            <Typography>Giới tính: </Typography>
                                            <Typography color="primary">{employeeData.gender}</Typography>
                                        </Stack>

                                        <Stack direction={"row"}
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "25% 75%",
                                            }}
                                        >
                                            <Typography>Địa chỉ cư trú: </Typography>
                                            <Typography color="primary">{employeeData.address}</Typography>
                                        </Stack>

                                    </Stack>
                                </TabPanel>

                                <TabPanel value={1}>

                                    <Stack sx={{ gap: 1, mt: 2 }}>
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
                                                        <Button type="submit" size="sm" variant="solid" color='success' disabled={isSubmitting}>
                                                            Lưu
                                                        </Button>
                                                    </Stack>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Stack>
                                </TabPanel>
                            </Tabs>
                        </Box>
                    </Box>
                </Box>
                <Box
                    borderRadius={10}
                    boxShadow={'0px 4px 10px rgba(0, 0, 0, 0.25)'}
                    border={'2px solid #FFF'}
                    mt={2}
                    sx={{
                        bgcolor: "#FFF",
                        px: { xs: 2, md: 6 },
                        pt: { xs: 2, sm: 2, md: 3 },
                        pb: { xs: 2, sm: 2, md: 3 },
                        maxWidth: "100vw",
                    }}>
                    <Stack gap={2}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack>
                                <Typography level="title-lg">Kĩ năng cá nhân</Typography>
                                <Typography level="body-xs">
                                    Hệ thống sẽ gợi ý việc làm phú hợp dựa theo kĩ năng và nghề nghiệp của bạn.
                                </Typography>
                            </Stack>
                            <Button variant="soft" color="primary" size="sm" onClick={() => setOpenEditSkill(true)} startDecorator={<BorderColorIcon sx={{ fontSize: 'sm' }} />}>
                                <Typography level="body-sm">Chỉnh sửa</Typography>
                            </Button>

                        </Stack>
                        <Stack direction={'row'} gap={2} flexWrap={'wrap'}>
                            {skillCurrent.map((skillCurrent, index) => (
                                <Chip color="primary">{skillCurrent?.name}</Chip>
                            ))}
                        </Stack>
                    </Stack>

                </Box>
            </Box>

            <CustomModal
                open={openEditSkill}
                onClose={() => setOpenEditSkill(false)}
                width="40%"
            >
                <>
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                    >
                        Thay đổi kĩ năng của bạn
                    </Typography>
                    <Box id="modal-desc" mt={2} gap={3}>
                        <Formik
                            initialValues={{
                                skills: skillCurrent.map((skill) => skill.id)
                            }}
                            enableReinitialize
                            onSubmit={(values, { setSubmitting }) => handleUpdateSkill(values, setSubmitting)}
                        >
                            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                                <Form>
                                    <Autocomplete
                                        placeholder="Kĩ năng"
                                        options={skills}
                                        multiple
                                        getOptionLabel={(option: any) => option.name}
                                        value={skills.filter((skill) => values.skills.includes(skill.id))}
                                        onChange={(event, options: any[]) => {
                                            const selectedIds = options.map(option => option.id);
                                            setFieldValue("skills", selectedIds);
                                        }}
                                    />

                                    <Box display="flex" alignItems={"flex-end"} justifyContent={"right"} mt={2} >
                                        <Button type="submit" size="md" variant="solid" color='success' disabled={isSubmitting}>
                                            Cập nhật
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </>
            </CustomModal>

            <CustomModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                width="80%"
            >
                <>
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
                                fullName: employeeData.fullName,
                                address: employeeData.address,
                                email: employeeData.email,
                                phoneNumber: employeeData.phoneNumber,
                                career: employeeData.career,
                                gender: employeeData.gender,
                            }}
                            enableReinitialize
                            validationSchema={SignUpSchema}
                            onSubmit={(values, { setSubmitting }) => handleUpdateEmployee(values, setSubmitting)}
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

                                    <FormControl>
                                        <FormLabel>Giới tính</FormLabel>
                                        <Field name="gender">
                                            {({ field }) => (
                                                <RadioGroup {...field}>
                                                    <Stack direction={'row'} gap={4}>
                                                        <Radio value="Nam" label="Nam" />
                                                        <Radio value="Nữ" label="Nữ" />
                                                    </Stack>
                                                </RadioGroup>
                                            )}
                                        </Field>
                                    </FormControl>


                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap={'wrap'} mb={2} mt={1}>
                                        <FormControl sx={{ flexGrow: 1 }}>
                                            <FormLabel>Nghề Nghiệp</FormLabel>
                                            <Field
                                                name="career"
                                                as={Input}
                                                placeholder='Nhập nghề nghiệp'
                                            />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 1 }}>
                                            <FormLabel>Địa chỉ cư trú</FormLabel>
                                            <Field
                                                name="address"
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
                </>
            </CustomModal>
        </Box>
    );
}
