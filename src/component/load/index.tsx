import styles from './styles.module.less'
import {Typography} from "@mui/material";
import loadingFly from '@/assets/loading-fly.gif'

const Load = () => {
    return (
        <div className={`${styles.loadContainer} s-flex flex-dir ai-ct jc-ct`}>
            <img src={loadingFly} alt=""/>
            <Typography component="h1" variant="h5" sx={{
                fontSize: '1.4rem'
            }}>
                loading...
            </Typography>
        </div>
    )
}

export default Load;
