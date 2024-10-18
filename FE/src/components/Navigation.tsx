import Chip from '@mui/joy/Chip';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { Box, Typography } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';

export default function Navigation() {
  const {mode} = useColorScheme();

  const underlineStyle = {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: '1px',
      bottom: 0,
      left: 0,
      backgroundColor: mode === 'dark' ? 'white' : 'green', // Dynamic color
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
          aria-labelledby="nav-list-browse"
          sx={{
            '& .JoyListItemButton-root': { p: '8px' },

          }}
        >
          <ListItem>
            <ListItemButton sx={underlineStyle} selected>
              <ListItemDecorator>
                <PeopleRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent><Typography level="title-sm">Tổng quan</Typography></ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton sx={underlineStyle}>
              <ListItemDecorator>
                <AssignmentIndRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Thông tin công ty</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton sx={underlineStyle}>
              <ListItemDecorator>
                <AccountTreeRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Danh sách công việc</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton sx={underlineStyle}>
              <ListItemDecorator>
                <TodayRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Ứng viên</ListItemContent>
              <Chip variant="soft" color="primary" size="sm">
                2
              </Chip>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton sx={underlineStyle}>
              <ListItemDecorator>
                <ArticleRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Policies</ListItemContent>
              <Chip variant="soft" color="warning" size="sm">
                2
              </Chip>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}