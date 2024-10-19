import Box from "@mui/material/Box";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Typography, Card, CardCover, CardContent, Link, Tooltip, IconButton, Breadcrumbs } from "@mui/joy";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';


export default function Overview() {
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
            }
          ]}
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
                  Tổng quan
                </Typography>
              </Breadcrumbs>
            </Box>
            <Box
            
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              <Card>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography level="title-sm">Tin tuyển dụng</Typography>
                  <Tooltip title="Thêm tin tuyển dụng" variant="outlined">
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      sx={{ alignSelf: "center" }}
                    >
                      <ControlPointIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography level="h3">10</Typography>
                <Link href="#variants" level="body-sm">Xem chi tiết <NavigateNextIcon /></Link>
              </Card>
              <Card>
                <Typography level="title-sm">Ứng viên nộp cv</Typography>
                <Typography level="h3">8</Typography>
                <Link href="#variants" level="body-sm">Xem chi tiết <NavigateNextIcon /></Link>
              </Card>
              <Card>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography level="title-sm">Tin tuyển dụng</Typography>
                  <Tooltip title="Thêm tin tuyển dụng" variant="outlined">
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      sx={{ alignSelf: "center" }}
                    >
                      <ControlPointIcon />
                    </IconButton>
                  </Tooltip>

                </Box>
                <Typography level="h3">10</Typography>
                <Link href="#variants" level="body-sm">Xem chi tiết <NavigateNextIcon /></Link>
              </Card>
              <Card>
                <CardCover>
                  <img
                    src="https://images.unsplash.com/photo-1542773998-9325f0a098d7?auto=format&fit=crop&w=320"
                    srcSet="https://images.unsplash.com/photo-1542773998-9325f0a098d7?auto=format&fit=crop&w=320&dpr=2 2x"
                    loading="lazy"
                    alt=""
                  />
                </CardCover>
                <CardCover
                  sx={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                  }}
                />
                <CardContent sx={{ justifyContent: "flex-end" }}>
                  <Typography level="title-md" textColor="#fff">
                    Company
                  </Typography>
                  <Typography
                    startDecorator={<LocationOnRoundedIcon />}
                    textColor="neutral.300"
                  >
                    Hà Nội, Việt Nam
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Typography level="h4">Bài viết mới</Typography>
            
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
