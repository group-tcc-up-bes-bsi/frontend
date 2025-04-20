"use client"
import { Link, LinkProps, Box } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

interface CustomLinkProps extends LinkProps {
    href: string;
    text: string;
    align?: 'left' | 'center' | 'right';
    marginTop?: number;
    marginBottom?: number;
    variant?: 'body1' | 'body2' | 'caption' | 'button' | 'overline' | 'inherit';
}

const CustomLink = ({
    href,
    text,
    align = 'center',
    marginTop = 3,
    marginBottom = 3,
    variant = 'body2',
    ...props
}: CustomLinkProps) => {
    const { theme } = useTheme();

    return (
        <Box
            sx={{
                textAlign: align,
                mt: marginTop,
                mb: marginBottom,
                '& a': {
                    color: theme.palette.text.primary,
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline'
                    }
                }
            }}
        >
            <Link href={href} variant={variant} {...props}>
                {text}
            </Link>
        </Box>
    );
};

export default CustomLink;