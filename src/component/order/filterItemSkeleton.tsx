import {Box, Grid, Skeleton} from '@mui/material'
import styles from './styles.module.less'


const FilterItemSkeleton = () => {

    return (
        <Box>
            {
                [...Array(3)].map((_, i) => (
                    <div key={i} className={styles.filterItem}>
                        <div className={styles.filterItemBox}>
                            <div className={`${styles.filterTips} s-flex ai-ct`}>
                                <Skeleton variant="text" animation={false} width={60} height={12} />
                            </div>
                            <div className={`${styles.airInfomation} s-flex ai-ct`}>
                                <div className={`${styles.leftInfo} s-flex flex-1 ai-ct`}>
                                    <div className={`${styles.leftInfoDetail} s-flex`}>
                                        <div className={`${styles.leftInfoDetailTitle}`}>
                                            <div className={`${styles.airTitle} s-flex flex-dir`}>
                                                <Skeleton variant="text" width={60} sx={{ fontSize: '1rem' }} height={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <Grid container className={'flex-1'} spacing={2}>
                                        <Grid size={3} className={`s-flex ai-ct flex-dir`}>
                                            <Skeleton variant="text" sx={{ fontSize: '1.3rem' }} width={60} height={25} />
                                            <Skeleton variant="text" sx={{ fontSize: '.8rem' }} width={80} height={18} />
                                        </Grid>
                                        <Grid size={6} className={`s-flex ai-ct jc-ct`}>
                                            <Skeleton variant="text" sx={{ fontSize: '.6rem' }} width={'80%'} height={10} />
                                        </Grid>
                                        <Grid size={3} className={`s-flex ai-ct flex-dir`}>
                                            <Skeleton variant="text" sx={{ fontSize: '1.3rem' }} width={60} height={25} />
                                            <Skeleton variant="text" sx={{ fontSize: '.8rem' }} width={80} height={18} />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className={`${styles.rightInfo} s-flex jc-fe ai-ct`}>
                                    <div className={`${styles.priceBox} s-flex ai-ct`}>
                                        <div className={`s-flex ai-fe ${styles.price} s-flex flex-dir`} style={{marginRight: '10px'}}>
                                            <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} width={80} height={18} />
                                            <Skeleton variant="text" sx={{ fontSize: '1.1rem' }} width={40} height={10} />
                                        </div>
                                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={90} height={64} />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }

        </Box>
    )
}

export default FilterItemSkeleton
