import * as React from "react";
import Box from "@mui/material/Box";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import Typography from "@mui/joy/Typography";
import Autocomplete from "@mui/joy/Autocomplete";
import Avatar from "@mui/joy/Avatar";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import RadioGroup from "@mui/joy/RadioGroup";
import Radio from "@mui/joy/Radio";
import Slider from "@mui/joy/Slider";
import Sheet from "@mui/joy/Sheet";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, { accordionDetailsClasses } from "@mui/joy/AccordionDetails";
import AccordionSummary, { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Breadcrumbs, Link } from "@mui/joy";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function Addjob() {
  const peopleData = [
    {
      name: "Andrew Smith",
      position: "UI Designer",
      avatar2x: "https://i.pravatar.cc/80?img=7",
      companyData: [
        {
          role: "Senior designer",
          name: "Dribbble",
          logo: "https://www.vectorlogo.zone/logos/dribbble/dribbble-icon.svg",
          years: "2015-now",
        },
        {
          role: "Designer",
          name: "Pinterest",
          logo: "https://www.vectorlogo.zone/logos/pinterest/pinterest-icon.svg",
          years: "2012-2015",
        },
      ],
      skills: ["UI design", "Illustration"],
    },
  ];

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
              md: "minmax(180px, 300px) minmax(600px, 1fr)",
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
            bgcolor: "background.level1",
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
            // height: '100dvh',
            gap: 2,
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
                Thêm việc làm
              </Typography>
            </Breadcrumbs>
          </Box>

          <Typography level="h3">
            Thêm bài đăng tuyển
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                md: "2fr 1fr",
              },
              flexWrap: 'wrap-reverse',
              gap: 2
            }}
          >
            <Box
              sx={[
                {
                  bgcolor: "background.surface",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 'sm',
                  p: 2,
                  boxShadow: 'md'
                },
              ]}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  level="title-lg"
                  textColor="text.secondary"
                  component="h1"
                >
                  Job
                </Typography>
                <Button startDecorator={<PersonRoundedIcon />} size="sm">
                  Add new
                </Button>
              </Box>

              <AccordionGroup
                sx={{
                  [`& .${accordionDetailsClasses.content}`]: {
                    px: 2,
                  },
                  [`& .${accordionSummaryClasses.button}`]: {
                    px: 2,
                  },
                }}
              >
                <Accordion defaultExpanded>
                  <AccordionSummary>
                    <Typography level="title-sm">Keywords</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ my: 2 }}>
                      <Autocomplete
                        size="sm"
                        placeholder="Position, skills, etc…"
                        options={[
                          {
                            category: "Position",
                            title: "Frontend engineer",
                          },
                          {
                            category: "Position",
                            title: "Backend engineer",
                          },
                          {
                            category: "Position",
                            title: "Product manager",
                          },
                          {
                            category: "Skill",
                            title: "JavaScript",
                          },
                          {
                            category: "Skill",
                            title: "TypeScript",
                          },
                          {
                            category: "Skill",
                            title: "Project management",
                          },
                        ]}
                        groupBy={(option) => option.category}
                        getOptionLabel={(option) => option.title}
                      />
                      <Box sx={{ my: 2, display: "flex", gap: 1 }}>
                        <Chip
                          variant="soft"
                          size="sm"
                          endDecorator={<ChipDelete variant="soft" />}
                        >
                          UI designer
                        </Chip>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary>
                    <Typography level="title-sm">Location</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ my: 2 }}>
                      <Autocomplete
                        size="sm"
                        placeholder="Country, city, etc…"
                        options={[
                          // some of Thailand provinces
                          "Bangkok",
                          "Amnat Charoen",
                          "Ang Thong",
                          "Bueng Kan",
                          "Buriram",
                          "Chachoengsao",
                          "Chai Nat",
                          "Chaiyaphum",
                          "Chanthaburi",
                          "Chiang Mai",
                          "Chiang Rai",
                          "Chonburi",
                        ]}
                      />
                      <Box sx={{ mt: 3, display: "flex", flexDirection: "column" }}>
                        <Typography level="title-sm">Range</Typography>
                        <Slider
                          size="sm"
                          variant="solid"
                          valueLabelFormat={(value) => `${value} km`}
                          defaultValue={6}
                          step={1}
                          min={0}
                          max={20}
                          valueLabelDisplay="on"
                        />
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary>
                    <Typography level="title-sm">Education</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ my: 2 }}>
                      <RadioGroup name="education" defaultValue="any">
                        <Radio label="Any" value="any" size="sm" />
                        <Radio label="High School" value="high-school" size="sm" />
                        <Radio label="College" value="college" size="sm" />
                        <Radio
                          label="Post-graduate"
                          value="post-graduate"
                          size="sm"
                        />
                      </RadioGroup>
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary>
                    <Typography level="title-sm">Years of Experience</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ my: 2 }}>
                      <Slider
                        size="sm"
                        valueLabelFormat={(value) => `${value} years`}
                        defaultValue={[5, 10]}
                        step={1}
                        min={0}
                        max={30}
                        valueLabelDisplay="on"
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary>
                    <Typography level="title-sm">Languages Spoken</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ my: 2 }}>
                      <Autocomplete
                        size="sm"
                        multiple
                        placeholder="Select languages"
                        options={[
                          "English",
                          "French",
                          "German",
                          "Portuguese",
                          "Spanish",
                        ]}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>
            </Box>
            <Box>
              {peopleData.map((person, index) => (
                <Sheet
                  key={index}
                  component="li"
                  sx={{ borderRadius: 'sm', 
                      p: 2, 
                      listStyle: 'none',
                      bgcolor: "background.surface",
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: 'md'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                      variant="outlined"
                      src={person.avatar2x}
                      srcSet={`${person.avatar2x} 2x`}
                      sx={{ borderRadius: '50%' }}
                    />
                    <div>
                      <Typography level="title-md">{person.name}</Typography>
                      <Typography level="body-xs">{person.position}</Typography>
                    </div>
                  </Box>
                  <Divider component="div" sx={{ my: 2 }} />
                  <List sx={{ '--ListItemDecorator-size': '40px', gap: 2 }}>
                    {person.companyData.map((company, companyIndex) => (
                      <ListItem key={companyIndex} sx={{ alignItems: 'flex-start' }}>
                        <ListItemDecorator
                          sx={{
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              height: '100%',
                              width: '1px',
                              bgcolor: 'divider',
                              left: 'calc(var(--ListItem-paddingLeft) + 12px)',
                              top: '50%',
                            },
                          }}
                        >
                          <Avatar
                            src={company.logo}
                            sx={{ '--Avatar-size': '24px' }}
                          />
                        </ListItemDecorator>
                        <ListItemContent>
                          <Typography level="title-sm">{company.role}</Typography>
                          <Typography level="body-xs">{company.name}</Typography>
                        </ListItemContent>
                        <Typography level="body-xs">{company.years}</Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    size="sm"
                    variant="plain"
                    endDecorator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
                    sx={{ px: 1, mt: 1 }}
                  >
                    Expand
                  </Button>
                  <Divider component="div" sx={{ my: 2 }} />
                  <Typography level="title-sm">Skills tags:</Typography>
                  <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                    {person.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        variant="outlined"
                        color="neutral"
                        size="sm"
                      >
                        {skill}
                      </Chip>
                    ))}
                  </Box>
                </Sheet>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
