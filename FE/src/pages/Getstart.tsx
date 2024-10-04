/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import Container from '@mui/joy/Container';
import ArrowForward from "@mui/icons-material/ArrowForward";
import Box from '@mui/joy/Box';
import { typographyClasses } from '@mui/joy/Typography';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useColorScheme, extendTheme, CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from "@mui/joy";


function ColorSchemeToggle(props: IconButtonProps) {
    const { onClick, ...other } = props;
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <IconButton
            aria-label="toggle light/dark mode"
            size="sm"
            variant="outlined"
            disabled={!mounted}
            onClick={(event) => {
                setMode(mode === 'light' ? 'dark' : 'light');
                onClick?.(event);
            }}
            sx={{
                position: 'fixed',
                zIndex: 999,
                top: '1rem',
                right: '1rem',
                borderRadius: '50%',
                boxShadow: 'sm',
            }}
            {...other}
        >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
    );
}

const customTheme = extendTheme();

export default function Getstart({
    reversed,
}: React.PropsWithChildren<{ reversed?: boolean }>) {
    
    return (
        <CssVarsProvider theme={customTheme} disableTransitionOnChange>
            <CssBaseline />
            <ColorSchemeToggle />
            <Container
                sx={[
                    (theme) => ({
                        position: 'relative',
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        [theme.breakpoints.up(834)]: {
                            flexDirection: 'row',
                            gap: 6,
                        },
                        [theme.breakpoints.up(1199)]: {
                            gap: 12,
                        },
                    }),
                    reversed ? { flexDirection: 'column-reverse' } : { flexDirection: 'column' },
                ]}
            >
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        maxWidth: '50ch',
                        textAlign: 'center',
                        flexShrink: 999,
                        [theme.breakpoints.up(834)]: {
                            minWidth: 420,
                            alignItems: 'flex-start',
                            textAlign: 'initial',
                        },
                        [`& .${typographyClasses.root}`]: {
                            textWrap: 'balance',
                        },
                    })}
                >
                    <Typography
                        level="h1"
                        sx={{
                            fontWeight: "xl",
                            fontSize: "clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)",
                        }}
                    >
                        A large headlinerer about our product features & services
                    </Typography>
                    <Typography
                        textColor="text.secondary"
                        sx={{ fontSize: "lg", lineHeight: "lg" }}
                    >
                        A descriptive secondary text placeholder. Use it to explain your
                        business offer better.
                    </Typography>
                    <Button
                        size="lg"
                        endDecorator={<ArrowForward />}
                        sx={{ mt: 2, mb: 1 }}
                    >
                        Get Started
                    </Button>
                    <Typography>
                        Already a member? <Link sx={{ fontWeight: "lg" }}>Sign in</Link>
                    </Typography>
                </Box>
                <AspectRatio
                    ratio={600 / 520}
                    variant="outlined"
                    maxHeight={300}
                    sx={(theme) => ({
                        minWidth: 300,
                        alignSelf: 'stretch',
                        [theme.breakpoints.up(834)]: {
                            alignSelf: 'initial',
                            flexGrow: 1,
                            '--AspectRatio-maxHeight': '520px',
                            '--AspectRatio-minHeight': '400px',
                        },
                        borderRadius: 'sm',
                        bgcolor: 'background.level2',
                        flexBasis: '50%',
                    })}
                >
                    <img
                        src="https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                        alt=""
                    />
                </AspectRatio>
            </Container>
        </CssVarsProvider>
    );
}
