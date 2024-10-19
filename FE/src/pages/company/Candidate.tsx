import React, { useState } from 'react';
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Typography, IconButton, Input, Box, Button } from "@mui/joy";

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Divider from '@mui/joy/Divider';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Link from '@mui/joy/Link';
import Chip from '@mui/joy/Chip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Checkbox from '@mui/joy/Checkbox';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import Breadcrumbs from '@mui/joy/Breadcrumbs';

const listItems = [
  {
    id: 'INV-1234',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1233',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1232',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1231',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1230',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1229',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
  },
];

const rows = [
  {
    id: 'INV-1234',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1233',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1232',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1231',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1230',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1229',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
  },
  {
    id: 'INV-1228',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'K',
      name: 'Krystal Stevens',
      email: 'k.stevens@email.com',
    },
  },
  {
    id: 'INV-1227',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Sachin Flynn',
      email: 's.flyn@email.com',
    },
  },
  {
    id: 'INV-1226',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'B',
      name: 'Bradley Rosales',
      email: 'brad123@email.com',
    },
  },
  {
    id: 'INV-1225',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1224',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1223',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1221',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1220',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1219',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
  },
  {
    id: 'INV-1218',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'K',
      name: 'Krystal Stevens',
      email: 'k.stevens@email.com',
    },
  },
  {
    id: 'INV-1217',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Sachin Flynn',
      email: 's.flyn@email.com',
    },
  },
  {
    id: 'INV-1216',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'B',
      name: 'Bradley Rosales',
      email: 'brad123@email.com',
    },
  },
];
type Order = 'asc' | 'desc';


function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key | string,
): (
  a: { [key: string]: any },
  b: { [key: string]: any },
) => number {
  return order === 'desc'
    ? (a, b) => -descendingComparator(a, b, orderBy)
    : (a, b) => descendingComparator(a, b, orderBy);
}

function descendingComparator<Key extends keyof any>(
  a: { [key: string]: any },
  b: { [key: string]: any },
  orderBy: Key | string,
) {
  const keys = (orderBy as string).split('.');

  const aValue = keys.reduce((obj, key) => obj?.[key], a);
  const bValue = keys.reduce((obj, key) => obj?.[key], b);

  if (aValue < bValue) {
    return -1;
  }
  if (aValue > bValue) {
    return 1;
  }
  return 0;
}

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// type Order = 'asc' | 'desc';

// function getComparator<Key extends keyof any>(
//   order: Order,
//   orderBy: Key,
// ): (
//   a: { [key in Key]: number | string },
//   b: { [key in Key]: number | string },
// ) => number {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

