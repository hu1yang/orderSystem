import React, {Component, type ReactElement} from 'react';
import {Alert, AlertTitle} from "@mui/material";

interface ErrorBoundaryProps {
    children: ReactElement;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        // 更新 state 以触发 fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // 这里可以发送错误日志到服务端
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    The page is faulty.: {this.state.error?.message}
                </Alert>
            )

        }
        return this.props.children;
    }
}
