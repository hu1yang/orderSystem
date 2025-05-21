import {memo} from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import styles from './styles.module.less'

const Passenger = memo(() => {
    return(
        <div className={styles.passengerContainer}>
            <div className={`${styles.tips} s-flex ai-ct`}>
                <CheckCircleOutlineIcon />
                Act fast to lock in the current price and cabin
            </div>
            <div className={`${styles.cardContent} s-flex`}>
                <div className={`${styles.cardli} s-flex flex-1`}>
                    <div className={styles.picture}>
                        <img src="https://aw-s.tripcdn.com/modules/ibu/online-flight/images/notice_item_exposure_46b8794228.png_.webp" alt=""/>
                    </div>
                    <div className={`flex-1`}>
                        <div className={styles.cardTitle}>
                            <span>Ticket Issuing Time</span>
                        </div>
                        <div className={`${styles.desc}`}>
                            <span>Beijing - Shanghai: Once payment is confirmed, tickets will be issued within 20 min...</span>
                            <span className={`${styles.viewDetail} cursor-p`}>View Details</span>
                        </div>
                    </div>
                </div>
                <div className={`${styles.cardli} s-flex flex-1`}>
                    <div className={styles.picture}>
                        <img src="https://aw-s.tripcdn.com/modules/ibu/online-flight/images/notice_item_zip_243c6425ab.png_.webp" alt=""/>
                    </div>
                    <div className={`flex-1`}>
                        <div className={styles.cardTitle}>
                            <span>Know Before You Go</span>
                        </div>
                        <div className={`${styles.desc}`}>
                            <span>Multi-booking</span>
                            <span className={`${styles.viewDetail} cursor-p`}>View Details</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Passenger;
