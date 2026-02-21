import { ALL_PROPERTIES as initialProperties, MOCK_NOTIFICATIONS } from '../constants';
import type { Property, TourRequest, User, SearchFilters, Message, Review, CalendarEvent, AgentProfile, Lead, InvestorSettings, InvestmentRequest, PropertyAlert, UserDocument, Notification, PaymentMethod, Payment } from '../types';
import { ListingType, PropertyStatus, ActivityType } from '../types';
import { supabase } from './supabase';

// --- Helper for handling Supabase errors ---
const handleError = (error: any, message: string) => {
    if (error) {
        let errorMessage = 'Unknown error';
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error && typeof error === 'object') {
            errorMessage = error.message || error.details || error.hint || JSON.stringify(error);
        }

        const isNetworkError = errorMessage.includes('Failed to fetch') || 
                             errorMessage.includes('Network request failed') ||
                             errorMessage.includes('connection error');

        if (isNetworkError) {
             console.warn(`[AfriProperty] Network/Backend unreachable. Using mock data for: ${message}`);
             return true;
        }

        console.error(`[AfriProperty] Error ${message}: ${errorMessage}`);
        return true;
    }
    return false;
};

// --- Authentication & User Management ---

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) return null;

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (profileError) return null;

        return {
            ...profile,
            id: profile.id,
            isVerified: profile.is_verified,
            fullName: profile.full_name,
            profilePicture: profile.profile_picture,
        } as User;
    } catch (e) {
        return null;
    }
};

export const authenticateUser = async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { user: null, error: error.message };
        }

        if (!data.user) return { user: null, error: 'Authentication failed.' };

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) return { user: null, error: 'Profile not found.' };

        const user = {
            ...profile,
            isVerified: profile.is_verified,
            fullName: profile.full_name,
            profilePicture: profile.profile_picture,
        } as User;

        if ((user.role === 'agent' || user.role === 'investor') && !user.isVerified) {
            return { user: null, error: `pending_verification_${user.role}` };
        }

        return { user };
    } catch (e) {
        return { user: null, error: 'Database connection failed.' };
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (e) {
        handleError(e, 'logging out');
    }
};

export const addUser = async (user: User): Promise<{ success: boolean; message: string }> => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password || '',
            options: {
                data: {
                    full_name: user.fullName,
                    username: user.username,
                    role: user.role,
                }
            }
        });

        if (error) return { success: false, message: error.message };
        return { success: true, message: 'Account created successfully. Please check your email for verification.' };
    } catch (e) {
        return { success: false, message: 'Connection error during signup.' };
    }
};

// --- Social Authentication ---

export const signInWithGoogle = async (): Promise<void> => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
    } catch (e) {
        handleError(e, 'signing in with Google');
    }
};

export const signInWithApple = async (): Promise<void> => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
        });
        if (error) throw error;
    } catch (e) {
        handleError(e, 'signing in with Apple');
    }
};

// --- Tour Requests ---

export const getTourRequests = async (userId: string): Promise<TourRequest[]> => {
    try {
        const { data, error } = await supabase
            .from('tour_requests')
            .select('*, profiles(username, full_name, profile_picture)')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        
        return data?.map(r => ({ 
            ...r, 
            userId: r.user_id, 
            propertyId: r.property_id, 
            propertyTitle: r.property_title,
            username: r.username || r.profiles?.username 
        })) || [];
    } catch (e) { return []; }
};

export const addTourRequest = async (userId: string, propertyId: string, propertyTitle: string, date: string, time: string): Promise<TourRequest> => {
    const newRequest = { 
        property_id: propertyId, 
        property_title: propertyTitle, 
        user_id: userId, 
        date, 
        time, 
        status: 'Pending', 
        timestamp: Date.now() 
    };
    try {
        const { data, error } = await supabase
            .from('tour_requests')
            .insert(newRequest)
            .select()
            .single();
        
        if (error) throw error;
        return { 
            ...data, 
            userId: data.user_id, 
            propertyId: data.property_id, 
            propertyTitle: data.property_title 
        };
    } catch (e) {
        handleError(e, 'adding tour request');
        throw e;
    }
};

// --- Payments & Billing ---

