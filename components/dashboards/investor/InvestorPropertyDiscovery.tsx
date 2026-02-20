

import React from 'react';
import type { Property, User } from '../../../types';
import PropertyList from '../../PropertyList';

interface InvestorPropertyDiscoveryProps {
  user: User;
  investmentProperties: Property[];
  // Props for PropertyList
  onSaveToggle: (propertyId: string) => void;
  savedPropertyIds: Set<string>;
  onOpenCalculator: (property: Property) => void;
  onOpenTourModal: (property: Property) => void;
  onFindSimilar: (property: Property) => void;
  onOpenDetailModal: (property: Property) => void;
  onOpenVRTour: (url: string) => void;
  onToggleCompare: (property: Property) => void;
  propertiesToCompare: Property[];
}

const InvestorPropertyDiscovery: React.FC<InvestorPropertyDiscoveryProps> = (props) => {
    const { investmentProperties, user } = props;

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Investment Marketplace</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Browse exclusive properties available for investment.</p>
            </div>

            <PropertyList 
                properties={investmentProperties}
                currentUser={user}
                onSaveToggle={props.onSaveToggle}
                savedPropertyIds={props.savedPropertyIds}
                onOpenCalculator={props.onOpenCalculator}
                onOpenTourModal={props.onOpenTourModal}
                onFindSimilar={props.onFindSimilar}
                onOpenDetailModal={props.onOpenDetailModal}
                onToggleCompare={props.onToggleCompare}
                onOpenVRTour={props.onOpenVRTour}
                compareList={props.propertiesToCompare}
                onEdit={() => {}} // Investors cannot edit
                onDelete={() => {}} // Investors cannot delete
            />
        </div>
    );
};

export default InvestorPropertyDiscovery;