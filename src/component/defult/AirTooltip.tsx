import styles from "./styles.module.less";
import BoltIcon from "@mui/icons-material/Bolt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WifiIcon from "@mui/icons-material/Wifi";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const AirTooltip = () => {
    return (
        <div className={styles.airTooltipContent}>
            <div className='s-flex ai-ct'>
                <div className={styles.contentPicture}>
                    <img src="https://static.tripcdn.com/packages/flight/airline-logo/latest/airline_logo/3x/ca.webp" alt=""/>
                </div>
                <div className={styles.contentAirTitle}>
                    <span>Air China</span>
                </div>
            </div>
            <div className={styles.moreInfo}>
                <div className={styles.moreTitle}>Economy class</div>
                <div className={styles.moreIcon}>
                    <div className={`${styles.moreIconLi} s-flex ai-ct`}>
                        <BoltIcon />
                        <span>Inflight meals are available</span>
                    </div>
                    <div className={`${styles.moreIconLi} s-flex ai-ct`}>
                        <RestaurantIcon />
                        <span>Wi-Fi available</span>
                    </div>
                    <div className={`${styles.moreIconLi} s-flex ai-ct`}>
                        <WifiIcon />
                        <span>Power outlet</span>
                    </div>
                    <div className={`${styles.moreIconLi} s-flex ai-ct`}>
                        <PlayCircleIcon />
                        <span>On-demand entertainment</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AirTooltip