export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
    try {
        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(pm => ({
            id: pm.id,
            cardHolder: pm.card_holder,
            brand: pm.brand,
            lastFour: pm.last_four,
            expiryMonth: pm.expiry_month,
            expiryYear: pm.expiry_year,
            isDefault: pm.is_default,
            providerType: pm.provider_type || 'card',
            gatewayName: pm.gateway_name
        }));
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        return [];
    }
};

/**
 * FIX: Added providerType and gatewayName handling to match updated types.ts and PaymentMethod interface.
 */
export const addPaymentMethod = async (userId: string, cardData: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod | null> => {
    try {
        const { data, error } = await supabase
            .from('payment_methods')
            .insert({
                user_id: userId,
                card_holder: cardData.cardHolder,
                brand: cardData.brand,
                last_four: cardData.lastFour,
                expiry_month: cardData.expiryMonth,
                expiry_year: cardData.expiryYear,
                is_default: cardData.isDefault,
                provider_type: cardData.providerType,
                gateway_name: cardData.gatewayName
            })
            .select()
            .single();

        if (error) throw error;
        
        return {
            id: data.id,
            cardHolder: data.card_holder,
            brand: data.brand,
            lastFour: data.last_four,
            expiryMonth: data.expiry_month,
            expiryYear: data.expiry_year,
            isDefault: data.is_default,
            providerType: data.provider_type || 'card',
            gatewayName: data.gateway_name
        };
    } catch (error) {
        console.error("Error adding payment method:", error);
        return null;
    }
};

export const deletePaymentMethod = async (userId: string, id: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('payment_methods')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error deleting payment method:", error);
        return false;
    }
};

export const getPaymentHistory = async (userId: string): Promise<Payment[]> => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(p => ({
            id: p.id,
            amount: p.amount,
            currency: p.currency,
            status: p.status as any,
            description: p.description,
            createdAt: p.created_at,
            propertyId: p.property_id
        }));
    } catch (error) {
        console.error("Error fetching payment history:", error);
        return [];
    }
};

export const addPaymentRecord = async (userId: string, paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment | null> => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .insert({
                user_id: userId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                status: paymentData.status,
                description: paymentData.description,
                property_id: paymentData.propertyId
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            amount: data.amount,
            currency: data.currency,
            status: data.status as any,
            description: data.description,
            createdAt: data.created_at,
            propertyId: data.property_id
        };
    } catch (error) {
        console.error("Error adding payment record:", error);
        return null;
    }
};

// --- Messages ---
export const getMessagesForUser = async (username: string): Promise<Message[]> => {
    try {
        const { data } = await supabase.from('messages').select('*').or(`sender_username.eq.${username},receiver_username.eq.${username}`).order('timestamp', { ascending: true });
        return data?.map(m => ({ ...m, propertyId: m.property_id, propertyTitle: m.property_title, senderUsername: m.sender_username, receiverUsername: m.receiver_username })) || [];
    } catch (e) { return []; }
};

export const sendMessage = async (msgData: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    const newMessage = { property_id: msgData.propertyId, property_title: msgData.propertyTitle, sender_username: msgData.senderUsername, receiver_username: msgData.receiverUsername, text: msgData.text, timestamp: Date.now() };
    try {
        const { data } = await supabase.from('messages').insert(newMessage).select().single();
        return { ...data, propertyId: data.property_id, propertyTitle: data.property_title, senderUsername: data.sender_username, receiverUsername: data.receiver_username };
    } catch (e) {
        return { ...msgData, timestamp: Date.now(), id: `msg_${Date.now()}` } as any;
    }
};

export const getProperties = async (): Promise<Property[]> => {
    try {
        const { data, error } = await supabase.from('properties').select('*');
        if (error || !data) return initialProperties;

        return data.map(p => ({
            ...p,
            dateListed: p.dateListed ?? p.date_listed ?? Date.now(),
            listingType: p.listingType ?? p.listing_type,
            propertyType: p.propertyType ?? p.property_type,
            address: typeof p.address === 'string' ? JSON.parse(p.address) : p.address,
            details: typeof p.details === 'string' ? JSON.parse(p.details) : p.details,
            amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : p.amenities,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
            agent: typeof p.agent === 'string' ? JSON.parse(p.agent) : p.agent,
        })).sort((a, b) => b.dateListed - a.dateListed);
    } catch (e) {
        return initialProperties;
    }
};

