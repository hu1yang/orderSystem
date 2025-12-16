import AppRoutes from "./routes.tsx";
import {ErrorBoundary} from "@/component/error/ErrorBoundary.tsx";

function App() {
    return (
        <ErrorBoundary>
            <AppRoutes />
        </ErrorBoundary>
    )
}

export default App
