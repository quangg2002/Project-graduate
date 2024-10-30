import * as React from 'react';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import { keyframes } from '@mui/system';
import IconButton from '@mui/joy/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

export default function CustomAnimatedSnackbar() {
  const [open, setOpen] = React.useState(false);

  const animationDuration = 600;

  const handleClick = () => {
    setOpen(true);
  };

	const handleClose = (event: React.SyntheticEvent | null, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100vh'}}>
			<div style={{position: 'relative'}}>
      <Button variant="outlined" color="neutral" onClick={handleClick}>
        Show Snackbar
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
        open={open}				
        sx={{
          position: 'absolute', 
          left: '105%', 
          top: 0, 
          animation: `${open ? inAnimation : outAnimation} ${animationDuration}ms forwards`,
        }}
      >
        I love this animation!
				<IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ ml: 1 }} // Thêm khoảng cách bên trái
            >
              <CloseIcon fontSize="small" />
            </IconButton>
      </Snackbar>
			</div>
    </div>
  );
}