export const saveProperties = async (properties: Property[]): Promise<void> => {
    try {
        const dbProperties = properties.map(p => ({
            ...p,
            listing_type: p.listingType,
            property_type: p.propertyType,
            date_listed: p.dateListed,
        }));
        await supabase.from('properties').upsert(dbProperties);
    } catch (e) {
        handleError(e, 'upserting properties');
    }
};

export const incrementPropertyView = async (propertyId: string): Promise<void> => {
    try {
        await supabase.rpc('increment_views', { prop_id: propertyId });
    } catch (e) {}
};

export const getSavedPropertiesForUser = async (username: string): Promise<Set<string>> => {
    try {
        const { data } = await supabase.from('saved_properties').select('property_id').eq('username', username);
        return new Set((data?.map(item => item.property_id) || []) as string[]);
    } catch (e) { return new Set(); }
};

export const savePropertiesForUser = async (username: string, propertyIds: string[]): Promise<void> => {
    try {
        await supabase.from('saved_properties').delete().eq('username', username);
        if (propertyIds.length > 0) {
            await supabase.from('saved_properties').insert(propertyIds.map(id => ({ username, property_id: id })));
        }
    } catch (e) {}
};

export const getSavedSearchesForUser = async (username: string): Promise<SearchFilters[]> => {
    try {
        const { data } = await supabase.from('saved_searches').select('filters').eq('username', username);
        return data?.map(item => typeof item.filters === 'string' ? JSON.parse(item.filters) : item.filters) || [];
    } catch (e) { return []; }
};

export const saveSearchesForUser = async (username: string, searches: SearchFilters[]): Promise<void> => {
    try {
        await supabase.from('saved_searches').delete().eq('username', username);
        if (searches.length > 0) {
            await supabase.from('saved_searches').insert(searches.map(s => ({ username, filters: s })));
        }
    } catch (e) {}
};

export const getEvents = async (username: string): Promise<CalendarEvent[]> => {
    try {
        const { data } = await supabase.from('calendar_events').select('*').eq('username', username);
        return data?.map(e => ({ ...e, startTime: e.start_time, endTime: e.end_time })) || [];
    } catch (e) { return []; }
};

export const addEvent = async (username: string, eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    try {
        const { data } = await supabase.from('calendar_events').insert({ ...eventData, username, start_time: eventData.startTime, end_time: eventData.endTime }).select().single();
        return { ...data, startTime: data.start_time, endTime: data.end_time };
    } catch (e) {
        return { ...eventData, id: `evt_${Date.now()}` } as any;
    }
};

export const updateEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
    try {
        const { data, error } = await supabase
            .from('calendar_events')
            .update({
                title: event.title,
                date: event.date,
                start_time: event.startTime,
                end_time: event.endTime,
                type: event.type,
                notes: event.notes
            })
            .eq('id', event.id)
            .select()
            .single();
        if (error) throw error;
        return { ...data, startTime: data.start_time, endTime: data.end_time };
    } catch (e) {
        handleError(e, 'updating event');
        return event;
    }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('calendar_events')
            .delete()
            .eq('id', eventId);
        if (error) throw error;
    } catch (e) {
        handleError(e, 'deleting event');
    }
};

export const getNotifications = async (user: User): Promise<Notification[]> => {
    try {
        const { data } = await supabase.from('notifications').select('*').eq('username', user.username);
        return data?.map(n => ({ ...n, isRead: n.is_read, propertyId: n.property_id })) || MOCK_NOTIFICATIONS as any;
    } catch (e) { return MOCK_NOTIFICATIONS as any; }
};

export const markNotificationsAsRead = async (username: string, ids: string[]): Promise<Set<string>> => {
    try {
        await supabase.from('notifications').update({ is_read: true }).in('id', ids);
        const { data } = await supabase.from('notifications').select('id').eq('username', username).eq('is_read', true);
        return new Set((data?.map(n => n.id) || []) as string[]);
    } catch (e) { return new Set(ids); }
};

export const getReadNotificationIds = async (username: string): Promise<Set<string>> => {
    try {
        const { data } = await supabase.from('notifications').select('id').eq('username', username).eq('is_read', true);
        return new Set((data?.map(n => n.id) || []) as string[]);
    } catch (e) { return new Set(); }
};

