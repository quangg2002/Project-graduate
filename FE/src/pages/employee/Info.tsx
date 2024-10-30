import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Box, Breadcrumbs, Card, CardContent, CardCover, CssBaseline, CssVarsProvider, Link, Stack, Typography } from "@mui/joy";
import Header from "../../components/Header";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function Info() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setFileName(file.name);  // Lưu tên file
        setPreviewUrl(URL.createObjectURL(file)); // Tạo URL cho hình ảnh
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header />

            <Stack mx={5} my={3}>
                <Box display={'flex'} alignItems={'center'}>
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
                    component="main"
                    className="MainContent"
                    sx={{
                        bgcolor: "#1234",
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(64px, 200px) minmax(450px, 1fr)",
                            md: "minmax(180px, 300px) minmax(500px, 1fr)",
                        },
                        gap: 8
                    }}
                >
                    <Box>
                        <Box {...getRootProps()} style={{ position: 'relative' }}>
                            <Card sx={{ height: '200px', borderRadius: 0 }}>
                                <input {...getInputProps()} />
                                <CardCover>
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <Typography level="body-md" textAlign={'center'}>Kéo thả hình ảnh vào đây hoặc click để chọn file</Typography>
                                    )}
                                </CardCover>
                            </Card>
                            {previewUrl &&
                                <Box
                                    sx={{
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0)), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                                        padding: 2,
                                        width: '100%'
                                    }}
                                    position={'absolute'}
                                    bottom={0}
                                >
                                    <Typography level="body-md" textAlign={'center'} sx={{ color: '#FFF' }}>
                                        Thay đổi hình ảnh
                                    </Typography>
                                </Box>
                            }
                        </Box>
                        <Typography level="title-md">Work Link</Typography>
                        <Typography level="title-md">Skin</Typography>
                    </Box>
                    <Box>
                        <Typography level="h3">Ngô Minh Quang</Typography>
                    </Box>
                </Box>
            </Stack>
        </CssVarsProvider>
    );
}
