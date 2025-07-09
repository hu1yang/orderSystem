import {styled, Tooltip, tooltipClasses, type TooltipProps} from "@mui/material";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'var(--vt-c-white)',
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: theme.typography.pxToRem(12),
        padding: 16,
        boxShadow: '0 8px 16px 0 rgba(15, 41, 77, .2)',

    },
    '.MuiTooltip-arrow':{
        color: 'var(--vt-c-white)',
    }
}));

export default HtmlTooltip;
