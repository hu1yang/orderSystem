import {Route, Routes} from "react-router";
import {lazy} from "react";
import DefaultLayout from '@/component/layout/DefaultLayout.tsx'

const LazyOrder = lazy(() => import('@/pages/order'))
const LazyPassenger = lazy(() => import('@/pages/passenger'))

const AppRoutes:React.FC = () => (
    <Routes>
        <Route path={'/'} Component={DefaultLayout} children={[
            <Route index={true} element={<LazyOrder />} />,
            <Route path={'/passenger'} element={<LazyPassenger />} />,
        ]} />
    </Routes>
)

export default AppRoutes;
