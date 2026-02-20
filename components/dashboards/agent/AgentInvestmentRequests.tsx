
import React from 'react';
import type { InvestmentRequest } from '../../../types';
import { HandshakeIcon } from '../../icons/AgentDashboardIcons';
import { EnvelopeIcon } from '../../icons/ActionIcons';

interface AgentInvestmentRequestsProps {
  investmentRequests: InvestmentRequest[];
}

const AgentInvestmentRequests: React.FC<AgentInvestmentRequestsProps> = ({ investmentRequests }) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-slate-800">Investment Requests</h2>
      <p className="text-slate-500 mt-1">
        Opportunities from investors looking for properties.
      </p>

      <div className="mt-6 space-y-4">
        {investmentRequests.length > 0 ? (
          investmentRequests.map(req => (
            <div key={req.id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-dark">{req.investorUsername}</span>
                    <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(req.timestamp).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => window.location.href = `mailto:${req.investorUsername.toLowerCase().replace(' ', '.')}@example.com`}
                  className="bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  Contact Investor
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
                {req.requestDetails}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <HandshakeIcon className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700 mt-4">No Investment Requests Yet</h3>
            <p className="text-slate-500 mt-2">
              When investors submit requests for properties, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentInvestmentRequests;
