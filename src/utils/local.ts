const LOCALE_MAP = {
    en_US: 'en_US',
    zh_CN: 'zh_CN',
    ru_RU: 'ru_RU'
} as const

function normalizeLocale(value?: string | null) {
    if (!value) return 'en_US'

    const normalized = value.replace('-', '_')

    return LOCALE_MAP[normalized as keyof typeof LOCALE_MAP] ?? 'en_US'
}

export const resolveLocale = () => {
    return normalizeLocale(
        localStorage.getItem('locale') ||
        navigator.language
    )
}
