import * as React from 'react';
import { Box, Typography, Avatar, IconButton, Badge, Menu, MenuItem, ListItemDecorator } from '@mui/joy';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GiftIcon from '@mui/icons-material/CardGiftcard';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import { Avatar as AvatarMaterial } from '@mui/material';
import GiftOutlined from '@ant-design/icons/GiftOutlined';

// Data mẫu cho thông báo
const notifications = [
  { id: 1, icon: <GiftIcon />, title: "It's Cristina Danny's birthday today.", time: '3:00 AM', details: '2 min ago', color: 'success' },
  { id: 2, icon: <CommentIcon />, title: 'Aida Burg commented your post.', time: '6:00 PM', details: '5 August', color: 'primary' },
  { id: 3, icon: <PersonIcon />, title: 'Your Profile is Complete 60%', time: '2:45 PM', details: '7 hours ago', color: 'danger' },
  { id: 4, icon: <EventIcon />, title: 'Cristina Danny invited to join Meeting.', time: '9:10 PM', details: 'Daily scrum meeting time', color: 'info' },
];

export default function Notification() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event : any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {/* Icon button với badge thông báo */}
      <IconButton onClick={handleClick}>
        <Badge badgeContent={2} color="primary">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Menu thông báo */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        placement="bottom-end"
        sx={{ width: 400 }}
      >
        {notifications.map((notif) => (
          <MenuItem key={notif.id} onClick={handleClose} sx={{ alignItems: 'flex-start', gap: 1.5 }}>
            <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
            <AvatarMaterial sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                          <GiftOutlined />
                        </AvatarMaterial>
            </ListItemDecorator>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight="md" sx={{ fontSize: '14px' }}>
                  {notif.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
                  {notif.time}
                </Typography>
              </Box>
              <Typography level="body-md" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                {notif.details}
              </Typography>
            </Box>
          </MenuItem>
        ))}

        <MenuItem onClick={handleClose} sx={{ justifyContent: 'center' }}>
          <Typography color="primary" fontWeight="bold">
            View All
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
