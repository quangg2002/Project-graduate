import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import Typography from "@mui/joy/Typography";
import Autocomplete from "@mui/joy/Autocomplete";
import Avatar from "@mui/joy/Avatar";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import RadioGroup from "@mui/joy/RadioGroup";
import Radio from "@mui/joy/Radio";
import Sheet from "@mui/joy/Sheet";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, { accordionDetailsClasses } from "@mui/joy/AccordionDetails";
import AccordionSummary, { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { Breadcrumbs, Link, Stack, Textarea } from "@mui/joy";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Input from '@mui/joy/Input';
import city from '../../utils/citis.json';
import districts from '../../utils/districts.json';
import { Field, Form, Formik } from "formik";
import { skillList, experienceList, positionList, jobTypeList, industryList, contracTypeList, educationList } from '../../services/autofillApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useParams, useNavigate } from 'react-router-dom';


export default function Addjob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [today] = useState(() => new Date().toISOString().split("T")[0]);

    const [experiences, setExperiences] = useState([]);
    const [positions, setPositions] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [industrys, setIndustry] = useState([]);
    const [education, setEducation] = useState([]);
    const [contractType, setContractType] = useState([]);
    const [skills, setSkills] = useState([]);

    // wysiwig

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [experienceResult, positionResult, jobTypeResult, industryResult, educationResult, contractTypeResult, skillResult] = await Promise.all([
                    dispatch(experienceList()).unwrap(),
                    dispatch(positionList()).unwrap(),
                    dispatch(jobTypeList()).unwrap(),
                    dispatch(industryList()).unwrap(),
                    dispatch(educationList()).unwrap(),
                    dispatch(contracTypeList()).unwrap(),
                    dispatch(skillList()).unwrap(),
                ]);

                if (experienceResult.response?.data) {
                    setExperiences(experienceResult.response.data);
                }
                if (positionResult.response?.data) {
                    setPositions(positionResult.response.data);
                }
                if (jobTypeResult.response?.data) {
                    setJobTypes(jobTypeResult.response.data);
                }
                if (industryResult.response?.data) {
                    setIndustry(industryResult.response.data);
                }
                if (educationResult.response?.data) {
                    setEducation(educationResult.response.data);
                }
                if (contractTypeResult.response?.data) {
                    setContractType(contractTypeResult.response.data);
                }
                if (skillResult.response?.data) {
                    setSkills(skillResult.response.data);
                }
            } catch (error) {
                toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
            }
        };

        fetchData();
    }, [dispatch]);

    const peopleData = [
        {
            name: "Andrew Smith",
            position: "UI Designer",
            avatar2x: "https://i.pravatar.cc/80?img=7",
            companyData: [
                {
                    role: "Senior designer",
                    name: "Dribbble",
                    logo: "https://www.vectorlogo.zone/logos/dribbble/dribbble-icon.svg",
                    years: "2015-now",
                },
                {
                    role: "Designer",
                    name: "Pinterest",
                    logo: "https://www.vectorlogo.zone/logos/pinterest/pinterest-icon.svg",
                    years: "2012-2015",
                },
            ],
            skills: ["UI design", "Illustration"],
        },
    ];

    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);


    const [filteredDistricts, setFilteredDistricts] = useState([]);

    const handleCityChange = (event, newValue) => {
        if (newValue) {
            const selectedCity = city.find((option) => option.name === newValue);
            const districtsForCity = districts.filter(
                (district: any) => district.city_id === selectedCity.id
            );
            setFilteredDistricts(districtsForCity);
        } else {
            setFilteredDistricts([]);
        }
    }

    return (
        <Stack>
            <Header />
            <Box
                sx={[
                    {
                        bgcolor: "background.appBody",
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(64px, 200px) minmax(450px, 1fr)",
                            md: "minmax(180px, 300px) minmax(600px, 1fr)",
                        },
                    },
                ]}
            >
                <Box
                    component="nav"
                    sx={[
                        {
                            p: 2,
                            bgcolor: "background.surface",
                            borderRight: "1px solid",
                            borderColor: "divider",
                            display: {
                                xs: "none",
                                sm: "inherit",
                            },
                            top: 68,
                            left: 0,
                            position: "sticky",
                            height: "89vh",
                            zIndex: 1000,
                        },
                    ]}
                >
                    <Navigation />
                </Box>
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        bgcolor: "background.level1",
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        // height: '100dvh',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Breadcrumbs

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
                                <HomeRoundedIcon />
                            </Link>
                            <Link
                                underline="hover"
                                color="neutral"
                                href="#some-link"
                                sx={{ fontSize: 12, fontWeight: 500 }}
                            >
                                Nhà tuyển dụng
                            </Link>
                            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
                                Thêm việc làm
                            </Typography>
                        </Breadcrumbs>
                    </Box>

                    <Typography level="h3">
                        Thêm bài đăng tuyển
                    </Typography>
                    <Formik
                        initialValues={{
                            title: '',
                            description: '',
                            benefit: '',
                            requirement: '',
                            location: '',
                            workingTime: '',
                            city: null,
                            district: null,
                            salary: '',
                            yearExperience: '',
                            position: '',
                            jobType: '',
                            contractType: '',
                            industry: '',
                            education: '',
                            deadline: '',
                            quantity: '',
                            email: '',
                            skills: []
                        }}
                        onSubmit={(values) => {
                            console.log(values)
                        }}
                    >
                        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        md: "2fr 1fr",
                                    },
                                    flexWrap: 'wrap-reverse',
                                    gap: 2
                                }}
                            >
                                <Form>
                                    <Box
                                        sx={[
                                            {
                                                bgcolor: "background.surface",
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderRadius: 'sm',
                                                p: 2,
                                                boxShadow: 'md'
                                            },
                                        ]}
                                    >
                                        <Box
                                            sx={{
                                                p: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Typography
                                                level="title-lg"
                                                textColor="text.secondary"
                                                component="h1"
                                            >
                                                Job
                                            </Typography>
                                            <Button color="success" type="submit">
                                                {id === '0' ? 'Đăng tuyển' : 'Cập nhật'}
                                            </Button>
                                        </Box>

                                        <AccordionGroup
                                            sx={{
                                                [`& .${accordionDetailsClasses.content}`]: {
                                                    px: 2,
                                                },
                                                [`& .${accordionSummaryClasses.button}`]: {
                                                    px: 2,
                                                },
                                            }}
                                        >
                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Tiêu đề <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails >
                                                    <Field
                                                        name='title'
                                                        as={Input}
                                                        size="sm"
                                                        placeholder="Tên việc làm tuyển dụng"
                                                    />
                                                </AccordionDetails>
                                            </Accordion>
                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Địa chỉ <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack gap={2} mb={1}>
                                                        <Stack direction={'row'} gap={2}>
                                                            <Stack flexGrow={1}>
                                                                <Autocomplete
                                                                    size="sm"
                                                                    placeholder="Tỉnh/ Thành phố"
                                                                    options={city.map((option) => option.name)}
                                                                    value={[city.find((item) => item.id === values.city)?.name]}
                                                                    onChange={(event, newValue: any) => {
                                                                        handleCityChange(event, newValue)
                                                                        values.district = ''
                                                                        const selectedCity = city.find((option) => option.name === newValue);
                                                                        setFieldValue("city", selectedCity ? selectedCity.id : "");
                                                                    }}
                                                                />
                                                            </Stack>
                                                            <Stack flexGrow={1}>
                                                                <Autocomplete
                                                                    size="sm"
                                                                    placeholder="Quận Huyện"
                                                                    options={filteredDistricts.map((option) => option.name)}
                                                                    value={[districts.find((item) => item.id === values.district)?.name]}
                                                                    groupBy={(option) => {
                                                                        console.log(option)
                                                                        const selectedDistrict = districts.find((distr) =>
                                                                            distr.city_id === values.city && distr.name === option
                                                                        );
                                                                        const cityObj = city.find((c) => c.id === selectedDistrict.city_id);
                                                                        return cityObj ? cityObj.name : "Khác";
                                                                    }}
                                                                    onChange={(event, newValue: any) => {
                                                                        const selectedDistrict = districts.find((option) =>
                                                                            option.city_id === values.city && option.name === newValue
                                                                        );
                                                                        setFieldValue("district", newValue ? selectedDistrict.id : "");
                                                                    }}
                                                                // disabled={!selectedCity}
                                                                />
                                                            </Stack>
                                                        </Stack>
                                                        <Field
                                                            name='location'
                                                            as={Input}
                                                            size="sm"
                                                            placeholder="Địa chỉ cụ thể"
                                                        />
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Ngành nghề & Kinh nghiệm làm việc <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack direction={'row'} gap={2} my={1}>
                                                        <Autocomplete
                                                            sx={{ flex: 1 }}
                                                            size="sm"
                                                            placeholder="Ngành nghề"
                                                            options={industrys}
                                                            getOptionLabel={(option: any) => option.name}
                                                            onChange={(event, option: any) => {
                                                                setFieldValue("industry", option ? option.id : "")
                                                            }}
                                                        />

                                                        <Autocomplete
                                                            sx={{ flex: 1 }}
                                                            size="sm"
                                                            placeholder="Kinh nghiệm làm việc"
                                                            options={experiences}
                                                            getOptionLabel={(option: any) => option.name}
                                                            onChange={(event, option: any) => {
                                                                setFieldValue("yearExperience", option ? option.id : "")
                                                            }}
                                                        />
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Vị trí  & Loại hình làm việc <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack direction={'row'} gap={2} my={1}>
                                                        <Autocomplete
                                                            sx={{ flex: 1 }}
                                                            size="sm"
                                                            placeholder="Vị trí"
                                                            options={positions}
                                                            getOptionLabel={(option: any) => option.name}
                                                            onChange={(event, option: any) => {
                                                                setFieldValue("position", option ? option.id : "")
                                                            }}
                                                        />

                                                        <Autocomplete
                                                            sx={{ flex: 1 }}
                                                            size="sm"
                                                            placeholder="Loại hình làm việc"
                                                            options={jobTypes}
                                                            getOptionLabel={(option: any) => option.name}
                                                            onChange={(event, option: any) => {
                                                                setFieldValue("jobType", option ? option.id : "")
                                                            }}
                                                        />
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Kĩ năng & Loại công việc <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack direction={'row'} gap={2} my={1}>
                                                        <Autocomplete
                                                            size="sm"
                                                            sx={{ flex: 1 }}
                                                            placeholder="Kĩ năng"
                                                            options={skills}
                                                            multiple
                                                            getOptionLabel={(option: any) => option.name}
                                                            onChange={(event, options: any[]) => {
                                                                const selectedIds = options.map(option => option.id);
                                                                setFieldValue("skills", selectedIds);
                                                            }}
                                                        />

                                                        <Autocomplete
                                                            size="sm"
                                                            sx={{ flex: 1 }}
                                                            placeholder="Loại công việc"
                                                            options={contractType}
                                                            getOptionLabel={(option: any) => option.name}
                                                            onChange={(event, option: any) => {
                                                                setFieldValue("contractType", option ? option.id : "")
                                                            }}
                                                        />
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>


                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Mức lương <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Field
                                                        as={Input}
                                                        name="salary"
                                                        placeholder="10 triệu"
                                                    />
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Hạn nộp hồ sơ & Số lượng <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack direction={'row'} gap={2} mb={1}>
                                                        <Stack flexGrow={1}>
                                                            <Field
                                                                as={Input}
                                                                name="deadline"
                                                                type="date"
                                                                size="sm"
                                                                placeholder="Hạn nộp hồ sơ"
                                                                slotProps={{
                                                                    input: {
                                                                        min: today
                                                                    },
                                                                }}
                                                            />
                                                        </Stack>
                                                        <Stack flexGrow={1}>
                                                            <Field
                                                                as={Input}
                                                                name="quantity"
                                                                size="sm"
                                                                type="number"
                                                                slotProps={{
                                                                    input: {
                                                                        min: 1,
                                                                    },
                                                                }}
                                                                placeholder="Số lượng tuyển dụng"
                                                            />
                                                        </Stack>
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Học vấn & Email <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack direction={'row'} gap={2} my={1}>
                                                        <Autocomplete
                                                            size="sm"
                                                            sx={{ flex: 1 }}
                                                            placeholder="Học vấn"
                                                            options={education}
                                                            getOptionLabel={(option: any) => option.name}
                                                            onChange={(event, option: any) => {
                                                                setFieldValue("education", option ? option.id : "")
                                                            }}
                                                        />

                                                        <Field
                                                            as={Input}
                                                            sx={{ flex: 1 }}
                                                            size="sm"
                                                            name="email"
                                                            type="email"
                                                            placeholder="example@gmail.com"
                                                        />
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Mô tả <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Field
                                                        name="description"
                                                        as={Textarea}
                                                        size="sm"
                                                        minRows={3}
                                                        placeholder="Mô tả việc làm"
                                                    />
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Trách nghiệm <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Field
                                                        name="requirements"
                                                        as={Textarea}
                                                        size="sm"
                                                        minRows={3}
                                                        placeholder="Trách nghiệm với công việc"
                                                    />
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Quyền lợi <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Field
                                                        name="benefit"
                                                        as={Textarea}
                                                        size="sm"
                                                        minRows={3}
                                                        placeholder="Quyền lợi khi làm việc"
                                                    />
                                                </AccordionDetails>
                                            </Accordion>

                                            <Accordion defaultExpanded>
                                                <AccordionSummary>
                                                    <Typography level="title-md">Thời gian làm việc <Typography component="span" color="danger">*</Typography></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Field
                                                        name="workingTime"
                                                        as={Textarea}
                                                        size="sm"
                                                        minRows={3}
                                                        placeholder="Thời gian làm việc"
                                                    />
                                                </AccordionDetails>
                                            </Accordion>
                                        </AccordionGroup>
                                    </Box>
                                </Form>
                                <Box>
                                    {peopleData.map((person, index) => (
                                        <Sheet
                                            key={index}
                                            component="li"
                                            sx={{
                                                borderRadius: 'sm',
                                                p: 2,
                                                listStyle: 'none',
                                                bgcolor: "background.surface",
                                                border: "1px solid",
                                                borderColor: "divider",
                                                boxShadow: 'md'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Avatar
                                                    variant="outlined"
                                                    src={person.avatar2x}
                                                    srcSet={`${person.avatar2x} 2x`}
                                                    sx={{ borderRadius: '50%' }}
                                                />
                                                <div>
                                                    <Typography level="title-md">{person.name}</Typography>
                                                    <Typography level="body-xs">{person.position}</Typography>
                                                </div>
                                            </Box>
                                            <Divider component="div" sx={{ my: 2 }} />
                                            <List sx={{ '--ListItemDecorator-size': '40px', gap: 2 }}>
                                                {person.companyData.map((company, companyIndex) => (
                                                    <ListItem key={companyIndex} sx={{ alignItems: 'flex-start' }}>
                                                        <ListItemDecorator
                                                            sx={{
                                                                '&::before': {
                                                                    content: '""',
                                                                    position: 'absolute',
                                                                    height: '100%',
                                                                    width: '1px',
                                                                    bgcolor: 'divider',
                                                                    left: 'calc(var(--ListItem-paddingLeft) + 12px)',
                                                                    top: '50%',
                                                                },
                                                            }}
                                                        >
                                                            <Avatar
                                                                src={company.logo}
                                                                sx={{ '--Avatar-size': '24px' }}
                                                            />
                                                        </ListItemDecorator>
                                                        <ListItemContent>
                                                            <Typography level="title-sm">{company.role}</Typography>
                                                            <Typography level="body-xs">{company.name}</Typography>
                                                        </ListItemContent>
                                                        <Typography level="body-xs">{company.years}</Typography>
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <Button

                                                variant="plain"
                                                endDecorator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
                                                sx={{ px: 1, mt: 1 }}
                                            >
                                                Expand
                                            </Button>
                                            <Divider component="div" sx={{ my: 2 }} />
                                            <Typography level="title-sm">Skills tags:</Typography>
                                            <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                                                {person.skills.map((skill, skillIndex) => (
                                                    <Chip
                                                        key={skillIndex}
                                                        variant="outlined"
                                                        color="neutral"

                                                    >
                                                        {skill}
                                                    </Chip>
                                                ))}
                                            </Box>
                                        </Sheet>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Stack>
    );
}
