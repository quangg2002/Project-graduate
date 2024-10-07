import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

const headerSX = {
    '& .MuiCardHeader-action': { m: '0px', alignSelf: 'center' }
};

function MainCard(
    {
        border = true,
        boxShadow,
        children,
        content = true,
        contentSX = {},
        darkTitle,
        elevation,
        secondary,
        shadow,
        sx = {},
        title,
        ...others
    },
    ref
) {
    const theme = useTheme();
    boxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Card
            elevation={elevation || 0}
            ref={ref}
            {...others}
            sx={{
                border: border ? '1px solid' : 'none',
                borderRadius: 2,
                borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey.A800,
                ':hover': {
                    boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit'
                },
                '& pre': {
                    m: 0,
                    // p: '16px !important',
                    fontFamily: theme.typography.fontFamily,
                    fontSize: '0.7rem'
                },  
                ...sx
            }}
        >
            {title && <CardHeader sx={headerSX} title={<Typography sx={{ fontSize: matchesXs ? '0.7rem' : '0.875rem' }}>{title}</Typography>} action={secondary} />}
            {content && <CardContent sx={contentSX}>{children}</CardContent>}
            {!content && children}
        </Card>
    );
}

export default forwardRef(MainCard);

MainCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    children: PropTypes.node,
    subheader: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    content: PropTypes.bool,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    divider: PropTypes.bool,
    elevation: PropTypes.number,
    secondary: PropTypes.any,
    shadow: PropTypes.string,
    sx: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    modal: PropTypes.bool,
    others: PropTypes.any
};