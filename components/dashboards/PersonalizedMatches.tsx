

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Property, User } from '../types';
import PropertyList from './PropertyList';
import { SparklesIcon } from './icons/ActionIcons';

interface PersonalizedMatchesProps {
  savedProperties: Property[];
  allProperties: Property[];
  currentUser: User | null;
  onSaveToggle: (propertyId: string) => void;
  savedPropertyIds: Set<string>;
  onOpenCalculator: (property: Property) => void;
  onOpenTourModal: (property: Property) => void;
  onFindSimilar: (property: Property) => void;
  onOpenDetailModal: (property: Property) => void;
  onOpenVRTour: (url: string) => void;
  onToggleCompare: (property: Property) => void;
  compareList: Property[];
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        matched_ids: {
            type: Type.ARRAY,
            description: "An array of the string IDs of the top 3 best-matched properties.",
            items: { type: Type.STRING },
        },
    },
    required: ["matched_ids"],
};

const PersonalizedMatches: React.FC<PersonalizedMatchesProps> = (props) => {
    const { savedProperties, allProperties, currentUser } = props;
    
    const [matches, setMatches] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        
        if (savedProperties.length === 0) {
            setLoading(false);
            setMatches([]);
            return;
        }

        const fetchMatches = async () => {
            setLoading(true);
            setError(null);
            setMatches([]);

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                const savedPropertyIds = new Set(savedProperties.map(p => p.id));
                const otherProperties = allProperties.filter(p => !savedPropertyIds.has(p.id));
                const simplifiedSaved = savedProperties.map(({title, listingType, propertyType, address, price, details}) => ({title, listingType, propertyType, address, price, details}));
                const simplifiedOthers = otherProperties.map(({id, title, listingType, propertyType, address, price, details}) => ({id, title, listingType, propertyType, address, price, details}));

                const prompt = `
                    You are a sophisticated AI real estate matchmaker. A user has saved the following properties, indicating their preferences. Based *only* on the data in these saved properties, analyze their likely preferences for property type, listing type, price range, location (city), and size. 
                    Then, from the list of all available properties, select the top 3 properties that best match these inferred preferences. 
                    Do not recommend properties they have already saved. 
                    Return ONLY a JSON object with a single key "matched_ids", which is an array of the string IDs of the three best-matched properties.

                    Saved Properties (User's Preferences):
                    ${JSON.stringify(simplifiedSaved, null, 2)}

                    All Available Properties (to choose from):
                    ${JSON.stringify(simplifiedOthers, null, 2)}
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: responseSchema,
                    }
                });
                
                const jsonText = response.text.trim();
                const result = JSON.parse(jsonText);
                const ids = result.matched_ids;

                if (Array.isArray(ids)) {
                    const matchedProps = ids
                        .map(id => allProperties.find(p => p.id === id))
                        .filter((p): p is Property => p !== undefined);
                    setMatches(matchedProps);
                } else {
                    throw new Error("Invalid response format from AI.");
                }

            } catch (err) {
                console.error("Error fetching personalized matches:", err);
                setError("Sorry, we couldn't fetch your personalized matches right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [savedProperties, allProperties, currentUser]);
    
    if (!currentUser) return null;

    return (
        <section id="personalized-matches" className="py-12 lg:py-16 bg-brand-light">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-2">
                         <SparklesIcon className="w-8 h-8 text-brand-primary" />
                         <h2 className="text-4xl font-bold text-brand-dark">Just For You</h2>
                    </div>
                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto">AI-powered recommendations based on your saved properties.</p>
                </div>

                {error && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-red-600">Something Went Wrong</h3>
                        <p className="text-slate-500 mt-3 max-w-md mx-auto">{error}</p>
                    </div>
                )}
                
                {!error && savedProperties.length === 0 && !loading && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-slate-800">Save Properties to Get Matches</h3>
                        <p className="text-slate-500 mt-3 max-w-md mx-auto">
                            Click the heart icon on any listing to save it. We'll use your saved properties to find recommendations you'll love!
                        </p>
                    </div>
                 )}
                 
                 <PropertyList {...props} properties={matches} isLoading={loading} />

            </div>
        </section>
    );
};

export default PersonalizedMatches;