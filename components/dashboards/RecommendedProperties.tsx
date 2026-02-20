

import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Property, User } from '../types';
import PropertyList from './PropertyList';
import { SparklesIcon } from './icons/ActionIcons';

interface RecommendedPropertiesProps {
  targetProperty: Property | null;
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
        similar_ids: {
            type: Type.ARRAY,
            description: "An array of the string IDs of the top 3 most similar properties.",
            items: { type: Type.STRING },
        },
    },
    required: ["similar_ids"],
};

const RecommendedProperties: React.FC<RecommendedPropertiesProps> = (props) => {
    const { 
        targetProperty, 
        allProperties, 
    } = props;
    
    const [recommended, setRecommended] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!targetProperty) {
            setRecommended([]);
            return;
        }

        const fetchRecommendations = async () => {
            setLoading(true);
            setError(null);
            setRecommended([]);

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                const otherProperties = allProperties.filter(p => p.id !== targetProperty.id);
                
                const prompt = `
                    You are a real estate recommendation engine.
                    Based on the following target property, find the 3 most similar properties from the provided list of all available properties.
                    Consider factors like property type, listing type, price, location (city), and size (beds, baths, area).
                    Return ONLY a JSON object with a single key "similar_ids" which is an array of the string IDs of the three most similar properties. Do not include the target property's own ID in the results.

                    Target Property:
                    ${JSON.stringify(targetProperty, null, 2)}

                    All Available Properties (excluding the target):
                    ${JSON.stringify(otherProperties.map(({id, title, listingType, propertyType, address, price, details}) => ({id, title, listingType, propertyType, address, price, details})), null, 2)}
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
                const ids = result.similar_ids;

                if (Array.isArray(ids)) {
                    const recommendedProps = ids
                        .map(id => allProperties.find(p => p.id === id))
                        .filter((p): p is Property => p !== undefined);
                    setRecommended(recommendedProps);
                } else {
                    throw new Error("Invalid response format from AI.");
                }

            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError("Sorry, we couldn't fetch recommendations right now. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [targetProperty, allProperties]);

    if (!targetProperty) {
        return null; // Don't render anything if no property has been selected for similarity search
    }

    return (
        <section id="recommendations" className="py-12 lg:py-16 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-2">
                         <SparklesIcon className="w-8 h-8 text-brand-primary" />
                         <h2 className="text-4xl font-bold text-brand-dark">For You</h2>
                    </div>
                    <p className="text-slate-500 mt-4">Based on your interest in "{targetProperty.title}"</p>
                </div>

                {error && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-red-600">Something Went Wrong</h3>
                        <p className="text-slate-500 mt-3 max-w-md mx-auto">{error}</p>
                    </div>
                )}
                
                <PropertyList 
                    {...props}
                    properties={recommended}
                    isLoading={loading}
                />

                 {!loading && !error && recommended.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-slate-800">No Similar Properties Found</h3>
                        <p className="text-slate-500 mt-3 max-w-md mx-auto">
                            We couldn't find any other properties that closely match your selection.
                        </p>
                    </div>
                 )}
            </div>
        </section>
    );
};

export default RecommendedProperties;