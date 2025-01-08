import { Box, Button, Card, Input, Link, Option, Select, selectClasses, Stack, Tooltip, Typography } from "@mui/joy";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import { useState, useEffect } from "react";
import citis from "../../utils/citis.json";
import { getListCompany } from '../../services/companyApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { Empty, Spin } from "antd";


interface Company {
    id: number;
    companyName: string;
    logo: string;
    address: string;
}

export default function ListCompany() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState('');
    const [listCompany, setListCompany] = useState<Company[]>([]);
    const [filteredJobs, setFilteredJobs] = useState(listCompany);


    const handleSearch = async () => {
        setIsLoading(true)

        const filtered = listCompany.filter((job) => {
            const matchTitle = searchQuery ? job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            const matchLocation = selectedCity ? job.address.toLowerCase().includes(selectedCity.toLowerCase()) : true;
            // const matchLocation = selectedCity ? job.address === selectedCity : true;
            return matchTitle && matchLocation;
        });

        setFilteredJobs(filtered);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                dispatch(startLoading())
                const action = await dispatch(getListCompany());
                if (getListCompany.fulfilled.match(action)) {
                    const response = action.payload.response?.data;

                    if (response) {
                        setListCompany(response.map((cpn: any) => ({ id: cpn.id, companyName: cpn.companyName, logo: cpn.logo, address: cpn.address })));
                        setFilteredJobs(response.map((cpn: any) => ({ id: cpn.id, companyName: cpn.companyName, logo: cpn.logo, address: cpn.address })));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch company data:', error);
            } finally {
                dispatch(stopLoading());
                setIsLoading(false)
            }
        };

        fetchCompanyData();
    }, [dispatch]);

    return (
        <Box bgcolor={'#f4f5f5'} minHeight={'100vh'}>
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
                            placeholder="Tên công ty"
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
                        <Option key="all" value="">
                            Tất cả
                        </Option>
                        {citis.map((city) => (
                            <Option key={city.id} value={city.name}>
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
                </Stack>
            </Stack>
            <Stack mt={4} mx={5} gap={4}>
                <Stack>
                    <Typography level="h4">Khám phá doanh nghiệp</Typography>
                    <Typography level="body-md">
                        Hiện tại đang có 2 doanh nghiệp
                    </Typography>
                </Stack>

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
                        filteredJobs.length !== 0 ?
                            filteredJobs.map((company, index) => (
                                <Card
                                    key={index}
                                    variant="outlined"
                                    sx={{
                                        padding: "8px",
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
                                    <Stack direction={'row'} gap={1}>
                                        <img
                                            src={`${company?.logo}`}
                                            alt="Company Logo"
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '5px',
                                            }}
                                        />

                                        <Stack>
                                            <Tooltip title={company?.companyName} placement="top" arrow>
                                                <Link href={`/company-details/${company.id}`} underline="none">
                                                    <Typography
                                                        level="title-md"
                                                        className="hover-text"
                                                        sx={{
                                                            transition: 'color 0.3s',
                                                        }}
                                                    >
                                                        {company?.companyName}
                                                    </Typography>
                                                </Link>
                                            </Tooltip>
                                            <Stack direction={'row'} gap={2} >
                                                <Stack><p className="line-clamp-1 text-sm"> 📍 {company?.address}</p></Stack>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Card>
                            ))
                            :
                            <div className="flex items-center justify-center h-[200px] w-screen">
                                <Empty
                                    description="Không có cong ty phù hợp"
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
        </Box>
    )
}