
import React from 'react';
import type { Property } from '../../../types';
import { PropertyStatus } from '../../../types';
import { EyeIcon, ChatBubbleLeftRightIcon, HeartIcon, PencilIcon, TrashIcon, Square2StackIcon, VrHeadsetIcon } from '../../icons/ActionIcons';
import { useCurrency } from '../../../contexts/CurrencyContext';

interface AgentPropertyCardProps {
  property: Property;
  isSelected: boolean;
  onSelect: (id: string, isSelected: boolean) => void;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const statusStyles: Record<PropertyStatus, string> = {
    [PropertyStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [PropertyStatus.PENDING]: 'bg-amber-100 text-amber-800',
    [PropertyStatus.DRAFT]: 'bg-slate-100 text-slate-800',
    [PropertyStatus.EXPIRED]: 'bg-red-100 text-red-800',
    [PropertyStatus.SOLD]: 'bg-blue-100 text-blue-800',
};

const AgentPropertyCard: React.FC<AgentPropertyCardProps> = ({ property, isSelected, onSelect, onEdit, onDelete }) => {
    const { formatCurrency } = useCurrency();
    const handleDuplicate = () => {
        alert(`Duplicating "${property.title}". (Feature simulation)`);
    };

  return (
    <div className={`bg-white rounded-lg shadow-sm transition-all flex flex-col sm:flex-row gap-4 p-4 ${isSelected ? 'ring-2 ring-brand-primary' : 'ring-1 ring-transparent'}`}>
        <div className="flex-shrink-0 flex sm:flex-col items-start gap-4">
            <input 
                type="checkbox" 
                checked={isSelected}
                onChange={(e) => onSelect(property.id, e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary mt-1"
            />
            <img src={property.images[0]} alt={property.title} className="w-full sm:w-24 md:w-32 h-48 sm:h-24 md:h-32 object-cover rounded-md flex-shrink-0" />
        </div>
        <div className="flex-grow flex flex-col justify-between">
            <div>
                 <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800 pr-2">{property.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {property.vrTourUrl && (
                            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2.5 py-1 text-xs font-bold rounded-full">
                                <VrHeadsetIcon className="w-4 h-4" />
                                <span>VR Tour</span>
                            </div>
                        )}
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[property.status]}`}>
                            {property.status}
                        </span>
                    </div>
                 </div>
                <p className="text-sm text-slate-500">{property.address.street}, {property.address.city}</p>
                <p className="text-sm font-semibold text-brand-dark mt-1">
                    {property.listingType === 'For Rent' 
                        ? `${formatCurrency(property.price)}/mo` 
                        : formatCurrency(property.price)}
                </p>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5" title="Views">
                        <EyeIcon className="w-5 h-5 text-slate-400"/>
                        <span className="font-medium">{property.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Inquiries">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-400"/>
                        <span className="font-medium">?</span> {/* No inquiries data on property object */}
                    </div>
                    <div className="flex items-center gap-1.5" title="Saves">
                        <HeartIcon className="w-5 h-5 text-slate-400"/>
                        <span className="font-medium">{property.saves}</span>
                    </div>
                </div>
                 <div className="flex items-center gap-1">
                    <button onClick={handleDuplicate} className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Duplicate"><Square2StackIcon className="w-5 h-5" /></button>
                    <button onClick={() => onEdit(property)} className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(property.id)} className="p-2 rounded-md hover:bg-red-50 text-red-500 hover:text-red-700" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AgentPropertyCard;
