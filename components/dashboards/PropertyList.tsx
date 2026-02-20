

import React from 'react';
import type { Property, User } from '../types';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from './PropertyCardSkeleton';

interface PropertyListProps {
  properties: Property[];
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
  isLoading?: boolean;
}

const PropertyList: React.FC<PropertyListProps> = (props) => {
  const { 
    properties, 
    currentUser,
    onSaveToggle, 
    savedPropertyIds,
    onOpenCalculator,
    onOpenTourModal,
    onFindSimilar,
    onOpenDetailModal,
    onOpenVRTour,
    onToggleCompare,
    compareList,
    onEdit,
    onDelete,
    isLoading
  } = props;

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <PropertyCardSkeleton key={i} />)}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map(property => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          isSaved={savedPropertyIds.has(property.id)}
          isCompared={compareList.some(p => p.id === property.id)}
          isOwner={currentUser?.username === property.agent.name}
          onSaveToggle={onSaveToggle}
          onOpenCalculator={onOpenCalculator}
          onOpenTourModal={onOpenTourModal}
          onFindSimilar={onFindSimilar}
          onOpenDetailModal={onOpenDetailModal}
          onOpenVRTour={onOpenVRTour}
          onToggleCompare={onToggleCompare}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PropertyList;