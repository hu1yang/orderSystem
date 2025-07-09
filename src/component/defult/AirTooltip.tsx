import styles from "./styles.module.less";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const AirTooltip = () => {
    return (
        <div className={styles.airTooltipContent}>
            <div className={styles.moreInfo}>
                <div className={styles.moreTitle}>Economy class</div>
                <div className={styles.moreIcon}>
                    <div className={`${styles.moreIconLi} s-flex ai-ct`}>
                        <RestaurantIcon />
                        <span>Inflight meals are available</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AirTooltip
