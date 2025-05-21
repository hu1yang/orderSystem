import styles from './styles.module.less'

interface IProps {
    children: React.ReactNode;
}

const Orderlayout = ({children}:IProps) => {
    return (
        <div className={styles.orderLayout}>
            <div className={styles.layoutWidth}>
                {children}
            </div>
        </div>
    )
}

export default Orderlayout;
