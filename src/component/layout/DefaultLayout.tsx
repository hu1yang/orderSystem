import {Outlet, useLocation} from "react-router";
import {useEffect} from "react";
// import Cookie from "js-cookie";
// import {toLogin} from "@/utils/public.ts";
// import {getIdentityAgent} from "@/utils/request/agent.ts";

const DefaultLayout = () => {
    const {pathname} = useLocation()
    // useEffect(() => {
    //     const isToken = Cookie.get('token')
    //     if(!isToken){
    //         toLogin()
    //     }else{
    //         getIdentityAgent()
    //     }
    // }, []);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 或 'auto'
        });
    }, [pathname]);

    return (
        <div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default DefaultLayout;
