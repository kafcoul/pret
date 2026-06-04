import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="text-center max-w-md">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                        <h1 className="font-serif text-2xl font-bold text-primary-700 mb-3">
                            Une erreur est survenue
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Nous nous excusons pour le désagrément. L'erreur a été signalée et sera corrigée rapidement.
                        </p>
                        {import.meta.env.DEV && this.state.error && (
                            <pre className="text-left text-xs bg-gray-100 rounded-lg p-4 mb-6 overflow-auto max-h-40 text-red-600">
                                {this.state.error.message}
                            </pre>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="bg-primary-700 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
