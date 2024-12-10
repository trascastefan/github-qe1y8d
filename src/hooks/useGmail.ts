import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GOOGLE_API_CONFIG } from '../config/google-api';
import { Email } from '../types';

interface GmailHookReturn {
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    emails: Email[];
    userProfile: UserProfile | null;
    signIn: () => Promise<void>;
    signOut: () => void;
    loadEmails: () => Promise<void>;
}

interface UserProfile {
    email: string;
    name: string;
    picture: string;
}

interface Email {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    date: string;
    tags: string[];
}

const EMAILS_STORAGE_KEY = 'gmail_emails';
const TOKEN_STORAGE_KEY = 'gmail_token';
const BATCH_SIZE = 5; // Process emails in smaller batches
const BATCH_DELAY = 1000; // Wait 1 second between batches

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useGmail = (): GmailHookReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emails, setEmails] = useState<Email[]>([]);
    const [tokenClient, setTokenClient] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const loadingRef = useRef(false); // Use ref to prevent concurrent loads

    // Load stored emails on mount
    useEffect(() => {
        try {
            const storedEmails = localStorage.getItem(EMAILS_STORAGE_KEY);
            if (storedEmails) {
                setEmails(JSON.parse(storedEmails));
            }
            const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
            if (token) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error loading stored emails:', error);
        }
    }, []);

    const initializeGoogleApi = useCallback(async () => {
        try {
            const client = window.google?.accounts?.oauth2?.initTokenClient({
                client_id: GOOGLE_API_CONFIG.CLIENT_ID,
                scope: GOOGLE_API_CONFIG.SCOPES,
                callback: async (response: any) => {
                    if (response.error) {
                        setError(response.error);
                        return;
                    }
                    setIsAuthenticated(true);
                    sessionStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
                    // Load emails after successful authentication
                    loadEmails();
                }
            });
            setTokenClient(client);

            // Check if we have a valid token
            const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
            if (token) {
                // Verify token validity
                try {
                    const response = await fetch(
                        'https://www.googleapis.com/gmail/v1/users/me/profile',
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.ok) {
                        setIsAuthenticated(true);
                    } else {
                        // Token is invalid, remove it
                        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
                    setIsAuthenticated(false);
                }
            }
        } catch (err) {
            setError('Failed to initialize Google API');
            console.error('Error initializing Google API:', err);
        }
    }, []);

    const fetchUserProfile = async (token: string) => {
        try {
            const response = await fetch(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();
            setUserProfile({
                email: data.email,
                name: data.name,
                picture: data.picture,
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const signIn = async () => {
        if (!tokenClient) {
            setError('Google API not initialized');
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            tokenClient.callback = async (response: any) => {
                if (response.error) {
                    setError(response.error);
                    return;
                }
                setIsAuthenticated(true);
                sessionStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
                await fetchUserProfile(response.access_token);
            };
            tokenClient.requestAccessToken();
        } catch (err) {
            setError('Failed to sign in');
            console.error('Error signing in:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = () => {
        setIsAuthenticated(false);
        setEmails([]);
        setUserProfile(null);
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(EMAILS_STORAGE_KEY);
        // Revoke Google's access
        const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
            fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).catch(console.error);
        }
    };

    const handleAuthError = async (response: Response, token: string) => {
        if (response.status === 401 || response.status === 403) {
            console.log('Auth error, signing out...');
            signOut();
            setError('Authentication expired. Please sign in again.');
            return true;
        }
        return false;
    };

    const fetchEmailDetails = async (messageId: string, token: string) => {
        try {
            const response = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (await handleAuthError(response, token)) {
                return null;
            }

            if (response.status === 429) {
                // If rate limited, wait longer and retry
                await delay(2000);
                return fetchEmailDetails(messageId, token);
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching email ${messageId}:`, error);
            return null;
        }
    };

    const processEmailDetails = (detail: any): Email | null => {
        if (!detail) return null;
        
        try {
            const subject = detail.payload.headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
            const from = detail.payload.headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
            const date = new Date(parseInt(detail.internalDate)).toLocaleDateString();
            
            return {
                id: detail.id,
                sender: from,
                subject,
                preview: detail.snippet || '',
                date,
                tags: []
            };
        } catch (error) {
            console.error('Error processing email details:', error);
            return null;
        }
    };

    const saveEmailsToStorage = (newEmails: Email[]) => {
        try {
            localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(newEmails));
        } catch (error) {
            console.error('Error saving emails to storage:', error);
        }
    };

    const processEmailBatch = async (
        messages: any[],
        token: string,
        processedEmails: Email[],
        startIndex: number
    ): Promise<number> => {
        const batchEnd = Math.min(startIndex + BATCH_SIZE, messages.length);
        const batch = messages.slice(startIndex, batchEnd);
        
        for (const message of batch) {
            if (processedEmails.length >= 20) {
                return processedEmails.length;
            }

            try {
                console.log(`Processing message ${message.id} (${processedEmails.length + 1}/20)`);
                const detail = await fetchEmailDetails(message.id, token);
                if (detail) {
                    const emailData = processEmailDetails(detail);
                    if (emailData && !processedEmails.some(e => e.id === emailData.id)) {
                        processedEmails.push(emailData);
                        setEmails(prevEmails => {
                            const newEmails = [...prevEmails, emailData];
                            return newEmails.slice(0, 20);
                        });
                    }
                }
                await delay(500); // Delay between individual requests
            } catch (error) {
                console.error(`Error processing message ${message.id}:`, error);
            }
        }

        return processedEmails.length;
    };

    const loadEmails = useCallback(async () => {
        if (!isAuthenticated || loadingRef.current) return;
        
        // Don't load if we already have 20 emails
        if (emails.length >= 20) {
            console.log('Already have 20 emails loaded, skipping fetch');
            return;
        }

        try {
            loadingRef.current = true;
            setIsLoading(true);
            setError(null);
            const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
            
            if (!token) {
                setError('No authentication token found');
                return;
            }

            // Calculate date 7 days ago
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const query = `after:${Math.floor(sevenDaysAgo.getTime() / 1000)}`;

            console.log('Fetching emails with query:', query);
            const response = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20&q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gmail API error:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received messages:', data);
            
            const messages = data.messages || [];
            const processedEmails: Email[] = [];

            // Process messages in batches
            for (let i = 0; i < messages.length && processedEmails.length < 20; i += BATCH_SIZE) {
                const count = await processEmailBatch(messages, token, processedEmails, i);
                if (count >= 20) break;
                await delay(BATCH_DELAY); // Delay between batches
            }

            // Save processed emails to storage
            if (processedEmails.length > 0) {
                saveEmailsToStorage(processedEmails.slice(0, 20));
            }
            console.log(`Finished processing ${processedEmails.length} messages`);
        } catch (err) {
            console.error('Error loading emails:', err);
            setError('Failed to load emails: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }, [isAuthenticated, emails.length]);

    useEffect(() => {
        initializeGoogleApi();
    }, [initializeGoogleApi]);

    return {
        isLoading,
        isAuthenticated,
        error,
        emails,
        userProfile,
        signIn,
        signOut,
        loadEmails,
    };
};
