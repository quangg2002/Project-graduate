import { useCallback, useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Typography,
    Stack,
    Divider,
    List,
    ListItem,
    Breadcrumbs,
    Link,
    IconButton,
    Select,
    Option,
    Input,
    ModalClose,
    CardCover,
    Textarea,
    Snackbar
} from '@mui/joy';
import { Formik, Form, Field, FieldProps } from 'formik';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import Header from '../../components/Header';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LaunchIcon from '@mui/icons-material/Launch';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { selectClasses } from '@mui/joy/Select';
import * as Yup from "yup";
import { Transition } from 'react-transition-group';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { applicationCreate } from '../../services/applicationApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import city from '../../utils/citis.json';

const FindJobSchema = Yup.object().shape({
    jobCategory: Yup.string(),
    jobPosition: Yup.string(),
    location: Yup.string(),
});

const validationSchema = Yup.object({
    coverLetter: Yup.string().required('Thư giới thiệu là bắt buộc'),
    selectedFile: Yup.mixed()
        .required('Vui lòng chọn file CV')
        .test('fileSize', 'Kích thước file không được vượt quá 5MB', (value) => {
            return value && (value as File).size <= 5 * 1024 * 1024; // 5MB
        })
        .test('fileType', 'Chỉ hỗ trợ định dạng .doc, .docx, .pdf', (value) => {
            const file = value as File;
            return file && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
        })
});

