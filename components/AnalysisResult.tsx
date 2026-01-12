import React from 'react';
import { Analysis, HealthFinding, SeverityLevel, ConfidenceLevel } from '../types';
import { ShieldCheckIcon, BeakerIcon, LightBulbIcon, InfoIcon, TrendingUpIcon } from './icons';

interface FindingCardProps {
  finding: HealthFinding;
}

const severityConfig: Record<SeverityLevel, { color: string; label: string }> = {
    Low: { color: 'bg-green-100 text-green-800 border-green-300', label: 'Low' },
    Medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Medium' },
    High: { color: 'bg-orange-100 text-orange-800 border-orange-300', label: 'High' },
    Critical: { color: 'bg-red-100 text-red-800 border-red-300', label: 'Critical' },
};

const confidenceConfig: Record<ConfidenceLevel, { color: string; label: string }> = {
    Low: { color: 'bg-orange-100 text-orange-800', label: 'Low' },
    Medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
    High: { color: 'bg-green-100 text-green-800', label: 'High' },
};


const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
    const severity = severityConfig[finding.severity] || severityConfig.Low;
    const confidence = confidenceConfig[finding.confidence] || confidenceConfig.Low;

    return (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                <div>
                    <p className="text-xs text-neutral-500 font-medium">{finding.type}</p>
                    <h4 className="text-lg font-bold text-neutral-800">{finding.name}</h4>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0 text-xs font-semibold">
                    <span className={`px-2 py-1 rounded-full ${severity.color} border ${severity.color}`}>Severity: {severity.label}</span>
                    <span className={`px-2 py-1 rounded-full ${confidence.color}`}>Confidence: {confidence.label}</span>
                </div>
            </div>
            
            <p className="text-sm text-neutral-600 mb-4">{finding.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h5 className="font-semibold text-neutral-700 flex items-center mb-2"><BeakerIcon className="w-4 h-4 mr-1.5"/>Treatment</h5>
                    <div className="text-sm space-y-2">
                        <div>
                            <h6 className="font-medium text-neutral-600">Chemical</h6>
                            <ul className="list-disc list-inside ml-4 text-neutral-500">
                                {finding.treatment.chemical.length > 0 ? finding.treatment.chemical.map((t, i) => <li key={i}>{t}</li>) : <li>None suggested.</li>}
                            </ul>
                        </div>
                        <div>
                            <h6 className="font-medium text-neutral-600">Organic/Cultural</h6>
                             <ul className="list-disc list-inside ml-4 text-neutral-500">
                                {finding.treatment.organic.length > 0 ? finding.treatment.organic.map((t, i) => <li key={i}>{t}</li>) : <li>None suggested.</li>}
                            </ul>
                        </div>
                    </div>
                </div>
                 <div>
                    <h5 className="font-semibold text-neutral-700 flex items-center mb-2"><LightBulbIcon className="w-4 h-4 mr-1.5"/>Prevention</h5>
                    <ul className="list-disc list-inside ml-4 text-sm text-neutral-500 space-y-1">
                        {finding.prevention.length > 0 ? finding.prevention.map((p, i) => <li key={i}>{p}</li>) : <li>None suggested.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const AnalysisResult: React.FC<{ analysis: Analysis }> = ({ analysis }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overall Status */}
      <div className={`p-4 rounded-lg flex items-center ${analysis.isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-l-4`}>
        <ShieldCheckIcon className={`w-10 h-10 mr-4 flex-shrink-0 ${analysis.isHealthy ? 'text-green-500' : 'text-red-500'}`} />
        <div>
          <h2 className="text-xl font-bold text-neutral-800">{analysis.isHealthy ? "Plant Appears Healthy" : "Potential Issues Detected"}</h2>
          <p className="text-sm text-neutral-600">{analysis.findings.length} issue(s) found.</p>
        </div>
      </div>
      
      {/* Summary & Yield Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <h3 className="text-md font-semibold mb-2 flex items-center text-neutral-700"><InfoIcon className="w-5 h-5 mr-2 text-neutral-500" /> Summary</h3>
            <p className="text-sm text-neutral-600">{analysis.summary}</p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <h3 className="text-md font-semibold mb-2 flex items-center text-neutral-700"><TrendingUpIcon className="w-5 h-5 mr-2 text-neutral-500" /> Potential Yield Impact</h3>
            <p className="text-sm text-neutral-600">{analysis.yieldImpact || 'Not applicable'}</p>
        </div>
      </div>

      {/* Findings */}
      {analysis.findings.length > 0 && (
        <div>
            <h3 className="text-xl font-bold text-neutral-800 mb-3">Detected Issues</h3>
            <div className="space-y-4">
                {analysis.findings.map((finding, index) => (
                    <FindingCard key={index} finding={finding} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;