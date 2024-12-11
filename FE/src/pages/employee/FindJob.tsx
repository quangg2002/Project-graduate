import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Chip,
    Divider,
    IconButton,
    Input,
    Link,
    Option,
    Select,
    selectClasses,
    Stack,
    Tooltip,
    Typography,
} from "@mui/joy";
import citis from "../../utils/citis.json";

import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import Header from "../../components/Header";
import SchoolIcon from "@mui/icons-material/School";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import CheckIcon from '@mui/icons-material/Check';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BusinessIcon from "@mui/icons-material/Business";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

import { toast } from 'react-toastify';
import { getFavoriteJob } from '../../services/favoriteJobApi';
import { favoriteJobCreate } from '../../services/favoriteJobApi';
import useAppDispatch from "../../hooks/useAppDispatch";
import { startLoading, stopLoading } from "../../redux/slice/loadingSlice";
import { useSelector } from "react-redux";
import {
    experienceList,
    positionList,
    jobTypeList,
    industryList,
    contracTypeList,
    educationList,
} from "../../services/autofillApi";

import { jobSearch, jobRecommend } from "../../services/jobApi";
import { Empty, Spin } from "antd";



const selectStyles = {
    flex: 1,
    color: "#000",
    [`& .MuiSelect-indicator`]: {
        transition: "0.2s",
        "&.Mui-expanded": {
            transform: "rotate(-180deg)",
        },
    },
    "&:hover": {
        border: "1px solid #000",
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

export default function Findjob() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([]);

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

    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobRecommends, setJobRecommends] = useState<JobRecommend[]>([])

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<number>();

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

    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
    };

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
        <Box bgcolor={'#f4f5f5'}>
            <Header />
            <Stack
                sx={{ background: "linear-gradient(11deg,#A7D676,#85CBCC)" }}
                py={3}
            >
                <Stack
                    direction={"row"}
                    width={"80%"}
                    gap={1}
                    flexWrap={"wrap"}
                    alignSelf={"center"}
                >
                    <Stack flex={2}>
                        <Input
                            placeholder="Vị trí tuyển dụng"
                            startDecorator={<SearchIcon />}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            value={searchQuery}
                        />

                    </Stack>

                    <Select
                        startDecorator={
                            <RoomOutlinedIcon sx={{ fontSize: "medium" }} />
                        }
                        sx={{
                            [`& .${selectClasses.indicator}`]: {
                                transition: "0.2s",
                                [`&.${selectClasses.expanded}`]: {
                                    transform: "rotate(-180deg)",
                                },
                            },
                        }}
                        onChange={(event, newValue) => {
                            setSelectedCity(newValue);
                        }}
                        value={selectedCity}
                        placeholder="Địa điểm"
                    >
                        {citis.map((city) => (
                            <Option key={city.id} value={city.id}>
                                {city.name}
                            </Option>
                        ))}
                    </Select>

                    <Button
                        onClick={handleSearch}
                        type="submit"
                        startDecorator={<SearchIcon />}
                        sx={{
                            bgcolor: "#00b14f",
                            "&:hover": {
                                bgcolor: "#008f3e",
                            },
                        }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={handleToggle}
                        startDecorator={<FilterListIcon />}
                        endDecorator={
                            <KeyboardArrowDownIcon
                                sx={{
                                    transform: isExpanded
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                }}
                            />
                        }
                        variant="solid"
                        sx={{
                            bgcolor: "#00b14f",
                            "&:hover": {
                                bgcolor: "#008f3e",
                            },
                        }}
                    >
                        <Typography sx={{ color: "#FFF" }}>Lọc nâng cao</Typography>
                    </Button>
                </Stack>
                <Stack
                    direction={"row"}
                    gap={2}
                    width={"80%"}
                    alignSelf={"center"}
                    sx={{
                        maxHeight: isExpanded ? "40px" : "0px",
                        transform: isExpanded ? "scaleY(1)" : "scaleY(0)",
                        transformOrigin: "top",
                        overflow: "hidden",
                        opacity: isExpanded ? 1 : 0,
                        transition: "all 0.5s ease",
                        borderRadius: "sm",
                        mt: isExpanded ? 2 : 0,
                    }}
                >
                    <Select
                        multiple
                        startDecorator={
                            <ApartmentIcon
                                sx={{ fontSize: "medium", color: "#000" }}
                            />
                        }
                        indicator={
                            <KeyboardArrowDownIcon sx={{ color: "#000" }} />
                        }
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
                        startDecorator={
                            <BusinessCenterIcon
                                sx={{ fontSize: "medium", color: "#000" }}
                            />
                        }
                        indicator={
                            <KeyboardArrowDownIcon sx={{ color: "#000" }} />
                        }
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

                    <Select
                        multiple
                        startDecorator={
                            <WorkspacePremiumIcon
                                sx={{ fontSize: "medium", color: "#000" }}
                            />
                        }
                        indicator={
                            <KeyboardArrowDownIcon sx={{ color: "#000" }} />
                        }
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

                    <Select
                        multiple
                        startDecorator={
                            <SchoolIcon sx={{ fontSize: "medium", color: "#000" }} />
                        }
                        indicator={<KeyboardArrowDownIcon sx={{ color: "#000" }} />}
                        sx={selectStyles}
                        onChange={(event, newValue) => {
                            setSelectedEducationIds(newValue)
                        }}
                        value={selectedEducationIds}
                        placeholder="Học Vấn"
                    >
                        {educationOptions.map((education) => (
                            <Option key={education?.id} value={education.id} sx={{ justifyContent: 'space-between' }}>
                                {education.name}
                                <CheckIcon
                                    sx={{
                                        opacity: selectedEducationIds.includes(education.id) ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out',
                                    }}
                                    color="primary"
                                />
                            </Option>
                        ))}
                    </Select>

                    <Select
                        multiple
                        startDecorator={
                            <WorkspacesIcon
                                sx={{ fontSize: "medium", color: "#000" }}
                            />
                        }
                        indicator={<KeyboardArrowDownIcon sx={{ color: "#000" }} />}
                        sx={selectStyles}
                        onChange={(event, newValue: number[]) => {
                            setSelectedJobTypeIds(newValue);
                        }}
                        value={selectedJobTypeIds}
                        // renderValue={() => 'Làm việc'}
                        placeholder='Làm việc'
                    >
                        {jobTypeOptions.map((jobType) => (
                            <Option key={jobType.id} value={jobType.id} sx={{ justifyContent: 'space-between' }}>
                                {jobType.name}
                                <CheckIcon
                                    sx={{
                                        opacity: selectedJobTypeIds.includes(jobType.id) ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out',
                                    }}
                                    color="primary"
                                />
                            </Option>
                        ))}
                    </Select>

                    <Select
                        multiple
                        startDecorator={
                            <WorkHistoryIcon
                                sx={{ fontSize: "medium", color: "#000" }}
                            />
                        }
                        indicator={<KeyboardArrowDownIcon sx={{ color: "#000" }} />}
                        sx={selectStyles}
                        onChange={(event, newValue: number[]) => {
                            setSelectedContractTypeIds(newValue);
                        }}
                        value={selectedContractTypeIds}
                        placeholder="Loại hình"
                    >
                        {contractTypeOptions.map((contractType) => (
                            <Option key={contractType?.id} value={contractType?.id} sx={{ justifyContent: 'space-between' }}>
                                {contractType?.name}
                                <CheckIcon
                                    sx={{
                                        opacity: selectedContractTypeIds.includes(contractType.id) ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out',
                                    }}
                                    color="primary"
                                />
                            </Option>
                        ))}
                    </Select>
                </Stack>
            </Stack>

            <Stack my={4} mx={5} gap={4}>
                <Stack>
                    <Typography level="h4">Khám phá việc làm</Typography>
                    <Typography level="body-md">
                        Hiện tại đang có {jobs.length} tin tuyển dụng
                    </Typography>
                </Stack>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                            md: "1fr 1fr 1fr 1fr",
                        },
                        gap: 3,
                    }}
                >
                    {!isLoading ?
                        jobs.length !== 0 ?
                            jobs.map((job, index) => (
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
                            <div className="flex items-center justify-center h-[200px] w-screen">
                                <Empty
                                    description="Không có công việc phù hợp"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </div>
                        :
                        <div className="flex items-center justify-center h-[200px] w-screen">
                            <Spin size="large" />
                        </div>
                    }
                </Box>
            </Stack>
            {role == 'EMPLOYEE' &&
                <Stack my={4} mx={5} gap={4}>
                    <Stack>
                        <Typography level="h4">Gợi ý việc làm phù hợp</Typography>
                        <Typography level="body-md">
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
                                        <Stack direction={"row"} justifyContent={"space-between"} mt={1}>
                                            <Stack direction={"row"} gap={2}>
                                                {job?.nameSkill.map((skill, index) => (
                                                    <Chip
                                                        variant="solid"
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
                                <div className="flex items-center justify-center h-[200px] w-screen">
                                    <Spin size="large" />
                                </div>
                            )}
                    </Box>
                </Stack>
            }
        </Box>
    );
}
