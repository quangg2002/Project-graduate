import React from 'react';
import { Box, Typography, Chip, Button, IconButton, Card, CardContent } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const JobCard = () => {
  return (
    <Card variant="outlined" sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2 }}>
      <Box sx={{ flexShrink: 0 }}>
        <img src="https://example.com/logo.png" alt="Company Logo" style={{ width: 64, height: 64 }} />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography level="title-md" component="div">
          Account Manager - Tiếng Hàn, Từ 2 Năm Kinh Nghiệm
          <Chip
            variant="soft"
            color="success"
            size="sm"
            startDecorator={<CheckCircleIcon />}
            sx={{ ml: 1 }}
          >
            Thỏa thuận
          </Chip>
        </Typography>
        <Typography level="body-sm" color="neutral">
          Công Ty Cổ Phần Công Nghệ VMO Holdings
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip
            variant="outlined"
            size="sm"
            startDecorator={<LocationOnIcon />}
            sx={{ borderRadius: 'sm' }}
          >
            Hà Nội
          </Chip>
          <Chip variant="soft" size="sm" sx={{ borderRadius: 'sm' }}>
            Còn 41 ngày để ứng tuyển
          </Chip>
        </Box>
      </CardContent>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button variant="solid" color="success" size="sm">
          Ứng tuyển
        </Button>
        <IconButton variant="outlined" color="neutral" size="sm">
          <FavoriteBorderIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default JobCard;
