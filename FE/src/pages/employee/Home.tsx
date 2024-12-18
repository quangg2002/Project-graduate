import { useState, useEffect } from "react";
import { Box, Card, Checkbox, Chip, Divider, IconButton, Input, Link, List, ListItem, Option, Select, Stack, Tooltip, Typography } from "@mui/joy";

import citis from "../../utils/citis.json";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import Header from "../../components/Header";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckIcon from '@mui/icons-material/Check';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BusinessIcon from "@mui/icons-material/Business";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

import { toast } from 'react-toastify';
import { getFavoriteJob } from '../../services/favoriteJobApi';
import { favoriteJobCreate } from '../../services/favoriteJobApi';
import useAppDispatch from "../../hooks/useAppDispatch";
import { startLoading, stopLoading } from "../../redux/slice/loadingSlice";
import {
    experienceList,
    positionList,
    jobTypeList,
    industryList,
    contracTypeList,
    educationList,
} from "../../services/autofillApi";

import { jobSearch, jobRecommend } from "../../services/jobApi";
import { Empty, Pagination, Spin } from "antd";
import { Form } from "formik";

const selectStyles = {
    flex: 1,
    color: "#000",
    bgcolor: 'transparent',
    border: "none",
    boxShadow: "none",
    maxWidth: '160px',
    [`& .MuiSelect-indicator`]: {
        transition: "0.2s",
        "&.Mui-expanded": {
            transform: "rotate(-180deg)",
        },
    },
    "& .MuiSelect-placeholder": {
        color: "#000", // Đặt màu cho placeholder
    },
    "&:hover": {
        border: "none",
        boxShadow: "none",
        bgcolor: 'transparent',
    },
};

interface Option {
    id: number;
    name: string;
    value?: any;
}

export interface Job {
    companyId: string;
    id: number;
    title: string;
    location: string;
    district: string;
    city: string;
    deadline: string;
    createdAt: string;
    companyName: string;
    companyLogo: string | null;
    companyDescription: string | null;
    description: string | null;
    jobType: string;
    experience: string;
    salary: string;
    contractType: string;
}

interface JobRecommend {
    jobId: number;
    jobTitle: string;
    companyName: string;
    companyLogo: string;
    jobDescription: string;
    companyId: number;
    jobDeadline: string;
    nameSkill: string[];
    jobSalary: string;
    similarity: number;
}

