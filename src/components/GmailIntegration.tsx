import React, { useEffect } from 'react';
import { useGmail } from '../hooks/useGmail';
import { EmailList } from './EmailList';

export const GmailIntegration: React.FC = () => {
    const {
        isLoading,
        isAuthenticated,
        error,
        emails,
        signIn,
        loadEmails,
    } = useGmail();

    useEffect(() => {
        let mounted = true;

        if (isAuthenticated && mounted) {
            loadEmails();
        }

        return () => {
            mounted = false;
        };
    }, [isAuthenticated, loadEmails]);

    if (error) {
        return (
            <div className="p-4">
                <div className="mb-4 bg-red-100 text-red-700 p-4 rounded-md">
                    <div className="font-semibold">Error loading emails:</div>
                    <div className="mt-1">{error}</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Gmail Integration</h1>
                    <button
                        onClick={signIn}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden">
            <EmailList
                emails={emails}
                selectedView=""
                views={[]}
                getParentView={() => []}
                tags={[]}
            />
        </div>
    );
};
