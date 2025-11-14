import {Suspense} from "react";
import AppRoutes from "./routes.tsx";
import Load from "@/component/load";
import {ErrorBoundary} from "@/component/error/ErrorBoundary.tsx";

function App() {
    return (
        <Suspense fallback={<Load />}>
            <ErrorBoundary>
                <AppRoutes />
            </ErrorBoundary>
        </Suspense>
    )
}

export default App
