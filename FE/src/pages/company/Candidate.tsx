import React, { useEffect, useState } from 'react';
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Typography, IconButton, Input, Box, Button, CircularProgress, Stack } from "@mui/joy";

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Divider from '@mui/joy/Divider';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Link from '@mui/joy/Link';
import Chip from '@mui/joy/Chip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Checkbox from '@mui/joy/Checkbox';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { applicationWithCompany, applicationUpdate, deleteApplication, ApplicationStatus } from '../../services/applicationApi';
import { Drawer } from 'antd';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import TelegramIcon from '@mui/icons-material/Telegram';

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key | string,
): (
    a: { [key: string]: any },
    b: { [key: string]: any },
) => number {
    return order === 'desc'
        ? (a, b) => -descendingComparator(a, b, orderBy)
        : (a, b) => descendingComparator(a, b, orderBy);
}

function descendingComparator<Key extends keyof any>(
    a: { [key: string]: any },
    b: { [key: string]: any },
    orderBy: Key | string,
) {
    const keys = (orderBy as string).split('.');

    const aValue = keys.reduce((obj, key) => obj?.[key], a);
    const bValue = keys.reduce((obj, key) => obj?.[key], b);

    if (aValue < bValue) {
        return -1;
    }
    if (aValue > bValue) {
        return 1;
    }
    return 0;
}

type JobSelected = {
    appllicationId: string;
    fullName: string;
    jobTitle: string;
    position: string;
    email: string;
    coverLetter: string;
    createdAt: string;
    cvPdf: string;
    phoneNumberEmployee: string;
};

