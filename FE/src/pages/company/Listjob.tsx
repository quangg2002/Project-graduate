import { useState } from 'react';
import Box from "@mui/material/Box";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import {
  Typography,
  Link,
  Breadcrumbs,
  Button,
  Sheet,
  Table,
  Checkbox,
  Divider,
  IconButton,
  Stack,
  Input,
  Select,
  Option,
} from "@mui/joy";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import JobCard from '../../components/JobCard';

export default function Listjob() {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const [showDetails, setShowDetails] = useState(false);  

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleSearch = () => {
    const searchInfo = {
      jobTitle: jobTitle,
      location: location,
    };
    console.log(searchInfo);
  }

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
          sx={[
            {
              m: 4,
              mt: 2,
              bgcolor: "background.appBody",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            },
          ]}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
              <Typography
                color="primary"
                sx={{ fontWeight: 500, fontSize: 12 }}
              >
                Danh sách đăng tuyển
              </Typography>
            </Breadcrumbs>
          </Box>

          <Typography level="h3" component="h1">
            Tuyển dụng
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', my: 1 }}>
            <Input
              startDecorator={<SearchIcon />}
              placeholder="Tên công việc, vị trí ứng tuyển..."
              sx={{ width: 300 }}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />

            {/* Location Selector */}
            <Select
              startDecorator={<LocationOnIcon />}
              value={location}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setLocation(newValue);
                }
              }}
              sx={{ width: 150 }}
            >
              <Option value="Ha Noi">Hà Nội</Option>
              <Option value="Ho Chi Minh">Hồ Chí Minh</Option>
              <Option value="Da Nang">Đà Nẵng</Option>
            </Select>

            <Button
              color="success"
              variant="solid"
              startDecorator={<SearchIcon />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Box>

          <Sheet
            className="OrderTableContainer"
            sx={{
              width: "100%",
              borderRadius: "sm",
              flexShrink: 1,
              overflow: "auto",
              minHeight: 0,
              p: 2
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '4fr 2fr 1fr 1fr',
                gap: 2,
                mb: 1,
                fontWeight: 'bold',
              }}
            >
              <Typography color="primary">Tiêu đề</Typography>
              <Typography color="primary">Thời gian tạo / Hạn hs</Typography>
              <Typography color="primary">Số ứng viên</Typography>
              <Typography color="primary">Thao tác</Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '4fr 2fr 1fr 1fr',
                gap: 2,
                mb: showDetails ? 0 : 2
              }}
            >
              <Box>
                <Typography level='title-sm'>
                  GIẢNG VIÊN IELTS OFFLINE (THU NHẬP TỪ 460.000 - 700.000VND /BUỔI)
                </Typography>
                <Typography fontSize={14}>📍 Hà Nội</Typography>
              </Box>
              <Box>
                <Typography fontSize={14}>2023-04-16 07:55:40</Typography>
                <Typography fontSize={14}>2023-12-08</Typography>
              </Box>
              <Typography color="success">8 người</Typography>
              <Box>
                <IconButton color="primary" size='sm' onClick={handleToggleDetails}>
                  <VisibilityIcon />
                </IconButton>
                {/* <IconButton color="primary" size='sm'>
                  <EditIcon/>
                </IconButton> */}
                <IconButton color="danger" size='sm'>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                maxHeight: showDetails ? '100vh' : '0px',
                opacity: showDetails ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                bgcolor: 'background.surface',
                borderRadius: 'sm',
                p: showDetails ? 2 : 0,
              }}
            >
              <Typography>
                This is detailed information about the job.
              </Typography>
            </Box>
            <Divider />
          </Sheet>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
