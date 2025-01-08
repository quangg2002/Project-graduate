import { useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Typography,
    Stack,
    Divider,
    IconButton,
    CardCover,
    Textarea,
} from '@mui/joy';
import { Formik, Form, Field } from 'formik';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import Header from '../../components/Header';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LaunchIcon from '@mui/icons-material/Launch';

import * as Yup from "yup";
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { applicationCreate } from '../../services/applicationApi';
import { jobDetails } from '../../services/jobApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { favoriteJobCreate, getFavoriteJob } from '../../services/favoriteJobApi';
import { startLoading, stopLoading } from "../../redux/slice/loadingSlice";
import CustomModal from "../../components/CustomModal";

interface Job {
    id: number;
    userId: number | null;
    companyId: number;
    quantityApplication: number | null;
    title: string;
    position: string;
    location: string;
    district: string;
    city: string;
    deadline: string;
    createdAt: string;
    jobType: string;
    contractType: string;
    salary: string;
    companyName: string;
    companyLogo: string;
    companyScale: string;
    companyDescription: string | null;
    companyAddress: string;
    companyCity: string;
    companyDistrict: string | null;
    quantity: number;
    description: string;
    requirement: string;
    benefit: string;
    workingTime: string;
    yearExperience: string;
}


const validationSchema = Yup.object({
    coverLetter: Yup.string().required('Thư giới thiệu là bắt buộc'),
    selectedFile: Yup.mixed()
        .required('Vui lòng chọn file CV')
        .test('fileSize', 'Kích thước file không được vượt quá 10MB', (value) => {
            return value && (value as File).size <= 10 * 1024 * 1024; // 10 MB
        })
        .test('fileType', 'Chỉ hỗ trợ định dạng .doc, .docx, .pdf', (value) => {
            const file = value as File;
            return file && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
        })
});

