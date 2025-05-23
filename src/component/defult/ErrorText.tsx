import {memo} from "react";
import {FormHelperText} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const ErrorText = ({ message }: { message?: string }) => message ? (
    <FormHelperText>
        <HelpOutlineIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
        {message}
    </FormHelperText>
) : null;

export default memo(ErrorText)