export const getAgentProfile = async (username: string): Promise<AgentProfile> => {
    try {
        const { data, error } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (data) {
            return {
                ...data,
                profilePicture: data.profile_picture || data.profilePicture,
            };
        }
    } catch (e) {}

    return {
        username: username,
        bio: `Welcome to AfriProperty!`,
        email: `${username.toLowerCase().replace(/\s+/g, '.')}@afriproperty.co.za`,
        phone: 'Add phone',
        profilePicture: `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`,
        socials: { twitter: '', linkedin: '', facebook: '' }
    };
};

export const updateAgentProfile = async (username: string, updatedProfile: AgentProfile): Promise<AgentProfile> => {
    try {
        const { error } = await supabase
            .from('agent_profiles')
            .upsert({ ...updatedProfile, username, profile_picture: updatedProfile.profilePicture })
            .eq('username', username);
        if (error) throw error;
        return updatedProfile;
    } catch (error) {
        handleError(error, 'updating agent profile');
        return updatedProfile;
    }
};

export const getInquiriesForSeller = async (username: string): Promise<TourRequest[]> => {
    const properties = await getProperties();
    const sellerPropertyIds = properties.filter(p => p.agent.name === username).map(p => p.id);
    if (sellerPropertyIds.length === 0) return [];

    try {
        const { data, error } = await supabase
            .from('tour_requests')
            .select('*')
            .in('property_id', sellerPropertyIds);
        
        if (error) return [];
        return data.map(r => ({
             ...r,
             propertyId: r.property_id || r.propertyId,
             propertyTitle: r.property_title || r.propertyTitle
        })) || [];
    } catch (e) { return []; }
};

export const getLeadsForAgent = async (username: string): Promise<Lead[]> => {
    try {
        const inquiries = await getInquiriesForSeller(username);
        const leadMap: Record<string, Lead> = {};
        
        inquiries.forEach(inquiry => {
            if (!leadMap[inquiry.username]) {
                leadMap[inquiry.username] = {
                    id: inquiry.username,
                    username: inquiry.username,
                    email: '', 
                    phone: '', 
                    score: 50, 
                    lastContact: inquiry.timestamp,
                    activity: []
                };
            }
            leadMap[inquiry.username].activity.push({
                type: ActivityType.TOUR_REQUESTED,
                timestamp: inquiry.timestamp,
                propertyTitle: inquiry.propertyTitle,
                detail: `Requested tour at ${inquiry.time} on ${inquiry.date}`
            });
            if (inquiry.timestamp > leadMap[inquiry.username].lastContact) {
                leadMap[inquiry.username].lastContact = inquiry.timestamp;
            }
        });
        
        return Object.values(leadMap);
    } catch (e) {
        return [];
    }
};

export const getReviewsForAgent = async (agentName: string): Promise<Review[]> => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('agent_name', agentName)
            .order('timestamp', { ascending: false });
        if (error) return [];
        return (data || []).map(r => ({
            ...r,
            agentName: r.agent_name || r.agentName,
            reviewerUsername: r.reviewer_username || r.reviewerUsername
        }));
    } catch (e) {
        return [];
    }
};

export const addReview = async (reviewData: Omit<Review, 'id' | 'timestamp'>): Promise<Review> => {
    const newReview = {
        agent_name: reviewData.agentName,
        reviewer_username: reviewData.reviewerUsername,
        rating: reviewData.rating,
        comment: reviewData.comment,
        timestamp: Date.now(),
    };
    try {
        const { data, error } = await supabase.from('reviews').insert(newReview).select().single();
        if (error) throw error;
        return { ...data, agentName: data.agent_name, reviewerUsername: data.reviewer_username };
    } catch (error) {
        return { ...reviewData, id: `rev_${Date.now()}`, timestamp: Date.now() } as Review;
    }
};

export const getInvestorSettings = async (username: string): Promise<InvestorSettings> => {
    try {
        const { data } = await supabase.from('investor_settings').select('settings').eq('username', username).single();
        return data?.settings || null;
    } catch (e) { return null as any; }
};

export const saveInvestorSettings = async (username: string, settings: InvestorSettings): Promise<void> => {
    try {
        await supabase.from('investor_settings').upsert({ username, settings });
    } catch (e) {}
};