function JobPosting() {
    const [open, setOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
 

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('coverLetter', values.coverLetter);
            formData.append('jobId', 4?.toString() || '');
            if (values.selectedFile) {
                formData.append('cvPdf', values.selectedFile);
            }

            const result = await dispatch(applicationCreate(formData));

            if (result.payload?.response?.success === true) {
                toast.success('Ứng tuyển công việc thành công!');
                resetForm();
                setOpen(false)
            } else {
                toast.error('Failed to submit application');
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box bgcolor={'#f4f5f5'} flexWrap={'wrap'}>
            <Header />
            <Formik
                initialValues={{
                    jobCategory: '',
                    jobPosition: '',
                    location: '',
                }}
                validationSchema={FindJobSchema}
                onSubmit={(values) => {
                    console.log('Search Data:', values);
                }}
            >
                {({ handleSubmit, setFieldValue }) => (
                    <Form >
                        <Stack bgcolor={'#19734e'} py={3} alignItems={'center'}>
                            <Stack direction={'row'} width={'80%'} gap={1} flexWrap={'wrap'}>
                                <Stack flex={2}>
                                    <Field name="jobPosition" as={Input} placeholder="Vị trí tuyển dụng" />
                                </Stack>
                                <Field name="jobCategory">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            {...field}
                                            onChange={(event, newValue) => {
                                                setFieldValue(field.name, newValue)
                                            }}
                                            startDecorator={<RoomOutlinedIcon sx={{ fontSize: 'medium' }} />}
                                            // indicator={<KeyboardArrowDownIcon/>}
                                            sx={{
                                                [`& .${selectClasses.indicator}`]: {
                                                    transition: '0.2s',
                                                    [`&.${selectClasses.expanded}`]: {
                                                        transform: 'rotate(-180deg)',
                                                    },
                                                },
                                            }}
                                            value={field.value}
                                        >
                                            <Option value="" disabled>
                                                Địa điểm
                                            </Option>
                                            {city.map(city => (
                                                <Option key={city.id} value={city.name}>
                                                    {city.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                                </Field>
                                <Button type="submit" startDecorator={<SearchIcon />}
                                    sx={{
                                        bgcolor: '#00b14f',
                                        '&:hover': {
                                            bgcolor: '#008f3e',
                                        },
                                    }}>
                                    Tìm kiếm
                                </Button>
                                <Button
                                    startDecorator={<FilterListIcon />}
                                    endDecorator={<KeyboardArrowDownIcon />}
                                    variant="solid"
                                    sx={{
                                        bgcolor: '#145c3e',
                                        '&:hover': {
                                            bgcolor: '#0f4d31',
                                        },
                                    }}
                                >
                                    <Typography sx={{ color: '#FFF' }}>Lọc nâng cao</Typography>
                                </Button>
                            </Stack>
                        </Stack>
                    </Form>
                )}
            </Formik>
            <Box width={'90%'} justifySelf={'center'} alignSelf={'center'} my={2}>
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
                        <HomeRoundedIcon /> &nbsp;
                        <Typography level="body-xs">
                            Trang chủ
                        </Typography>
                    </Link>
                    <Typography color="primary" level="body-xs">
                        Tên Nghề nghiệp
                    </Typography>
                    <Typography color="primary" level="body-xs">
                        Tên vị trí chuyên môn
                    </Typography>
                </Breadcrumbs>
                <Stack
                    direction={'row'}
                    gap={2}
                    flexWrap={'wrap'}
                >
                    <Stack gap={2} flex={2}>
                        <Card variant="outlined">
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <Typography level="h4">
                                    Nhân Viên Kinh Doanh/Tư Vấn Tuyển Sinh Khóa Học Tại Trung Tâm (Data Sẵn, Tỷ Lệ Chốt Cao) - Thu Nhập 15-30 Triệu
                                </Typography>
                                <Stack direction="row" justifyContent={'space-between'}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton
                                            sx={{
                                                borderRadius: '50%',
                                                p: 1,
                                                background: 'linear-gradient(11deg,#00bf5d,#00907c)'
                                            }}
                                        >
                                            <MonetizationOnIcon sx={{ color: '#FFF' }} />
                                        </IconButton>

                                        <Stack>
                                            <Typography>Mức lương</Typography>
                                            <Typography fontWeight="bold">9 - 30 triệu</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton
                                            sx={{
                                                borderRadius: '50%',
                                                p: 1,
                                                background: 'linear-gradient(11deg,#00bf5d,#00907c)'
                                            }}
                                        >
                                            <LocationOnIcon sx={{ color: '#FFF' }} />
                                        </IconButton>

                                        <Stack>
                                            <Typography>Địa điểm</Typography>
                                            <Typography fontWeight="bold">Hà Nội</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton
                                            sx={{
                                                borderRadius: '50%',
                                                p: 1,
                                                background: 'linear-gradient(11deg,#00bf5d,#00907c)'
                                            }}
                                        >
                                            <HourglassFullIcon sx={{ color: '#FFF' }} />
                                        </IconButton>

                                        <Stack>
                                            <Typography>Kinh nghiệm</Typography>
                                            <Typography fontWeight="bold">Không yêu cầu kinh nghiệm</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Typography color="neutral" bgcolor={'#f2f4f5'} width={'fit-content'} px={1} borderRadius={5}>
                                    <WatchLaterIcon sx={{ fontSize: 'medium', mb: '3px' }} />&nbsp;
                                    Hạn nộp hồ sơ: 29/11/2024
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button color="success" variant="solid" sx={{ flex: 4 }} startDecorator={<SendIcon sx={{ transform: 'rotate(-45deg)' }} />}>
                                        Ứng tuyển ngay
                                    </Button>
                                    <Button variant="outlined" sx={{ flex: 1 }} startDecorator={<FavoriteBorderIcon />}>
                                        Lưu tin
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                        <Card variant="outlined" sx={{ marginBottom: 2 }}>
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <Stack direction="row" spacing={2} borderLeft={'6px solid #00b14f'}>

                                    <Typography level="h4" flex={4} pl={1}>Chi tiết tin tuyển dụng</Typography>
                                    <Button variant="outlined" startDecorator={<NotificationsNoneIcon />}>Gửi tôi việc làm tương tự</Button>
                                </Stack>
                                <Divider />
                                <Box>
                                    <Typography level='title-lg'>Mô tả công việc</Typography>
                                    <List>
                                        <ListItem>Tìm kiếm Phụ huynh và Học sinh thông qua các kênh mạng xã hội và làm hoạt động tại các khu vực.</ListItem>
                                        <ListItem>Gọi điện và tư vấn sản phẩm giáo dục đến Phụ huynh (data Trung tâm cấp thêm).</ListItem>
                                        <ListItem>Báo cáo công việc trực tiếp cho Trưởng phòng tư vấn tuyển sinh (ECL).</ListItem>
                                        <ListItem>Hỗ trợ công tác tuyển sinh, thực hiện học thử, kiểm tra đầu vào, xếp lớp cho Học sinh.</ListItem>
                                        <ListItem>Hỗ trợ người đăng ký viên đảm bảo học sinh nhận được trải nghiệm học tập tốt nhất.</ListItem>
                                    </List>
                                </Box>
                                <Box>
                                    <Typography level='title-lg'>Mô tả công việc</Typography>
                                    <List>
                                        <ListItem>Tìm kiếm Phụ huynh và Học sinh thông qua các kênh mạng xã hội và làm hoạt động tại các khu vực.</ListItem>
                                        <ListItem>Gọi điện và tư vấn sản phẩm giáo dục đến Phụ huynh (data Trung tâm cấp thêm).</ListItem>
                                        <ListItem>Báo cáo công việc trực tiếp cho Trưởng phòng tư vấn tuyển sinh (ECL).</ListItem>
                                        <ListItem>Hỗ trợ công tác tuyển sinh, thực hiện học thử, kiểm tra đầu vào, xếp lớp cho Học sinh.</ListItem>
                                        <ListItem>Hỗ trợ người đăng ký viên đảm bảo học sinh nhận được trải nghiệm học tập tốt nhất.</ListItem>
                                    </List>
                                </Box>
                                <Box>
                                    <Typography level='title-lg'>Địa điểm</Typography>
                                    <List>
                                        <ListItem>Địa điểm: Tầng 18, Tòa nhà HCO, 44B phố Lý Thường Kiệt, Phường..</ListItem>
                                    </List>
                                </Box>
                                <Stack gap={1}>
                                    <Typography level='title-lg'>Cách thức ứng tuyển</Typography>
                                    <Typography>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <b>Ứng tuyển</b> ngay dưới đây.</Typography>
                                </Stack>
                                <Typography>Hạn nộp hồ sơ: 29/11/2024</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button color="success" variant="solid" onClick={() => setOpen(true)}>
                                        Ứng tuyển ngay
                                    </Button>
                                    <Button variant="outlined">
                                        Lưu tin
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                    <Stack gap={2} flex={1}>
                        <Card variant="outlined">
                            <Stack spacing={1} sx={{ padding: 2 }}>
                                <Typography level="h4">CÔNG TY CỔ PHẦN GIÁO DỤC HỌC VIỆN ANH NGỮ VIỆT NAM</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <BusinessIcon />
                                    <Typography>Quy mô: 100-499 nhân viên</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <WorkOutlineIcon />
                                    <Typography>Lĩnh vực: Tư vấn</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOnIcon />
                                    <Typography>
                                        Địa điểm: Tầng 18, Tòa nhà HCO, 44B phố Lý Thường Kiệt, Phường...
                                    </Typography>
                                </Stack>
                                <Button variant="outlined" endDecorator={<LaunchIcon />}>Xem trang công ty</Button>
                            </Stack>
                        </Card>

                        <Card variant="outlined">
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <Typography level="h4">Thông tin chung</Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <IconButton
                                        sx={{
                                            borderRadius: '50%',
                                            background: '#00b14f'
                                        }}
                                    >
                                        <MilitaryTechIcon sx={{ color: '#FFF' }} />
                                    </IconButton>
                                    <Stack>
                                        <Typography>Cấp bậc</Typography>
                                        <Typography>Nhân viên</Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <IconButton
                                        sx={{
                                            borderRadius: '50%',
                                            background: '#00b14f'
                                        }}
                                    >
                                        <HourglassFullIcon sx={{ color: '#FFF' }} />
                                    </IconButton>
                                    <Stack>
                                        <Typography>Kinh nghiệm</Typography>
                                        <Typography>Không yêu cầu kinh nghiệm</Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <IconButton
                                        sx={{
                                            borderRadius: '50%',
                                            background: '#00b14f'
                                        }}
                                    >
                                        <PeopleIcon sx={{ color: '#FFF' }} />
                                    </IconButton>
                                    <Stack>
                                        <Typography>Số lượng tuyển</Typography>
                                        <Typography>6 người</Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <IconButton
                                        sx={{
                                            borderRadius: '50%',
                                            background: '#00b14f'
                                        }}
                                    >
                                        <BusinessCenterIcon sx={{ color: '#FFF' }} />
                                    </IconButton>
                                    <Stack>
                                        <Typography>Hình thức làm việc</Typography>
                                        <Typography>Toàn thời gian</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                </Stack>
            </Box>

            <Transition in={open} timeout={400}>
                {(state: string) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...{
                                        entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                        entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                                    }[state],
                                },
                            },
                        }}
                        sx={[
                            state === 'exited'
                                ? { visibility: 'hidden' }
                                : { visibility: 'visible' },
                        ]}
                    >
                        <ModalDialog
                            sx={{
                                width: '80%',
                                maxWidth: '800px',
                                opacity: 0,
                                transition: `opacity 300ms`,
                                ...{
                                    entering: { opacity: 1 },
                                    entered: { opacity: 1 },
                                }[state],
                            }}
                        >
                            <DialogTitle><Typography level='h4'>Ứng tuyển</Typography></DialogTitle>
                            <ModalClose></ModalClose>
                            <DialogContent>
                                <Formik
                                    initialValues={{
                                        coverLetter: '',
                                        selectedFile: null as File | null,
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                                        <Form>
                                            <Stack gap={2}>
                                                <Stack gap={1}>
                                                    <Stack direction={'row'} alignItems={'center'}>
                                                        <FolderSharedIcon color='success' sx={{ fontSize: '30px' }} /> &nbsp;
                                                        <Typography level='title-md'>Chọn CV để ứng tuyển</Typography>
                                                    </Stack>

                                                    <Box {...getRootProps()} style={{ position: 'relative' }}>
                                                        <Card
                                                            sx={{
                                                                height: '150px',
                                                                borderStyle: 'dashed',
                                                                borderWidth: '1.5px',
                                                                borderColor: '#00b14f'
                                                            }}
                                                        >
                                                            <input
                                                                {...getInputProps()}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        setFieldValue('selectedFile', file);
                                                                    }
                                                                }}
                                                            />
                                                            <CardCover>
                                                                <Stack gap={1}>
                                                                    <Stack direction={'row'} gap={1} alignItems={'center'}>
                                                                        <CloudUploadIcon sx={{ fontSize: '30px' }} />
                                                                        <Typography level="title-md">Tải CV từ máy tính, chọn hoặc kéo thả</Typography>
                                                                    </Stack>
                                                                    <Typography level="body-sm">Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB</Typography>

                                                                    <Stack direction={'row'} gap={1} alignItems={'center'}>
                                                                        {values.selectedFile  &&
                                                                            <Stack direction={'row'} alignItems={'center'}>
                                                                                <DescriptionOutlinedIcon color="success" sx={{ fontSize: '30px' }} />
                                                                                <Typography color="success">{values.selectedFile.name}</Typography>
                                                                            </Stack>
                                                                        }
                                                                        <Button color="success">Chọn CV</Button>
                                                                    </Stack>
                                                                </Stack>
                                                            </CardCover>
                                                        </Card>
                                                    </Box>
                                                    {typeof errors.selectedFile === 'string' && (
                                                        <Typography color="danger">{errors.selectedFile}</Typography>
                                                    )}
                                                </Stack>
                                                <Stack gap={1}>
                                                    <Stack direction={'row'} alignItems={'end'}>
                                                        <BorderColorOutlinedIcon color="success" sx={{ fontSize: '30px' }} /> &nbsp;
                                                        <Typography level='title-md'>Thư giới thiệu:</Typography>
                                                    </Stack>
                                                    <Typography level="body-sm">Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển dụng.</Typography>
                                                    <Field
                                                        name="coverLetter"
                                                        as={Textarea}
                                                        minRows={3}
                                                        placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này."
                                                        sx={{
                                                            borderColor: '#00b14f'
                                                        }}
                                                    />
                                                    {errors.coverLetter && <Typography color="danger">{errors.coverLetter}</Typography>}
                                                </Stack>
                                                <Button color="success" disabled={loading} type="submit"> {loading ? 'Nộp hồ sơ ứng tuyển...' : 'Nộp hồ sơ ứng tuyển'}</Button>
                                            </Stack>
                                        </Form>
                                    )}
                                </Formik>
                            </DialogContent>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>
        </Box>
    );
}

export default JobPosting;