export default function Candidate() {

  const [order, setOrder] = useState<Order>('desc');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header />
      <Box
        sx={[
          {
            bgcolor: "background.appBody",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(64px, 200px) minmax(450px, 1fr)",
              md: "minmax(180px, 300px) minmax(500px, 1fr)",
            },
          },
        ]}
      >
        <Box
          component="nav"
          sx={[
            {
              p: 2,
              bgcolor: "background.surface",
              borderRight: "1px solid",
              borderColor: "divider",
              display: {
                xs: "none",
                sm: "inherit",
              },
              top: 68,
              left: 0,
              position: "sticky",
              height: "89vh",
              zIndex: 1000,
            },
          ]}
        >
          <Navigation />
        </Box>
        <Box
          component="main"
          className="MainContent"
          sx={{
            bgcolor: "background.appBody",
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            sx={{
              display: 'flex',
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h3" component="h1">
              Ứng viên
            </Typography>
            <Button
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              Download PDF
            </Button>
          </Box>
          <Sheet
            className="SearchAndFilters-mobile"
            sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
          >
            <Input
              size="sm"
              placeholder="Search"
              startDecorator={<SearchIcon />}
              sx={{ flexGrow: 1 }}
            />
            <IconButton
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(true)}
            >
              <FilterAltIcon />
            </IconButton>
            <Modal open={open} onClose={() => setOpen(false)}>
              <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                <ModalClose />
                <Typography id="filter-modal" level="h2">
                  Filters
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl size="sm">
                    <FormLabel>Status</FormLabel>
                    <Select
                      size="sm"
                      placeholder="Filter by status"
                      slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                    >
                      <Option value="paid">Paid</Option>
                      <Option value="pending">Pending</Option>
                      <Option value="refunded">Refunded</Option>
                      <Option value="cancelled">Cancelled</Option>
                    </Select>
                  </FormControl>
                  <FormControl size="sm">
                    <FormLabel>Category</FormLabel>
                    <Select size="sm" placeholder="All">
                      <Option value="all">All</Option>
                      <Option value="refund">Refund</Option>
                      <Option value="purchase">Purchase</Option>
                      <Option value="debit">Debit</Option>
                    </Select>
                  </FormControl>
                  <FormControl size="sm">
                    <FormLabel>Customer</FormLabel>
                    <Select size="sm" placeholder="All">
                      <Option value="all">All</Option>
                      <Option value="olivia">Olivia Rhye</Option>
                      <Option value="steve">Steve Hampton</Option>
                      <Option value="ciaran">Ciaran Murray</Option>
                      <Option value="marina">Marina Macdonald</Option>
                      <Option value="charles">Charles Fulton</Option>
                      <Option value="jay">Jay Hoper</Option>
                    </Select>
                  </FormControl>
                  <Button color="primary" onClick={() => setOpen(false)}>
                    Submit
                  </Button>
                </Sheet>
              </ModalDialog>
            </Modal>
          </Sheet>
          <Box
            className="SearchAndFilters-tabletUp"
            sx={{
              borderRadius: 'sm',
              py: 2,
              display: { xs: 'none', sm: 'flex' },
              flexWrap: 'wrap',
              gap: 1.5,
              '& > *': {
                minWidth: { xs: '120px', md: '160px' },
              },
            }}
          >
            <FormControl sx={{ flex: 1 }} size="sm">
              <FormLabel>Search for customer</FormLabel>
              <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} />
            </FormControl>
            <FormControl size="sm">
              <FormLabel>Status</FormLabel>
              <Select
                size="sm"
                placeholder="Filter by status"
                slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
              >
                <Option value="paid">All</Option>
                <Option value="pending">Pending</Option>
                <Option value="refunded">Refunded</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </FormControl>
            <FormControl size="sm">
              <FormLabel>Category</FormLabel>
              <Select size="sm" placeholder="All">
                <Option value="all">All</Option>
                <Option value="refund">Refund</Option>
                <Option value="purchase">Purchase</Option>
                <Option value="debit">Debit</Option>
              </Select>
            </FormControl>
            <FormControl size="sm">
              <FormLabel>Tìm kiếm</FormLabel>
              <Button size='sm'>Tìm kiếm</Button>
            </FormControl>
          </Box>
          <Sheet
            className="OrderTableContainer"
            variant="outlined"
            sx={{
              display: { xs: 'none', sm: 'initial' },
              width: '100%',
              borderRadius: 'sm',
              flexShrink: 1,
              overflow: 'auto',
              minHeight: 0,
            }}
          >
            <Table
              aria-labelledby="tableTitle"
              stickyHeader
              hoverRow
              sx={{
                '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                '--Table-headerUnderlineThickness': '1px',
                '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                '--TableCell-paddingY': '4px',
                '--TableCell-paddingX': '8px',
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                    <Checkbox
                      size="sm"
                      indeterminate={
                        selected.length > 0 && selected.length !== rows.length
                      }
                      checked={selected.length === rows.length}
                      onChange={(event) => {
                        setSelected(
                          event.target.checked ? rows.map((row) => row.id) : [],
                        );
                      }}
                      color={
                        selected.length > 0 || selected.length === rows.length
                          ? 'primary'
                          : undefined
                      }
                      sx={{ verticalAlign: 'text-bottom' }}
                    />
                  </th>
                  <th style={{ width: 120, padding: '12px 6px' }}>
                    Mã ứng viên
                  </th>
                  <th style={{ width: 240, padding: '12px 6px' }}>
                    <Link
                      underline="none"
                      color="primary"
                      component="button"
                      onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                      endDecorator={<ArrowDropDownIcon />}
                      sx={[
                        {
                          fontWeight: 'lg',
                          '& svg': {
                            transition: '0.2s',
                            transform:
                              order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                          },
                        },
                        order === 'desc'
                          ? { '& svg': { transform: 'rotate(0deg)' } }
                          : { '& svg': { transform: 'rotate(180deg)' } },
                      ]}
                    >
                      Ứng viên
                    </Link>
                  </th>
                  <th style={{ width: 140, padding: '12px 6px' }}>Status</th>
                  <th style={{ width: 140, padding: '12px 6px' }}>Date</th>
                  <th style={{ width: 140, padding: '12px 6px' }}> </th>
                </tr>
              </thead>
              <tbody>
                {[...rows].sort(getComparator(order, 'customer.name')).map((row) => (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', width: 120 }}>
                      <Checkbox
                        size="sm"
                        checked={selected.includes(row.id)}
                        color={selected.includes(row.id) ? 'primary' : undefined}
                        onChange={(event) => {
                          setSelected((ids) =>
                            event.target.checked
                              ? ids.concat(row.id)
                              : ids.filter((itemId) => itemId !== row.id),
                          );
                        }}
                        slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                        sx={{ verticalAlign: 'text-bottom' }}
                      />
                    </td>
                    <td>
                      <Typography level="body-xs">{row.id}</Typography>
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar size="sm">{row.customer.name.substring(0, 1)}</Avatar>
                        <div>
                          <Typography level="body-xs">{row.customer.name}</Typography>
                          <Typography level="body-xs">{row.customer.email}</Typography>
                        </div>
                      </Box>

                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        size="sm"
                        startDecorator={
                          {
                            Paid: <CheckRoundedIcon />,
                            Refunded: <AutorenewRoundedIcon />,
                            Cancelled: <BlockIcon />,
                          }[row.status]
                        }
                        color={
                          {
                            Paid: 'success',
                            Refunded: 'neutral',
                            Cancelled: 'danger',
                          }[row.status] as ColorPaletteProp
                        }
                      >
                        {row.status}
                      </Chip>
                    </td>
                    <td>
                      <Typography level="body-xs">{row.date}</Typography>
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Link level="body-xs" component="button">
                          Download
                        </Link>
                        <Dropdown>
                          <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                          >
                            <MoreHorizRoundedIcon />
                          </MenuButton>
                          <Menu size="sm" sx={{ minWidth: 140 }}>
                            <MenuItem>Edit</MenuItem>
                            <MenuItem>Rename</MenuItem>
                            <MenuItem>Move</MenuItem>
                            <Divider />
                            <MenuItem color="danger">Delete</MenuItem>
                          </Menu>
                        </Dropdown>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>

          <Box sx={{ display: { xs: 'block', sm: 'none'}, pb: 7 }}>
            {listItems.map((listItem) => (
              <List key={listItem.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
                <ListItem
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                  }}
                >
                  <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                    <ListItemDecorator>
                      <Avatar size="sm">{listItem.customer.initial}</Avatar>
                    </ListItemDecorator>
                    <div>
                      <Typography gutterBottom sx={{ fontWeight: 600 }}>
                        {listItem.customer.name}
                      </Typography>
                      <Typography level="body-xs" gutterBottom>
                        {listItem.customer.email}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <Typography level="body-xs">{listItem.date}</Typography>
                        <Typography level="body-xs">&bull;</Typography>
                        <Typography level="body-xs">{listItem.id}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Link level="body-sm" component="button">
                          Download
                        </Link>
                        <Dropdown>
                          <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                          >
                            <MoreHorizRoundedIcon />
                          </MenuButton>
                          <Menu size="sm" sx={{ minWidth: 140 }}>
                            <MenuItem>Edit</MenuItem>
                            <MenuItem>Rename</MenuItem>
                            <MenuItem>Move</MenuItem>
                            <Divider />
                            <MenuItem color="danger">Delete</MenuItem>
                          </Menu>
                        </Dropdown>
                      </Box>
                    </div>
                  </ListItemContent>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Paid: <CheckRoundedIcon />,
                        Refunded: <AutorenewRoundedIcon />,
                        Cancelled: <BlockIcon />,
                      }[listItem.status]
                    }
                    color={
                      {
                        Paid: 'success',
                        Refunded: 'neutral',
                        Cancelled: 'danger',
                      }[listItem.status] as ColorPaletteProp
                    }
                  >
                    {listItem.status}
                  </Chip>
                </ListItem>
                <ListDivider />
              </List>
            ))}
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
