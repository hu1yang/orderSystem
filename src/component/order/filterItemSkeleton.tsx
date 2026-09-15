import {memo} from "react";
import {Box, Grid, Skeleton} from '@mui/material'
import styles from './styles.module.less'


const FilterItemSkeleton = memo(({skeletonCount=6}:{skeletonCount?:number}) => {
    return (
        <Box className={styles.filterContent} aria-hidden="true">
            {
                [...Array(skeletonCount)].map((_, i) => (
                    <div key={i} className={`${styles.filterItem} ${styles.filterItemSkeleton}`}>
                        <div className={styles.filterItemBox}>
                            <div className={`${styles.filterTips} s-flex ai-ct`}>
                                <Skeleton variant="rounded" width={82} height={20} />
                            </div>
                            <div className={`${styles.airInfomation} s-flex ai-ct`}>
                                <div className={`${styles.leftInfo} s-flex flex-1 ai-ct`}>
                                    <div className={`${styles.leftInfoDetail} s-flex ai-ct`}>
                                        <div className={`${styles.picture} s-flex ai-ct`}>
                                            <Skeleton variant="rounded" width="100%" height="100%" />
                                        </div>
                                        <div className={`${styles.leftInfoDetailTitle}`}>
                                            <div className={`${styles.airTitle} s-flex flex-dir`}>
                                                <Skeleton variant="text" width={76} height={26} />
                                                <Skeleton variant="text" width={54} height={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <Grid container className={`${styles.timelineGrid} flex-1`} spacing={2}>
                                        <Grid size={12}>
                                            <div className={`${styles.skeletonTimeline} s-flex ai-ct`}>
                                                <div className={`${styles.skeletonAirport} s-flex ai-ct flex-dir`}>
                                                    <Skeleton variant="text" width={50} height={28} />
                                                    <Skeleton variant="text" width={70} height={20} />
                                                </div>
                                                <div className={`${styles.skeletonRoute} s-flex ai-ct flex-dir`}>
                                                    <Skeleton variant="text" width={46} height={12} />
                                                    <Skeleton variant="rectangular" width="100%" height={2} />
                                                    <Skeleton variant="text" width={36} height={12} />
                                                </div>
                                                <div className={`${styles.skeletonAirport} s-flex ai-ct flex-dir`}>
                                                    <Skeleton variant="text" width={50} height={28} />
                                                    <Skeleton variant="text" width={70} height={20} />
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className={`${styles.rightInfo} s-flex jc-fe ai-ct`}>
                                    <div className={`${styles.priceBox} s-flex flex-dir ai-fe`}>
                                        <div className={`s-flex ai-fe ${styles.price}`}>
                                            <Skeleton variant="text" width={92} height={30} />
                                        </div>
                                        <Skeleton variant="text" width={58} height={18} />
                                    </div>
                                    <Skeleton variant="rounded" width={110} height={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }

        </Box>
    )
})

export default FilterItemSkeleton
