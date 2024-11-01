import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";

import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import TeamNav from './Navigation'
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import backgroundImg from '../assets/images/bg1.png';

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <Tooltip title="Change theme" variant="outlined">
      <IconButton
        data-screenshot="toggle-mode"
        size="sm"
        variant="plain"
        color="neutral"
        sx={{ alignSelf: "center" }}
        onClick={() => {
          if (mode === "light") {
            setMode("dark");
          } else {
            setMode("light");
          }
        }}
      >
        {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default function Header() {
  const [open, setOpen] = React.useState(false);
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Stack
        id="tab-bar"
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'space-around',
          display: { xs: 'flex', sm: 'none' },
          zIndex: '999',
          bottom: 0,
          position: 'fixed',
          width: '100dvw',
          py: 2,
          backgroundColor: 'background.body',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/joy-ui/getting-started/templates/email/"
          size="sm"
          startDecorator={<EmailRoundedIcon />}
          sx={{ flexDirection: 'column', '--Button-gap': 0 }}
        >
          Email
        </Button>
        <Button
          variant="plain"
          color="neutral"
          aria-pressed="true"
          component="a"
          href="/joy-ui/getting-started/templates/team/"
          size="sm"
          startDecorator={<PeopleAltRoundedIcon />}
          sx={{ flexDirection: 'column', '--Button-gap': 0 }}
        >
          Team
        </Button>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/joy-ui/getting-started/templates/files/"
          size="sm"
          startDecorator={<FolderRoundedIcon />}
          sx={{ flexDirection: 'column', '--Button-gap': 0 }}
        >
          Files
        </Button>
      </Stack>
      <Box
        component="header"
        className="Header"
        sx={[
          {
            p: 2,
            gap: 2,
            // backgroundImage: `url(${backgroundImg})`, 
            bgcolor: "background.body",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gridColumn: "1 / -1",
            borderBottom: "1px solid",
            borderColor: "divider",
            position: "sticky",
            top: 0,
            zIndex: 1100,
          },
        ]}
      >
        <Box
          sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: { xs: "none", sm: "flex" },
            }}
          >
            <img
              src={require("../assets/images/logocompany.png")}
              style={{
                width: "35px",
                height: "auto",
                marginLeft: 10,
                marginRight: 5,
              }}
              alt="My Image"
            />
            <Button
              variant="plain"
              color="neutral"
              aria-pressed="true"
              component="a"
              href="/"
              size="sm"
              sx={{ alignSelf: "center" }}
            >
              Việc làm
            </Button>
            <Button
              variant="plain"
              color="neutral"
              component="a"
              href="/"
              size="sm"
              sx={{ alignSelf: "center" }}
            >
              Hồ sơ CV
            </Button>
            <Button
              variant="plain"
              color="neutral"
              component="a"
              href="/"
              size="sm"
              sx={{ alignSelf: "center" }}
            >
              Công ty
            </Button>
          </Stack>
          <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
            <IconButton
              variant="plain"
              color="neutral"
              onClick={() => setOpen(true)}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Drawer
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
              open={open}
              onClose={() => setOpen(false)}
            >
              <ModalClose />
              <DialogTitle></DialogTitle>
              <Box sx={{ p: 1, pt: 2 }}>
                <TeamNav />
              </Box>
            </Drawer>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Dropdown>
              <MenuButton
                variant="plain"
                size="sm"
                sx={{
                  maxWidth: "32px",
                  maxHeight: "32px",
                  borderRadius: "9999999px",
                }}
              >
                <Tooltip title="Tin nhắn" variant="outlined">
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    sx={{ alignSelf: "center" }}
                  >
                    <ChatBubbleIcon />
                  </IconButton>
                </Tooltip>
              </MenuButton>
            </Dropdown>
            {/* <ColorSchemeToggle /> */}
            <Dropdown>
              <MenuButton
                variant="plain"
                size="sm"
                sx={{
                  maxWidth: "32px",
                  maxHeight: "32px",
                  borderRadius: "9999999px",
                }}
              >
                <Avatar
                  src="https://i.pravatar.cc/40?img=2"
                  srcSet="https://i.pravatar.cc/80?img=2"
                  sx={{ maxWidth: "32px", maxHeight: "32px" }}
                />
              </MenuButton>
              <Menu
                placement="bottom-end"
                size="sm"
                sx={{
                  zIndex: "99999",
                  p: 1,
                  gap: 1,
                  "--ListItem-radius": "var(--joy-radius-sm)",
                }}
              >
                <MenuItem>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src="https://i.pravatar.cc/40?img=2"
                      srcSet="https://i.pravatar.cc/80?img=2"
                      sx={{ borderRadius: "50%" }}
                    />
                    <Box sx={{ ml: 1.5 }}>
                      <Typography level="title-sm" textColor="text.primary">
                        Rick Sanchez
                      </Typography>
                      <Typography level="body-xs" textColor="text.tertiary">
                        rick@email.com
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <ListDivider />
                <MenuItem>
                  <HelpRoundedIcon />
                  Help
                </MenuItem>
                <MenuItem>
                  <SettingsRoundedIcon />
                  Settings
                </MenuItem>
                <ListDivider />
                <MenuItem component="a" href="/blog/first-look-at-joy/">
                  First look at Joy UI
                  <OpenInNewRoundedIcon />
                </MenuItem>
                <MenuItem
                  component="a"
                  href="https://github.com/mui/material-ui/tree/master/docs/data/joy/getting-started/templates/email"
                >
                  Sourcecode
                  <OpenInNewRoundedIcon />
                </MenuItem>
                <ListDivider />
                <MenuItem>
                  <LogoutRoundedIcon />
                  Log out
                </MenuItem>
              </Menu>
            </Dropdown>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
