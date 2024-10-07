// import { useRef, useState } from 'react';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import {
//     Avatar, Badge, ClickAwayListener, Divider, IconButton, List, ListItemButton,
//     ListItemAvatar, ListItemText, ListItemSecondaryAction, Paper, Popper, Tooltip, Typography, Box
// } from '@mui/material';

// import MainCard from '../components/MainCard';
// import Transitions from '../components/@extended/Transitions';
// import { BellOutlined, CheckCircleOutlined, GiftOutlined } from '@ant-design/icons';

// const avatarSX = { width: 36, height: 36, fontSize: '1rem' };
// const actionSX = { mt: '6px', ml: 1, top: 'auto', right: 'auto', alignSelf: 'flex-start', transform: 'none' };

// export default function Notification() {
//     const theme = useTheme();
//     const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

//     const anchorRef = useRef<HTMLButtonElement | null>(null);
//     const [read, setRead] = useState(6);
//     const [open, setOpen] = useState(false);

//     const handleToggle = () => {
//         setOpen((prevOpen) => !prevOpen);
//     };

//     const handleClose = (event: MouseEvent | TouchEvent) => {
//         if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
//             return;
//         }
//         setOpen(false);
//     };

//     return (
//         <Box sx={{ flexShrink: 0, ml: 0.75 }}>
//             <IconButton
//                 color="secondary"
//                 sx={{ color: 'text.primary', bgcolor: open ? 'grey' : 'transparent' }}
//                 aria-label="open profile"
//                 ref={anchorRef}
//                 aria-controls={open ? 'profile-grow' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleToggle}
//             >
//                 <Badge badgeContent={read} color="primary">
//                     <BellOutlined />
//                 </Badge>
//             </IconButton>
//             <Popper
//                 placement={matchesXs ? 'bottom' : 'bottom-end'}
//                 open={open}
//                 anchorEl={anchorRef.current}
//                 role={undefined}
//                 transition
//                 disablePortal
//                 popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
//             >
//                 {({ TransitionProps }) => (
//                     <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
//                         <Paper sx={{ boxShadow: '0px 2px 8px', width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
//                             <ClickAwayListener onClickAway={handleClose}>
//                                 <MainCard
//                                     title="Notification"
//                                     elevation={0}
//                                     border={false}
//                                     content={false}
//                                     secondary={
//                                         read > 0 && (
//                                             <Tooltip title="Mark as all read">
//                                                 <IconButton color="success" size="small" onClick={() => setRead(0)}>
//                                                     <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
//                                                 </IconButton>
//                                             </Tooltip>
//                                         )
//                                     }
//                                 >
//                                     <List
//                                         component="nav"
//                                         sx={{
//                                             p: 0,
//                                             '& .MuiListItemButton-root': {
//                                                 py: 0.5,
//                                                 '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
//                                                 '& .MuiAvatar-root': avatarSX,
//                                                 '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
//                                             }
//                                         }}
//                                     >
//                                         <ListItemButton selected={read > 0}>
//                                             <ListItemAvatar>
//                                                 <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
//                                                     <GiftOutlined />
//                                                 </Avatar>
//                                             </ListItemAvatar>
//                                             <ListItemText
//                                                 primary={
//                                                     <Typography variant="body2" sx={{ fontSize: matchesXs ? '0.7rem' : '0.875rem' }}>
//                                                         It's acc birthday today.
//                                                     </Typography>
//                                                 }
//                                                 secondary={
//                                                     <Typography variant="caption" sx={{ fontSize: matchesXs ? '0.75rem' : '0.75rem' }}>
//                                                         2 min ago
//                                                     </Typography>
//                                                 }
//                                             />
//                                             <ListItemSecondaryAction>
//                                                 <Typography variant="caption" noWrap sx={{ fontSize: matchesXs ? '0.75rem' : '0.75rem' }}>
//                                                     3:00 AM
//                                                 </Typography>
//                                             </ListItemSecondaryAction>
//                                         </ListItemButton>
//                                         <Divider />
//                                         <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
//                                             <ListItemText
//                                                 primary={
//                                                     <Typography color="primary" sx={{ fontSize: matchesXs ? '0.75rem' : '0.875rem' }}>
//                                                         View All
//                                                     </Typography>
//                                                 }
//                                             />
//                                         </ListItemButton>
//                                     </List>
//                                 </MainCard>
//                             </ClickAwayListener>
//                         </Paper>
//                     </Transitions>
//                 )}
//             </Popper>
//         </Box>
//     );
// }
export {}