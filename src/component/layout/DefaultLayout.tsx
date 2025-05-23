import { Outlet } from "react-router";

const DefaultLayout = () => {
    return (
        <div>
            <div style={{backgroundColor: 'var(--active-color)',height: '120px', textAlign: 'center'}}>
                header
            </div>
            <div style={{marginTop: '-40px'}}>
                <Outlet />
            </div>
        </div>
    )
}

export default DefaultLayout;
