import { Box, Card, CardContent, CardCover, Grid, Stack, Typography } from "@mui/joy";
import CircleIcon from '@mui/icons-material/Circle';
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { useState, useEffect } from "react";
import { getListCv } from '../../services/cvApi';

const cvSx = {
    border: '1px solid #000',
    transition: 'border 0.3s, box-shadow 0.3s',
    '&:hover': {
        borderColor: '#00B14F',
        boxShadow: '0 2px 3px #00B14F',
        '& .hover-text': {
            color: '#00B14F',
        },
    },
    minHeight: '280px'
}
interface CvListResponse {
    cvId: number;
    cvName: string;
    cvUpdate: string;
}

export default function Cv() {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [listCv, setListCv] = useState<CvListResponse[]>([]);

    useEffect(() => {
        const fetchListCvData = async () => {
            try {
                dispatch(startLoading)
                const action = await dispatch(getListCv());
                dispatch(stopLoading)
                if (getListCv.fulfilled.match(action)) {
                    const response = action.payload.response?.data;
                    if (response)
                        setListCv(response)
                }
            } catch (error) {
                console.error('Failed to fetch company data:', error);
            } finally {
                console.log("listCv" + listCv)
            }
        };

        fetchListCvData();
    }, [dispatch]);

    return (
        <Box bgcolor={'#f4f5f5'} minHeight={'100vh'}>
            <Header />
            <Stack mt={4} mx={15}>
                <Stack>
                    <Typography level="h3">Danh sách mẫu CV xin việc</Typography>
                    <Typography>Các mẫu CV được thiết kế chuẩn theo từng ngành nghề.</Typography>
                    <Typography>Phù hợp với cả sinh viên và người đi làm.</Typography>
                </Stack>
                <Stack direction={'row'} mt={5} gap={3}>
                    <Stack flex={1}>
                        <Card
                            onClick={() => navigate('/layout1')}
                            variant="outlined"
                            sx={cvSx}
                        >
                            <CardCover>
                                <img src={require("../../assets/images/cv1.png")} />
                            </CardCover>
                            <CardCover
                                sx={{
                                    background:
                                        'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                                }}
                            />
                            <CardContent sx={{ justifyContent: 'flex-end' }}>
                                {listCv.find(cv => cv.cvId === 1) ? (
                                    <>
                                        <Typography level="title-lg" textColor="#fff" endDecorator={<CircleIcon color="success" sx={{ fontSize: '10px' }} />}>
                                            {listCv.find(cv => cv.cvId === 1)?.cvName ? listCv.find(cv => cv.cvId === 1)?.cvName : "CV chưa đặt tên"}
                                        </Typography>
                                        <Typography textColor="neutral.300">
                                            Cập nhật lần cuối: {listCv.find(cv => cv.cvId === 1)?.cvUpdate.substring(0, 10)}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography level="title-lg" textColor="#fff" endDecorator={<CircleIcon sx={{ fontSize: '10px' }} />}>CV chưa đặt tên</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                    <Stack flex={1}>
                        <Card
                            onClick={() => navigate('/layout2')}
                            variant="outlined"
                            sx={cvSx}
                        >
                            <CardCover>
                                <img src={require("../../assets/images/cv2.jpg")} />
                            </CardCover>
                            <CardCover
                                sx={{
                                    background:
                                        'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                                }}
                            />
                            <CardContent sx={{ justifyContent: 'flex-end' }}>
                                {listCv.find(cv => cv.cvId === 2) ? (
                                    <>
                                        <Typography level="title-lg" textColor="#fff" endDecorator={<CircleIcon color="success" sx={{ fontSize: '10px' }} />}>
                                            {listCv.find(cv => cv.cvId === 2)?.cvName ? listCv.find(cv => cv.cvId === 2)?.cvName : "CV chưa đặt tên"}
                                        </Typography>
                                        <Typography textColor="neutral.300">
                                            Cập nhật lần cuối: {listCv.find(cv => cv.cvId === 2)?.cvUpdate.substring(0, 10)}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography level="title-lg" textColor="#fff" endDecorator={<CircleIcon sx={{ fontSize: '10px' }} />}>CV chưa đặt tên</Typography>

                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                    <Stack flex={1}></Stack>
                    <Stack flex={1}></Stack>
                    <Stack flex={1}></Stack>
                </Stack>
            </Stack>
        </Box>
    )
}