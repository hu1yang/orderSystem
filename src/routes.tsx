import {Route, Routes} from "react-router";
import {lazy, Suspense} from "react";
import DefaultLayout from '@/component/layout/DefaultLayout.tsx'
import Load from "@/component/load";

const LazyOrder = lazy(() => import('@/pages/order'))
const LazyPassenger = lazy(() => import('@/pages/passenger'))
// const LazyMine = lazy(() => import('@/pages/mine'))
// const LazyOrderDetail = lazy(() => import('@/pages/orderDetail'))

const AppRoutes:React.FC = () => (
    <Suspense fallback={<Load />}>
        <Routes>
            <Route path={'/'} element={<DefaultLayout />}>
                <Route index element={<LazyOrder />} />
                {/*<Route path={'/mine'} element={<LazyMine />} />*/}
                {/*<Route path='/mine/orderDetail/:payid' element={<LazyOrderDetail />} />*/}
                <Route path={'/passenger'} element={<LazyPassenger />} />
            </Route>
        </Routes>
    </Suspense>
)

export default AppRoutes;