function JobPosting() {
    const { jobId } = useParams();

    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [job, setJob] = useState<Job | null>(null);
    const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([]);

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
            formData.append('jobId', jobId?.toString() || '');
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
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const action = await dispatch(jobDetails(jobId));
                if (jobDetails.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) setJob(response)
                }
            }
            catch (error) {
                console.error('Failed to fetch applications data:', error);
            }
        };
        fetchData();
    }, [dispatch]);


    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                dispatch(startLoading)
                const action = await dispatch(getFavoriteJob());
                if (getFavoriteJob.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response) {
                        const jobIds = response.map(job => job.jobId);
                        setBookmarkedJobs(jobIds);
                    }
                }
                dispatch(stopLoading)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchCompanyData();
    }, []);

    const handleDeleteSave = async (jobId) => {
        try {
            const result = await dispatch(favoriteJobCreate(jobId));
            if (result?.payload?.response?.success) {
                if (bookmarkedJobs.includes(jobId)) {
                    toast.success('Đã gỡ công việc khỏi danh sách đã lưu!');
                } else {
                    toast.success('Đã lưu công việc vào danh sách đã lưu!');
                };

                setBookmarkedJobs((prev) =>
                    prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
                );

            } else {
                toast.error('Đã có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box bgcolor={'#f4f5f5'} flexWrap={'wrap'}>
            <Header />
            <Box width={'90%'} justifySelf={'center'} alignSelf={'center'} my={2}>
                <Stack
                    direction={'row'}
                    gap={2}
                    flexWrap={'wrap'}
                >
                    <Stack gap={2} flex={2}>
                        <Card variant="outlined">
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <Typography level="h4">{job?.title}</Typography>
                                <Stack direction="row" justifyContent={'space-between'}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton variant="outlined" sx={{ borderRadius: '50%', borderColor: "#077b42" }}>
                                            <MonetizationOnIcon sx={{ color: '#077b42' }} />
                                        </IconButton>
                                        <Stack>
                                            <Typography level="title-md">Mức lương</Typography>
                                            <Typography level="body-sm" fontWeight="bold">{job?.salary}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton variant="outlined" sx={{ borderRadius: '50%', borderColor: "#077b42" }}>
                                            <LocationOnIcon sx={{ color: '#077b42' }} />
                                        </IconButton>

                                        <Stack>
                                            <Typography level="title-md">Địa điểm</Typography>
                                            <Typography level="body-sm" fontWeight="bold">{job?.city}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton variant="outlined" sx={{ borderRadius: '50%', borderColor: "#077b42" }}>
                                            <HourglassFullIcon sx={{ color: '#077b42' }} />
                                        </IconButton>

                                        <Stack>
                                            <Typography level="title-md">Kinh nghiệm</Typography>
                                            <Typography level="body-sm" fontWeight="bold">{job?.yearExperience}</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Typography startDecorator={<WatchLaterIcon />} level="body-sm" color="neutral" bgcolor={'#f2f4f5'} width={'fit-content'} px={1} borderRadius={5}>
                                    Hạn nộp hồ sơ: {job?.deadline}
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button color="success" variant="solid" sx={{ flex: 4 }} startDecorator={<SendIcon sx={{ transform: 'rotate(-45deg)' }} />} onClick={() => setOpen(true)}>
                                        Ứng tuyển ngay
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        sx={{ flex: 1 }}
                                        startDecorator={
                                            bookmarkedJobs.includes(job?.id) ? (
                                                <FavoriteIcon />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )
                                        }
                                        onClick={() => handleDeleteSave(job?.id)}
                                    >
                                        Lưu tin
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                        <Card variant="outlined" sx={{ marginBottom: 2 }}>
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <Stack direction="row" spacing={2} borderLeft={'6px solid #00b14f'}>
                                    <Typography level="h4" flex={4} pl={1}>Chi tiết tin tuyển dụng</Typography>
                                </Stack>
                                <Divider />
                                <Box>
                                    <Typography level='title-lg'>Mô tả công việc</Typography>
                                    <p>{job?.description}</p>
                                </Box>
                                <Box>
                                    <Typography level='title-lg'>Yêu cầu ứng viên</Typography>
                                    <p>{job?.requirement}</p>
                                </Box>
                                <Box>
                                    <Typography level='title-lg'>Quyền lợi được hưởng</Typography>
                                    <p>{job?.benefit}</p>
                                </Box>
                                <Stack gap={1}>
                                    <Typography level='title-lg'>Cách thức ứng tuyển</Typography>
                                    <Typography>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <b>Ứng tuyển</b> ngay dưới đây.</Typography>
                                </Stack>
                                <Typography>Hạn nộp hồ sơ: {job?.deadline}</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button color="success" variant="solid" onClick={() => setOpen(true)}>
                                        Ứng tuyển ngay
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleDeleteSave(job?.id)}>
                                        Lưu tin
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                    <Stack gap={2} flex={1}>
                        <Card variant="outlined">
                            <Stack spacing={1} sx={{ padding: 2 }}>
                                <Typography level="h4">{job?.companyName}</Typography>
                                <Typography startDecorator={<BusinessIcon />}>Quy mô: {job?.companyScale}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOnIcon />
                                    <Typography>
                                        Địa điểm: {job?.companyAddress} {job?.companyDistrict} {job?.companyCity}
                                    </Typography>
                                </Stack>
                                <Button variant="outlined" endDecorator={<LaunchIcon />} onClick={() => navigate(`/company-details/${job.companyId}`)}>Xem trang công ty</Button>
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
                                        <Typography>{job?.position}</Typography>
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
                                        <Typography>{job?.yearExperience}</Typography>
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
                                        <Typography>{job?.quantity}</Typography>
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
                                        <Typography>{job?.contractType}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                </Stack>
            </Box>

            <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                width="80%"
            >
                <DialogTitle><Typography level='h4'>Ứng tuyển</Typography></DialogTitle>

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
                                                            {values.selectedFile &&
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
            </CustomModal>
        </Box>
    );
}

export default JobPosting;
