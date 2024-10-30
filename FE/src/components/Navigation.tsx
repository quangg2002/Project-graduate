import { Fragment, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Chip from '@mui/joy/Chip';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Box, Typography } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: 'grid',
            transition: '0.2s ease',
            '& > *': {
              overflow: 'hidden',
            },
          },
          open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
        ]}
      >
        {children}
      </Box>
    </Fragment>
  );
}

export default function Navigation() {
  const { mode } = useColorScheme();
  const location = useLocation(); 

  const underlineStyle = {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: '1px',
      bottom: 0,
      left: 0,
      backgroundColor: mode === 'dark' ? 'white' : 'green',
      transition: 'width 0.3s ease, opacity 0.3s ease',
    },
    '&:hover::before': {
      width: '100%',
    },
  };

  return (
    <List
      size="sm"
      sx={{ '--ListItem-radius': 'var(--joy-radius-sm)', '--List-gap': '4px' }}
    >
      <ListItem nested>
        <ListSubheader>
          <Typography level="title-lg">Nhà tuyển dụng</Typography>
        </ListSubheader>
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton
              selected={location.pathname === '/overview'} 
              component="a"
              href="/overview"
              sx={underlineStyle}
            >
              <ListItemDecorator>
                <HomeRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent><Typography level="title-sm">Tổng quan</Typography></ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={location.pathname === '/company-info'} 
              component="a"
              href="/company-info"
              sx={underlineStyle}
            >
              <ListItemDecorator>
                <AssignmentIndRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Thông tin công ty</ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton sx={underlineStyle} onClick={() => setOpen(!open)} selected={['/listjob', '/addjob'].includes(location.pathname)} >
                  <AssignmentRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Tuyển dụng</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={[
                      open
                        ? {
                          transform: 'rotate(180deg)',
                        }
                        : {
                          transform: 'none',
                        },
                    ]}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton
                    component="a"
                    href="/listjob"
                    sx={underlineStyle}
                  >
                    Danh sách đăng tuyển</ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton
                    component="a"
                    href="/addjob"
                    sx={underlineStyle}
                  >Thêm bài đăng tuyển</ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={location.pathname === '/candidate'} 
              component="a"
              href="/candidate"
              sx={underlineStyle}
            >
              <ListItemDecorator>
                <PeopleRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Ứng viên</ListItemContent>
              <Chip variant="soft" color="primary" size="sm">
                2
              </Chip>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}
