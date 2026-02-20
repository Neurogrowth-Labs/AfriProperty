
import React, { useState, useMemo } from 'react';
import type { Property, User } from '../../../types';
import { PropertyStatus } from '../../../types';
import AgentPropertyCard from './AgentPropertyCard';
import { SearchIcon } from '../../icons/SearchIcons';

interface AgentListingsManagementProps {
  user: User;
  allProperties: Property[];
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
}

const AgentListingsManagement: React.FC<AgentListingsManagementProps> = ({ user, allProperties, onEditProperty, onDeleteProperty }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'All'>('All');
    const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

    const userProperties = useMemo(() => {
        return allProperties.filter(p => p.agent.name === user.username);
    }, [allProperties, user.username]);

    const filteredProperties = useMemo(() => {
        return userProperties.filter(p => {
            const matchesSearch = searchTerm === '' || 
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.address.city.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [userProperties, searchTerm, statusFilter]);
    
    const handleSelectProperty = (id: string, isSelected: boolean) => {
        setSelectedProperties(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedProperties(new Set(filteredProperties.map(p => p.id)));
        } else {
            setSelectedProperties(new Set());
        }
    };
    
    const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
        alert(`Performing "${action}" on ${selectedProperties.size} selected properties. (Feature simulation)`);
        setSelectedProperties(new Set());
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-800">Listings Management</h2>
            <p className="text-slate-500 mt-1">View, edit, and manage all your properties.</p>

            {/* Filters and Actions */}
            <div className="my-6 p-4 bg-white rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | 'All')}
                        className="py-2 border border-slate-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="All">All Statuses</option>
                        {Object.values(PropertyStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button disabled={selectedProperties.size === 0} onClick={() => handleBulkAction('activate')} className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed">Activate</button>
                    <button disabled={selectedProperties.size === 0} onClick={() => handleBulkAction('deactivate')} className="px-4 py-2 text-sm font-semibold bg-slate-500 text-white rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed">Deactivate</button>
                    <button disabled={selectedProperties.size === 0} onClick={() => handleBulkAction('delete')} className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed">Delete</button>
                </div>
            </div>

            {/* Listings Grid */}
            {filteredProperties.length > 0 ? (
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="col-span-full bg-white p-3 rounded-md shadow-sm">
                         <label className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                             <input type="checkbox" onChange={handleSelectAll} checked={selectedProperties.size > 0 && selectedProperties.size === filteredProperties.length} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                             Select All ({selectedProperties.size} selected)
                         </label>
                    </div>
                    {filteredProperties.map(property => (
                        <AgentPropertyCard
                            key={property.id}
                            property={property}
                            isSelected={selectedProperties.has(property.id)}
                            onSelect={handleSelectProperty}
                            onEdit={onEditProperty}
                            onDelete={onDeleteProperty}
                        />
                    ))}
                 </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-700">No properties found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your filters or adding a new listing.</p>
                </div>
            )}
        </div>
    );
};

export default AgentListingsManagement;