export default function Candidate() {

    const [openDraw, setOpenDraw] = useState(false);
    const [jobSlected, setJobSelected] = useState<JobSelected | null>(null);
    const dispatch = useAppDispatch();
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [order, setOrder] = useState<Order>('desc');
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');


    const showDrawer = (event, jobId) => {
        const selectedApplication = applications.find(app => app.id === jobId);
        setJobSelected(selectedApplication);

        setSelected((prevSelected) => {
            if (prevSelected.includes(jobId)) {
                return prevSelected.filter(id => id !== jobId);
            } else {
                return [...prevSelected, jobId];
            }
        });

        setOpenDraw(true);
    };

    const onClose = () => {
        setOpenDraw(false);
        setSelected([]);
    };


    useEffect(() => {
        const fetchJobDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await dispatch(applicationWithCompany());
                const data = result?.payload?.response?.data || [];
                setApplications(data);
                setFilteredApplications(data);
            } catch (err) {
                setError(err || 'Không thể tải danh sách ứng viên');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetail();
    }, [dispatch]);


    const handleUpdateStatus = async (id: number, status: ApplicationStatus) => {
        const originalApplications = [...applications];
        setApplications((prevApplications) =>
            prevApplications.map((app) =>
                app.id === id ? { ...app, status } : app
            )
        );

        try {
            setUpdatingId(id);
            const result = await dispatch(applicationUpdate({ id, status }));
            if (!result?.payload?.response?.data) {
                throw new Error('Không thể cập nhật trạng thái');
            }
            toast.success(`Cập nhật trạng thái thành ${status}`);
        } catch (err) {
            setApplications(originalApplications);
            toast.error('Có lỗi xảy ra');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteApplication = async (id: number) => {
        const originalApplications = [...applications];
        setApplications((prevApplications) =>
            prevApplications.filter((app) => app.id !== id)
        );

        try {
            const result = await dispatch(deleteApplication({ id }));
            toast.success('Xóa đơn ứng tuyển thành công');
        } catch (err) {
            setApplications(originalApplications);
            toast.error('Có lỗi xảy ra');
        } finally {
            setUpdatingId(null);
        }
    };

    useEffect(() => {
        let filtered = applications;

        if (searchQuery.trim()) {
            filtered = filtered.filter((app) =>
                app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((app) => app.status === statusFilter);
        }

        setFilteredApplications(filtered);
    }, [searchQuery, statusFilter, applications]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
        );
    }

    console.log(selected)

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header />
            <Box
                sx={[
                    {
                        bgcolor: "background.appBody",
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(64px, 200px) minmax(450px, 1fr)",
                            md: "minmax(180px, 300px) minmax(500px, 1fr)",
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
                        bgcolor: "background.appBody",
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
                        height: '100dvh',
                        gap: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                Ứng viên
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            mb: 1,
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'start', sm: 'center' },
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography level="h3" component="h1">
                            Ứng viên
                        </Typography>
                        <Button
                            color="primary"
                            startDecorator={<DownloadRoundedIcon />}
                            size="sm"
                        >
                            Download PDF
                        </Button>
                    </Box>
                    <Sheet
                        className="SearchAndFilters-mobile"
                        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
                    >
                        <Input
                            size="sm"
                            placeholder="Tìm kiếm"
                            startDecorator={<SearchIcon />}
                            sx={{ flexGrow: 1 }}
                        />
                        <IconButton
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            onClick={() => setOpen(true)}
                        >
                            <FilterAltIcon />
                        </IconButton>
                        <Modal open={open} onClose={() => setOpen(false)}>
                            <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                                <ModalClose />
                                <Typography id="filter-modal" level="h2">
                                    Filters
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl size="sm">
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            size="sm"
                                            placeholder="Filter by status"
                                            slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                                        >
                                            <Option value="paid">Paid</Option>
                                            <Option value="pending">Pending</Option>
                                            <Option value="refunded">Refunded</Option>
                                            <Option value="cancelled">Cancelled</Option>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="sm">
                                        <FormLabel>Category</FormLabel>
                                        <Select size="sm" placeholder="All">
                                            <Option value="all">All</Option>
                                            <Option value="refund">Refund</Option>
                                            <Option value="purchase">Purchase</Option>
                                            <Option value="debit">Debit</Option>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="sm">
                                        <FormLabel>Customer</FormLabel>
                                        <Select size="sm" placeholder="All">
                                            <Option value="all">All</Option>
                                            <Option value="olivia">Olivia Rhye</Option>
                                            <Option value="steve">Steve Hampton</Option>
                                            <Option value="ciaran">Ciaran Murray</Option>
                                            <Option value="marina">Marina Macdonald</Option>
                                            <Option value="charles">Charles Fulton</Option>
                                            <Option value="jay">Jay Hoper</Option>
                                        </Select>
                                    </FormControl>
                                    <Button color="primary" onClick={() => setOpen(false)}>
                                        Submit
                                    </Button>
                                </Sheet>
                            </ModalDialog>
                        </Modal>
                    </Sheet>
                    <Box
                        className="SearchAndFilters-tabletUp"
                        sx={{
                            borderRadius: 'sm',
                            py: 2,
                            display: { xs: 'none', sm: 'flex' },
                            flexWrap: 'wrap',
                            gap: 1.5,
                            '& > *': {
                                minWidth: { xs: '120px', md: '160px' },
                            },
                        }}
                    >
                        <FormControl sx={{ flex: 1 }}>
                            <FormLabel><Typography level='title-md'>Tìm kiếm theo tên việc đăng tuyển</Typography></FormLabel>
                            <Input
                                size="sm"
                                placeholder="Nhập tên công việc"
                                startDecorator={<SearchIcon />}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel><Typography level='title-md'>Trạng thái</Typography></FormLabel>
                            <Select
                                size="sm"
                                placeholder="Chọn trạng thái"
                                slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                                value={statusFilter}
                                onChange={(event, newValue) => setStatusFilter(newValue)}
                            >
                                <Option value="ALL">Tất cả</Option>
                                <Option color='success' value="ACCEPTED">Phê duyệt</Option>
                                <Option color="primary" value="PENDING">Đang chờ</Option>
                                <Option color="danger" value="REJECTED">Từ chối</Option>
                            </Select>
                        </FormControl>
                        {/* <FormControl size="sm">
                            <FormLabel>Tìm kiếm</FormLabel>
                            <Button size='sm'>Tìm kiếm</Button>
                        </FormControl> */}
                    </Box>
                    <Sheet
                        className="OrderTableContainer"
                        variant="outlined"
                        sx={{
                            display: { xs: 'none', sm: 'initial' },
                            width: '100%',
                            borderRadius: 'sm',
                            flexShrink: 1,
                            overflow: 'auto',
                            minHeight: 0,
                        }}
                    >
                        <Table
                            aria-labelledby="tableTitle"
                            stickyHeader
                            hoverRow
                            sx={{
                                '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                                '--Table-headerUnderlineThickness': '1px',
                                '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                                '--TableCell-paddingY': '4px',
                                '--TableCell-paddingX': '8px',
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                                        <Checkbox
                                            size="sm"
                                            indeterminate={
                                                selected.length > 0 && selected.length !== applications.length
                                            }
                                            checked={selected.length === applications.length}
                                            onChange={(event) => {
                                                setSelected(
                                                    event.target.checked ? applications.map((app) => app.id) : [],
                                                );
                                            }}
                                            color={
                                                selected.length > 0 || selected.length === applications.length
                                                    ? 'primary'
                                                    : undefined
                                            }
                                            sx={{ verticalAlign: 'text-bottom' }}
                                        />
                                    </th>
                                    <th style={{ width: 240, padding: '12px 6px' }}>
                                        <Link
                                            underline="none"
                                            color="primary"
                                            component="button"
                                            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                                            endDecorator={<ArrowDropDownIcon />}
                                            sx={[
                                                {
                                                    fontWeight: 'lg',
                                                    '& svg': {
                                                        transition: '0.2s',
                                                        transform:
                                                            order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                                    },
                                                },
                                                order === 'desc'
                                                    ? { '& svg': { transform: 'rotate(0deg)' } }
                                                    : { '& svg': { transform: 'rotate(180deg)' } },
                                            ]}
                                        >
                                            Tên bài đăng tuyển
                                        </Link>
                                    </th>
                                    <th style={{ width: 180, padding: '12px 24px', }}>
                                        Ứng viên
                                    </th>
                                    <th style={{ width: 140, padding: '12px 6px' }}>Trạng thái</th>
                                    <th style={{ width: 100, padding: '12px 0px' }}>Ngày ứng tuyển</th>
                                    <th style={{ width: 140, padding: '0px 0px' }}> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...filteredApplications].sort(getComparator(order, 'jobTitle')).map((application) => (
                                    <tr key={application.id}>
                                        <td style={{ textAlign: 'center', width: 120 }}>
                                            <Checkbox
                                                size="sm"
                                                checked={selected.includes(application.id)}
                                                color={selected.includes(application.id) ? 'primary' : undefined}
                                                onChange={(event) => {
                                                    setSelected((ids) =>
                                                        event.target.checked
                                                            ? ids.concat(application.id)
                                                            : ids.filter((itemId) => itemId !== application.id),
                                                    );
                                                }}
                                                slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                                sx={{ verticalAlign: 'text-bottom' }}
                                            />
                                        </td>
                                        <td>
                                            <Typography level="title-sm">{application.jobTitle}</Typography>
                                        </td>
                                        <td>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Avatar size="sm">{application.fullName.substring(0, 1)}</Avatar>
                                                <div>
                                                    <Typography level="body-xs">{application.fullName}</Typography>
                                                    <Typography level="body-xs">{application.email}</Typography>
                                                </div>
                                            </Box>

                                        </td>
                                        <td>
                                            {updatingId === application.id
                                                ?
                                                <CircularProgress size="sm" />
                                                :
                                                <Chip
                                                    variant="soft"
                                                    size="sm"
                                                    startDecorator={
                                                        {
                                                            ACCEPTED: <CheckRoundedIcon />,
                                                            PENDING: <AutorenewRoundedIcon />,
                                                            REJECTED: <BlockIcon />,
                                                        }[application.status]
                                                    }
                                                    color={
                                                        {
                                                            ACCEPTED: 'success',
                                                            PENDING: 'primary',
                                                            REJECTED: 'danger',
                                                        }[application.status] as ColorPaletteProp
                                                    }
                                                >
                                                    {application.status}
                                                </Chip>
                                            }
                                        </td>
                                        <td>
                                            <Typography level="body-xs">{application.createdAt.substring(0, 10)}</Typography>
                                        </td>
                                        <td>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <Link level="body-xs" component="button" onClick={() => window.open(`${application.cvPdf}`)}>
                                                    Download cv
                                                </Link>
                                                <Dropdown>
                                                    <MenuButton
                                                        slots={{ root: IconButton }}
                                                        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                                                    >
                                                        <MoreHorizRoundedIcon />
                                                    </MenuButton>
                                                    <Menu size="sm" sx={{ minWidth: 140 }}>
                                                        <MenuItem onClick={(event) => showDrawer(event, application?.id)}>Xem chi tiết</MenuItem>
                                                        <MenuItem
                                                            color='success'
                                                            onClick={() => {
                                                                if (application.status !== ApplicationStatus.ACCEPTED) {
                                                                    handleUpdateStatus(application.id, ApplicationStatus.ACCEPTED);
                                                                }
                                                            }}
                                                        >
                                                            Phê duyệt
                                                        </MenuItem>
                                                        <MenuItem
                                                            color='danger'
                                                            onClick={() => {
                                                                if (application.status !== ApplicationStatus.REJECTED) {
                                                                    handleUpdateStatus(application.id, ApplicationStatus.REJECTED);
                                                                }
                                                            }}
                                                        >
                                                            Từ chối
                                                        </MenuItem>
                                                        <Divider />
                                                        <MenuItem
                                                            color="danger"
                                                            onClick={() => handleDeleteApplication(application.id)}
                                                        >
                                                            Delete
                                                        </MenuItem>
                                                    </Menu>
                                                </Dropdown>
                                            </Box>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>

                    <Box sx={{ display: { xs: 'block', sm: 'none' }, pb: 7 }}>
                        {filteredApplications.map((candidate) => (
                            <List key={candidate.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}    >
                                <ListItem
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                    }}
                                >
                                    <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                                        <ListItemDecorator>
                                            <Avatar size="sm">{candidate.jobTitle}</Avatar>
                                        </ListItemDecorator>
                                        <div>
                                            <Typography gutterBottom sx={{ fontWeight: 600 }}>
                                                {candidate.fullName}
                                            </Typography>
                                            <Typography level="body-xs" gutterBottom>
                                                {candidate.email}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 0.5,
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography level="body-xs">{candidate.createdAt}</Typography>
                                                <Typography level="body-xs">&bull;</Typography>
                                                <Typography level="body-xs">{candidate.id}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Link level="body-sm" component="button">
                                                    Download
                                                </Link>
                                                <Dropdown>
                                                    <MenuButton
                                                        slots={{ root: IconButton }}
                                                        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                                                    >
                                                        <MoreHorizRoundedIcon />
                                                    </MenuButton>
                                                    <Menu size="sm" sx={{ minWidth: 140 }}>
                                                        <MenuItem>Edit</MenuItem>
                                                        <MenuItem>Rename</MenuItem>
                                                        <MenuItem>Move</MenuItem>
                                                        <Divider />
                                                        <MenuItem color="danger">Delete</MenuItem>
                                                    </Menu>
                                                </Dropdown>
                                            </Box>
                                        </div>
                                    </ListItemContent>
                                    <Chip
                                        variant="soft"
                                        size="sm"
                                        startDecorator={
                                            {
                                                Paid: <CheckRoundedIcon />,
                                                Refunded: <AutorenewRoundedIcon />,
                                                Cancelled: <BlockIcon />,
                                            }[candidate.status]
                                        }
                                        color={
                                            {
                                                Paid: 'success',
                                                Refunded: 'neutral',
                                                Cancelled: 'danger',
                                            }[candidate.status] as ColorPaletteProp
                                        }
                                    >
                                        {candidate.status}
                                    </Chip>
                                </ListItem>
                                <ListDivider />
                            </List>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Drawer
                title={<span style={{ fontFamily: '"Sansita", sans-serif', fontWeight: 600 }}>Thư tuyển dụng</span>}
                onClose={onClose}
                open={openDraw}
                zIndex={9999999999}
            >
                <Stack position={'relative'} height={'100%'}>
                    <Stack flex={1} gap={0.5}>
                        <Typography fontWeight={'600'}>Vị trí: {jobSlected?.position}</Typography>
                        <Stack direction={'row'} gap={1}>
                            <Typography fontWeight={'600'}>Tên ứng viên: </Typography>
                            <Typography>{jobSlected?.fullName}</Typography>
                        </Stack>

                        <Stack direction={'row'} gap={1}>
                            <Typography fontWeight={'600'}>Email: </Typography>
                            <Typography>{jobSlected?.email}</Typography>
                        </Stack>

                        <Stack direction={'row'} gap={1}>
                            <Typography fontWeight={'600'}>Sđt liên hệ: </Typography>
                            <Typography>{jobSlected?.phoneNumberEmployee}</Typography>
                        </Stack>

                        <Stack direction={'row'} gap={1}>
                            <Typography fontWeight={'600'}>CV: </Typography>
                            <Link underline='always' component="button" onClick={() => window.open(`${jobSlected.cvPdf}`)}>
                                Download cv
                            </Link>
                        </Stack>
                        <Typography><Typography fontWeight={'600'}>Thư giới thiệu:</Typography> {jobSlected?.coverLetter}</Typography>

                    </Stack>
                    <Stack position={'sticky'} bottom={0} gap={2}>
                        <Button startDecorator={<TelegramIcon />}>Nhắn tin</Button>
                        <Button startDecorator={<ForwardToInboxIcon />}
                            onClick={() => {
                                window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${jobSlected?.email}`, '_blank');
                            }}
                        >
                            Liên hệ qua email
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>

        </CssVarsProvider>
    );
}
