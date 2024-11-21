import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useLocation } from 'react-router-dom';
import { Box, IconButton, Link, Tooltip, Typography } from '@mui/joy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const ViewPdf = () => {
    const location = useLocation();
    const pdfUrl = location.state?.pdfUrl;
    const navigate = useNavigate();

    if (!pdfUrl) {
        return <div>Không có PDF để hiển thị</div>;
    }
    return (
        <Box sx={{ bgcolor: '#F0F0F0' }}>
            <Tooltip title="Quay lại" color="primary" placement="right" variant={'plain'}>
                <Box
                    position={'fixed'}
                    top={15}
                    left={15}
                    onClick={() => navigate(-1)}
                >
                    <IconButton variant='solid'>
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
            </Tooltip>
            <Box
                width={'60%'}
                alignSelf={'center'}
                justifySelf={'center'}
            >
                <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js">
                    <Viewer fileUrl={pdfUrl} />
                </Worker>
            </Box>

            <Box
                position={'fixed'}
                top={15}
                right={15}
            >
                <Link href={`${pdfUrl}`} underline="always" color="primary">
                    <FileDownloadOutlinedIcon color='primary' />
                    Tải xuống
                </Link>
            </Box>
        </Box>
    )
};

export default ViewPdf;
