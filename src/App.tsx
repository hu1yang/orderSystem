import {Suspense} from "react";
import AppRoutes from "./routes.tsx";
import Load from "@/component/load";

function App() {
    return (
        <Suspense fallback={<Load />}>
            <AppRoutes />
        </Suspense>
    )
}

export default App