export const getInvestmentRequests = async (): Promise<InvestmentRequest[]> => {
    try {
        const { data } = await supabase.from('investment_requests').select('*').order('timestamp', { ascending: false });
        return data?.map(r => ({ ...r, investorUsername: r.investor_username, requestDetails: r.request_details })) || [];
    } catch (e) { return []; }
};

export const addInvestmentRequest = async (username: string, requestDetails: string): Promise<InvestmentRequest> => {
    try {
        const { data } = await supabase.from('investment_requests').insert({ investor_username: username, request_details: requestDetails, timestamp: Date.now(), status: 'Open' }).select().single();
        return { ...data, investorUsername: data.investor_username, requestDetails: data.request_details };
    } catch(e) { return { investorUsername: username, requestDetails, timestamp: Date.now(), status: 'Open', id: `ir_${Date.now()}` } as any; }
};

/**
 * FIX: Added missing exported members to lib/data.ts to satisfy imports in UserDashboard, InvestorReturns and InvestorDocuments.
 */

/**
 * Returns mock data for investor returns/dividends.
 */
export const getInvestorReturns = () => [
    { id: 'div1', propertyId: '12', propertyTitle: 'Luxury Hotel Development', date: '2023-10-01', amount: 12500, type: 'Dividend' },
    { id: 'div2', propertyId: '13', propertyTitle: 'Downtown Office Block', date: '2023-10-01', amount: 8200, type: 'Dividend' },
];

/**
 * Returns mock data for investor documents.
 */
export const getInvestorDocuments = () => [
    { id: 'doc1', name: 'Contract - Hotel Development.pdf', type: 'Contract', date: '2022-01-15', url: '#' },
    { id: 'doc2', name: 'Q3 2023 Portfolio Statement.pdf', type: 'Statement', date: '2023-10-05', url: '#' },
];

/**
 * Fetches documents for a specific user from Supabase.
 */
export const getUserDocuments = async (username: string): Promise<UserDocument[]> => {
    try {
        const { data } = await supabase.from('user_documents').select('*').eq('username', username);
        return data?.map(d => ({ ...d, uploadDate: d.upload_date })) || [];
    } catch (e) { return []; }
};

/**
 * Adds a new document for a user.
 */
export const addUserDocument = async (username: string, file: File): Promise<UserDocument> => {
    const newDoc = { name: file.name, type: 'pdf', upload_date: Date.now(), url: '#', username };
    try {
        const { data } = await supabase.from('user_documents').insert(newDoc).select().single();
        return { ...data, uploadDate: data.upload_date };
    } catch (error) {
        return { ...newDoc, id: `doc_${Date.now()}`, uploadDate: newDoc.upload_date } as any;
    }
};

/**
 * Deletes a user document by ID.
 */
export const deleteUserDocument = async (username: string, docId: string): Promise<void> => {
    try { await supabase.from('user_documents').delete().eq('id', docId); } catch (e) {}
};

/**
 * Fetches property alerts for a specific user from Supabase.
 */
export const getPropertyAlerts = async (username: string): Promise<PropertyAlert[]> => {
    try {
        const { data } = await supabase.from('property_alerts').select('*').eq('username', username);
        return data?.map(a => ({ ...a, criteria: typeof a.criteria === 'string' ? JSON.parse(a.criteria) : a.criteria })) || [];
    } catch (e) { return []; }
};

/**
 * Adds a new property alert for a user.
 */
export const addPropertyAlert = async (username: string, alertData: Omit<PropertyAlert, 'id'>): Promise<PropertyAlert> => {
    try {
        const { data } = await supabase.from('property_alerts').insert({ ...alertData, username }).select().single();
        return { ...data, criteria: typeof data.criteria === 'string' ? JSON.parse(data.criteria) : data.criteria };
    } catch (e) { return { ...alertData, id: `alert_${Date.now()}` } as any; }
};

/**
 * Deletes a property alert by ID.
 */
export const deletePropertyAlert = async (username: string, alertId: string): Promise<void> => {
    try { await supabase.from('property_alerts').delete().eq('id', alertId); } catch (e) {}
};

/**
 * Updates a user's profile information in the profiles table.
 */
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: updates.fullName,
                phone: updates.phone,
                office_address: updates.officeAddress
            })
            .eq('id', userId);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
};
