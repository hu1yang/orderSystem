import {useEffect} from "react";
import {Outlet, useLocation} from "react-router";
import Cookie from "js-cookie";
import {toLogin} from "@/utils/public.ts";

const DefaultLayout = () => {
    const {pathname} = useLocation()
    useEffect(() => {
        const isToken = Cookie.get('token')
        if(!isToken){
            toLogin()
        }
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 或 'auto'
        });
    }, [pathname]);

    return (
        <Outlet/>
    )
}

export default DefaultLayout;