export default function Home() {

    const [isLoading, setIsLoading] = useState(true);
    const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);


    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    const onPageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page); 
        console.log(`Current page: ${page}, Page size: ${pageSize}`);
    };

    const currentJobs = jobs.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const rawRole = sessionStorage.getItem('role');
    const role = rawRole ? rawRole.replace(/"/g, '') : null;

    function calculateDaysLeft(deadline: string): number {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        const diffTime = deadlineDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const dispatch = useAppDispatch();

    const [jobRecommends, setJobRecommends] = useState<JobRecommend[]>([])

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<number | null>(null);

    const [selectedJobFieldIds, setSelectedJobFieldIds] = useState<number[]>([]);
    const [selectedJobLevelIds, setSelectedJobLevelIds] = useState<number[]>([]);
    const [selectedExperienceIds, setSelectedExperienceIds] = useState<number[]>([]);
    const [selectedEducationIds, setSelectedEducationIds] = useState<number[]>([]);
    const [selectedJobTypeIds, setSelectedJobTypeIds] = useState<number[]>([]);
    const [selectedContractTypeIds, setSelectedContractTypeIds] = useState<number[]>([])

    const [industryOptions, setIndustryOptions] = useState<Option[]>([]);
    const [positionOptions, setPositionOptions] = useState<Option[]>([]);
    const [experienceOptions, setExperienceOptions] = useState<Option[]>([]);
    const [jobTypeOptions, setJobTypeOptions] = useState<Option[]>([]);
    const [educationOptions, setEducationOptions] = useState<Option[]>([]);
    const [contractTypeOptions, setContractTypeOptions] = useState<Option[]>([]);

    const handleSearch = async () => {
        try {
            const result = await dispatch(jobSearch({
                searchQuery,
                ...(selectedCity && { city: selectedCity }),
                industryIds: selectedJobFieldIds,
                positionIds: selectedJobLevelIds,
                experienceIds: selectedExperienceIds,
                educationIds: selectedEducationIds,
                jobTypeIds: selectedJobTypeIds,
                contractTypeIds: selectedContractTypeIds,
            })).unwrap();
            if (result && result.response && result.response.success) {
                setJobs(result.response.data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    }

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            try {
                dispatch(startLoading());
                const result = await dispatch(jobSearch({
                    ...(selectedCity && { city: selectedCity }),
                    industryIds: selectedJobFieldIds,
                    positionIds: selectedJobLevelIds,
                    experienceIds: selectedExperienceIds,
                    educationIds: selectedEducationIds,
                    jobTypeIds: selectedJobTypeIds,
                    contractTypeIds: selectedContractTypeIds
                })).unwrap();
                if (result && result.response && result.response.success) {
                    setJobs(result.response.data);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                dispatch(stopLoading());
                setIsLoading(false)
            }
        };

        fetchJobs();
    }, [
        dispatch,
        selectedJobFieldIds,
        selectedJobLevelIds,
        selectedExperienceIds,
        selectedEducationIds,
        selectedJobTypeIds,
        selectedContractTypeIds,
        selectedCity,
    ]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [
                    experienceResult,
                    positionResult,
                    jobTypeResult,
                    industryResult,
                    contractResult,
                    educationResult,
                ] = await Promise.all([
                    dispatch(experienceList()).unwrap(),
                    dispatch(positionList()).unwrap(),
                    dispatch(jobTypeList()).unwrap(),
                    dispatch(industryList()).unwrap(),
                    dispatch(contracTypeList()).unwrap(),
                    dispatch(educationList()).unwrap(),
                ]);

                if (experienceResult?.response?.data) {
                    setExperienceOptions(experienceResult.response.data);
                }

                if (positionResult?.response?.data) {
                    setPositionOptions(positionResult.response.data);
                }

                if (jobTypeResult?.response?.data) {
                    setJobTypeOptions(jobTypeResult.response.data);
                }

                if (industryResult?.response?.data) {
                    setIndustryOptions(industryResult.response.data);
                }

                if (contractResult?.response?.data) {
                    setContractTypeOptions(contractResult.response.data);
                }

                if (educationResult?.response?.data) {
                    setEducationOptions(educationResult.response.data);
                }
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };

        fetchDropdownData();
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
            } finally {
                setIsLoading(false)
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
                }
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

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            try {
                dispatch(startLoading());
                const result = await dispatch(jobRecommend())

                if (jobRecommend.fulfilled.match(result)) {
                    const response = result.payload.response;

                    if (response) setJobRecommends(response)
                }

            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                dispatch(stopLoading());
                console.log("jobRecommends" + jobRecommends)
                setIsLoading(false)
            }
        };

        fetchJobs();
    }, [dispatch]);

    return (
        <Box bgcolor={'#f4f5f5'} minHeight={'100vh'}>
            <Header />
            <Stack
                py={2.8}
                sx={[
                    {
                        top: 69,
                        left: 0,
                        position: "sticky",
                        zIndex: 1000,
                        background: "linear-gradient(11deg,#A7D676,#85CBCC)"
                    },
                ]}
            >
                <Stack
                    direction={"row"}
                    width={"98%"}
                    gap={1}
                    flexWrap={"wrap"}
                    alignSelf={"center"}
                    justifyContent={'space-between'}
                // mx={2}
                >
                    <Stack direction={"row"} gap={1} flex={3}>
                        <Select
                            multiple
                            indicator={<KeyboardArrowDownIcon />}
                            sx={selectStyles}
                            onChange={(event, newValue) => {
                                setSelectedJobFieldIds(newValue)
                            }}
                            value={selectedJobFieldIds}
                            placeholder="Ngành nghề"
                        >
                            {industryOptions.map((industry) => (
                                <Option key={industry?.id} value={industry.id} sx={{ justifyContent: 'space-between' }}>
                                    {industry.name}
                                    <CheckIcon
                                        sx={{
                                            opacity: selectedJobFieldIds.includes(industry.id) ? 1 : 0,
                                            transition: 'opacity 0.3s ease-in-out',
                                        }}
                                        color="primary"
                                    />
                                </Option>
                            ))}
                        </Select>

                        <Select
                            multiple
                            indicator={<KeyboardArrowDownIcon />}
                            sx={selectStyles}
                            onChange={(event, newValue) => {
                                setSelectedJobLevelIds(newValue);
                            }}
                            value={selectedJobLevelIds}
                            placeholder="Vị trí"
                        >
                            {positionOptions.map((position) => (
                                <Option key={position?.id} value={position.id} sx={{ justifyContent: 'space-between' }}>
                                    {position.name}
                                    <CheckIcon
                                        sx={{
                                            opacity: selectedJobLevelIds.includes(position.id) ? 1 : 0,
                                            transition: 'opacity 0.3s ease-in-out',
                                        }}
                                        color="primary"
                                    />
                                </Option>
                            ))}
                        </Select>
                        <Stack flex={2}>
                            <Input
                                placeholder="Vị trí tuyển dụng"
                                endDecorator={<SearchIcon />}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                value={searchQuery}
                                onKeyDown={(event) => {
                                    // Kiểm tra nếu phím nhấn là Enter
                                    if (event.key === 'Enter') {
                                        // Xử lý hành động khi nhấn Enter
                                        handleSearch(); // Ví dụ gọi hàm tìm kiếm
                                    }
                                }}
                                sx={{
                                    borderRadius: '20px',
                                    bgcolor: '#FFF',
                                }}
                            />
                        </Stack>
                    </Stack>

                    <Stack flex={2}></Stack>
                    <Stack direction={"row"} gap={1} flex={2}>
                        <Select
                            startDecorator={
                                <RoomOutlinedIcon sx={{ fontSize: "medium" }} />
                            }
                            sx={selectStyles}
                            value={selectedCity}
                            placeholder="Địa điểm"
                        >
                            {citis.map((city) => (
                                <Option
                                    key={city.id}
                                    value={city.id}
                                    onClick={() => setSelectedCity(prevValue => (prevValue === city.id ? null : city.id))}
                                    sx={{ justifyContent: 'space-between' }}
                                >
                                    {city.name}
                                    <CheckIcon
                                        sx={{
                                            opacity: selectedCity === city.id ? 1 : 0,
                                            transition: 'opacity 0.3s ease-in-out',
                                        }}
                                        color="primary"
                                    />
                                </Option>
                            ))}
                        </Select>
                        <Divider orientation="vertical" />
                        <Select
                            multiple
                            startDecorator={
                                <BusinessCenterIcon
                                    sx={{ fontSize: "medium" }}
                                />
                            }
                            indicator={<KeyboardArrowDownIcon />}
                            sx={selectStyles}
                            onChange={(event, newValue) => {
                                setSelectedExperienceIds(newValue);
                            }}
                            value={selectedExperienceIds}
                            placeholder="Kinh Nghiệm"
                        >
                            {experienceOptions.map((experience) => (
                                <Option key={experience.id} value={experience.id} sx={{ justifyContent: 'space-between' }}>
                                    {experience.name}
                                    <CheckIcon
                                        sx={{
                                            opacity: selectedExperienceIds.includes(experience.id) ? 1 : 0,
                                            transition: 'opacity 0.3s ease-in-out',
                                        }}
                                        color="primary"
                                    />
                                </Option>
                            ))}
                        </Select>
                    </Stack>
                </Stack>
            </Stack>
            <Divider />
            <Stack mt={4} mx={3} gap={3} direction={'row'}>
                <Stack
                    flex={1}
                    gap={2}
                    sx={[
                        {
                            display: {
                                xs: "none",
                                sm: "inherit",
                            },
                            top: 182,
                            left: 0,
                            position: "sticky",
                            zIndex: 2,
                            maxHeight: "70vh", // Đảm bảo chiều cao của Stack không vượt quá chiều cao của màn hình
                            overflowY: "auto",
                            "&::-webkit-scrollbar": {
                                display: "none", // Ẩn thanh cuộn trên trình duyệt WebKit
                            },
                            "-ms-overflow-style": "none", // Ẩn thanh cuộn trên IE và Edge
                            "scrollbar-width": "none",
                        },
                    ]}
                >
                    <Stack
                        sx={[
                            {
                                top: 0,
                                left: 0,
                                position: "sticky",
                                zIndex: 3,
                                bgcolor: '#f4f5f5'
                            },
                        ]}
                    >
                        <Typography level="h4">Tìm kiếm</Typography>
                    </Stack>
                    <Stack>
                        <Typography
                            id="sandwich-group"
                            level="body-sm"
                        >
                            Loại hình làm việc
                        </Typography>
                        <div role="group" aria-labelledby="sandwich-group">
                            <List size="sm">
                                {contractTypeOptions.map((contractType, index) => (
                                    <ListItem key={index}>
                                        <Checkbox
                                            label={contractType.name}
                                            size="sm"
                                            checked={selectedContractTypeIds.includes(contractType.id)} // Đánh dấu checkbox nếu id có trong selectedContractTypeIds
                                            onChange={(event) =>
                                                event.target.checked
                                                    ? setSelectedContractTypeIds(prev => [...prev, contractType.id]) // Thêm vào nếu chọn
                                                    : setSelectedContractTypeIds(prev => prev.filter((id) => id !== contractType.id)) // Loại bỏ nếu bỏ chọn
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Stack>

                    <Divider />
                    <Stack>
                        <Typography
                            id="sandwich-group"
                            level="body-sm"
                        >
                            Học vấn
                        </Typography>
                        <div role="group" aria-labelledby="sandwich-group">
                            <List size="sm">
                                {educationOptions.map((education, index) => (
                                    <ListItem key={index}>
                                        <Checkbox
                                            label={education.name}
                                            size="sm"
                                            checked={selectedEducationIds.includes(education.id)} // Đánh dấu checkbox nếselectedEducationIds
                                            onChange={(event) =>
                                                event.target.checked
                                                    ? setSelectedEducationIds(prev => [...prev, education.id]) // Thêm vào nếu chọn
                                                    : setSelectedEducationIds(prev => prev.filter((id) => id !== education.id)) // Loại bỏ nếu bỏ chọn
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Stack>
                </Stack>

                <Stack flex={5} gap={2}>
                    <Typography level="h4">
                        Khám phá việc làm &nbsp;
                        <Chip variant="soft" color="success">
                            {jobs.length} &nbsp; việc làm
                        </Chip>
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                                md: "1fr 1fr 1fr",
                            },
                            gap: 3,
                        }}
                    >
                        {!isLoading ?
                            jobs.length !== 0 ?
                                currentJobs.map((job, index) => (
                                    <Card
                                        key={index}
                                        variant="outlined"
                                        sx={{
                                            transition: "border 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                                borderColor: "#00B14F",
                                                boxShadow: "0 1px 3px #00B14F",
                                                "& .hover-text": {
                                                    color: "#00B14F",
                                                },
                                            },
                                        }}
                                    >
                                        <Stack gap={0.5}>
                                            <Stack
                                                direction={"row"}
                                                justifyContent={"space-between"}
                                                alignItems={"start"}
                                            >
                                                <Stack direction={"row"} gap={2} mr={3}>
                                                    <img
                                                        src={`${job?.companyLogo}`}
                                                        alt="Company Logo"
                                                        style={{
                                                            width: 64,
                                                            height: 64,
                                                            borderRadius: "5px",
                                                        }}
                                                    />
                                                    <Stack gap={0.5}>
                                                        <Tooltip title={job?.title} placement="top" arrow>
                                                            <Link href={`/job-details/${job.id}`} underline="none">
                                                                <Typography
                                                                    level="title-lg"
                                                                    className="hover-text"
                                                                    sx={{
                                                                        transition: "color 0.3s",
                                                                    }}
                                                                >
                                                                    <p className="line-clamp-1">
                                                                        {job?.title}
                                                                    </p>
                                                                </Typography>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title={job?.companyName} placement="top" arrow>
                                                            <Typography
                                                                startDecorator={
                                                                    <BusinessIcon sx={{ fontSize: "medium" }} />
                                                                }
                                                                level="body-md"
                                                            >
                                                                <Link href={`/company-details/${job.companyId}`}>
                                                                    <p className="line-clamp-1 text-sm">
                                                                        {job?.companyName}
                                                                    </p>
                                                                </Link>
                                                            </Typography>
                                                        </Tooltip>
                                                        <Typography level="body-xs">
                                                            💰&nbsp;&nbsp;{job?.salary}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <IconButton variant="outlined" onClick={() => handleDeleteSave(job?.id)}>
                                                    {bookmarkedJobs.includes(job?.id) ? (
                                                        <BookmarkIcon color="success" />
                                                    ) : (
                                                        <BookmarkBorderIcon color="success" />
                                                    )}
                                                </IconButton>
                                            </Stack>
                                            <p className="text-gray-700 text-sm line-clamp-2">
                                                {job?.description}
                                            </p>
                                            <Divider />
                                            <Stack direction={"row"} justifyContent={"space-between"} mt={1}>
                                                <Chip
                                                    variant="plain"
                                                // color="primary"
                                                // size="sm"
                                                >
                                                    📍 {job?.city}
                                                </Chip>
                                                <Chip variant="plain" color="neutral" size="sm">
                                                    Còn {calculateDaysLeft(job?.deadline)} ngày ứng tuyển
                                                </Chip>
                                            </Stack>
                                        </Stack>
                                    </Card>
                                ))
                                :
                                <div className="flex items-center justify-center h-[400px] col-span-full">
                                    <Empty
                                        description="Không có công việc phù hợp"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                </div>
                            :
                            <div className="flex items-center justify-center h-[100px] col-span-full">
                                <Spin size="large" />
                            </div>
                        }
                    </Box>
                    <Stack alignItems={'center'} justifyContent={'center'}>
                        <Pagination
                            current={currentPage} // Trang hiện tại
                            total={jobs.length} // Tổng số mục
                            pageSize={pageSize} // Số mục trên mỗi trang
                            onChange={onPageChange} // Hàm xử lý khi thay đổi trang
                            showSizeChanger={false} // Không cho phép thay đổi số mục trên mỗi trang
                        />
                    </Stack>

                    {role == 'EMPLOYEE' &&
                        <Stack mb={4} gap={4}>
                            <Stack>
                                <Typography level="h4">Gợi ý việc làm phù hợp</Typography>
                                <Typography level="body-sm">
                                    Gợi ý việc làm dựa trên nghề nghiệp và kĩ năng của bạn
                                </Typography>
                            </Stack>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                        md: "1fr 1fr",
                                    },
                                    gap: 3,
                                }}
                            >
                                {!isLoading ?
                                    jobRecommends.map((job, index) => (
                                        <Card
                                            key={index}
                                            variant="outlined"
                                            sx={{
                                                transition: "border 0.3s, box-shadow 0.3s",
                                                "&:hover": {
                                                    borderColor: "#00B14F",
                                                    boxShadow: "0 1px 3px #00B14F",
                                                    "& .hover-text": {
                                                        color: "#00B14F",
                                                    },
                                                },
                                            }}
                                        >
                                            <Stack gap={0.5}>
                                                <Stack
                                                    direction={"row"}
                                                    justifyContent={"space-between"}
                                                    alignItems={"start"}
                                                >
                                                    <Stack direction={"row"} gap={2} mr={3}>
                                                        <img
                                                            src={`${job?.companyLogo}`}
                                                            alt="Company Logo"
                                                            style={{
                                                                width: 64,
                                                                height: 64,
                                                                borderRadius: "5px",
                                                            }}
                                                        />
                                                        <Stack gap={0.5}>
                                                            <Tooltip title={job?.jobTitle} placement="top" arrow>
                                                                <Link href={`/job-details/${job.jobId}`} underline="none">
                                                                    <Typography
                                                                        level="title-lg"
                                                                        className="hover-text"
                                                                        sx={{
                                                                            transition: "color 0.3s",
                                                                        }}
                                                                    >
                                                                        <p className="line-clamp-1">
                                                                            {job?.jobTitle}
                                                                        </p>
                                                                    </Typography>
                                                                </Link>
                                                            </Tooltip>
                                                            <Tooltip title={job?.companyName} placement="top" arrow>
                                                                <Typography
                                                                    startDecorator={
                                                                        <BusinessIcon sx={{ fontSize: "medium" }} />
                                                                    }
                                                                    level="body-md"
                                                                >
                                                                    <Link href={`/company-details/${job.companyId}`}>
                                                                        <p className="line-clamp-1 text-sm">
                                                                            {job?.companyName}
                                                                        </p>
                                                                    </Link>
                                                                </Typography>
                                                            </Tooltip>
                                                            <Typography level="body-xs">
                                                                💰&nbsp;&nbsp;{job?.jobSalary}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                    <IconButton variant="outlined" onClick={() => handleDeleteSave(job?.jobId)}>
                                                        {bookmarkedJobs.includes(job?.jobId) ? (
                                                            <BookmarkIcon color="success" />
                                                        ) : (
                                                            <BookmarkBorderIcon color="success" />
                                                        )}
                                                    </IconButton>
                                                </Stack>
                                                <p className="text-gray-700 text-sm line-clamp-2">
                                                    {job?.jobDescription}
                                                </p>
                                                <Divider />
                                                <Stack direction={"row"} justifyContent={"space-between"} mt={1} alignItems={"flex-start"}>
                                                    <Stack direction={"row"} gap={2} flexWrap={'wrap'}>
                                                        {job?.nameSkill.map((skill, index) => (
                                                            <Chip
                                                                variant="soft"
                                                                color="primary"
                                                                size="sm"
                                                            >
                                                                {skill}
                                                            </Chip>
                                                        ))}
                                                    </Stack>
                                                    <Chip variant="plain" color="neutral" size="sm">
                                                        Còn {calculateDaysLeft(job?.jobDeadline)} ngày ứng tuyển
                                                    </Chip>
                                                </Stack>
                                            </Stack>
                                        </Card>
                                    ))
                                    : (
                                        <div className="flex items-center justify-center h-[200px] col-span-full">
                                            <Spin size="large" />
                                        </div>
                                    )}
                            </Box>
                        </Stack>
                    }
                </Stack>
            </Stack>
        </Box>
    )
}