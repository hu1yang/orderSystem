import {useTranslation} from "react-i18next";

const NotFound = () => {
    const {t} = useTranslation()
    return (
        <div style={{ padding: 40, textAlign: 'center' }}>
            <h1>404</h1>
            <p>{t('common.notfound')}</p>
        </div>
    )
}

export default NotFound
