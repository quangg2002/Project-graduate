import * as React from 'react';
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
    MenuItem
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

import * as Yup from "yup";

const FindJobSchema = Yup.object().shape({
    jobCategory: Yup.string(),
    jobPosition: Yup.string(),
    location: Yup.string(),
});


function JobPosting() {
    return (
        <Box bgcolor={'#f4f5f5'}>
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
                {({ handleSubmit, setFieldValue  }) => (
                    <Form onSubmit={handleSubmit}>
                        <Stack bgcolor={'#19734e'} py={3} alignItems={'center'}>
                            <Stack direction={'row'} width={'80%'} gap={1}>
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
                                            value={field.value}
                                        >
                                            <Option value="" disabled>
                                                Chọn danh mục
                                            </Option>
                                            <Option value="it">IT</Option>
                                            <Option value="marketing">Marketing</Option>
                                        </Select>
                                    )}
                                </Field>
                                <Button type="submit" startDecorator={<SearchIcon />} sx={{bgcolor: '#00b14f'}}>
                                    Tìm kiếm
                                </Button>
                                <Button startDecorator={<FilterListIcon />} variant="solid" sx={{bgcolor: '#145c3e'}} endDecorator={<KeyboardArrowDownIcon/>}>
                                    <Typography sx={{color: '#FFF'}}>Lọc nâng cao</Typography>
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
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: " minmax(350px, 1fr) minmax(200px, 280px) ",
                            md: " minmax(400px, 1fr) minmax(280px, 400px) ",
                        },
                    }}
                    gap={2}
                >
                    <Stack gap={2}>
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
                                    <Button color="success" variant="solid">
                                        Ứng tuyển ngay
                                    </Button>
                                    <Button variant="outlined">
                                        Lưu tin
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                    <Stack gap={2}>
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
        </Box>
    );
}

export default JobPosting;
