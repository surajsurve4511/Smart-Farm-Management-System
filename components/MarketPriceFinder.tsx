import React, { useState, useEffect, useCallback } from 'react';
import type { PriceRecord, Filters, Options, FilterCategory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// --- CONSTANTS ---
const API_KEY = "579b464db66ec23bdd000001d3350e57253042f35a8499746f7438b4";
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

// --- HELPER COMPONENTS ---

interface SelectDropdownProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  disabled?: boolean;
  loading?: boolean;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ label, value, onChange, options, disabled = false, loading = false }) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-neutral-700 capitalize">{label}</label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled || loading}
                className="p-2.5 border border-neutral-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition duration-150 ease-in-out disabled:bg-neutral-200 disabled:cursor-not-allowed"
            >
                <option value="">{loading ? t('marketFinder.loadingLabel', {label}) : t('marketFinder.selectLabel', {label})}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}

interface ResultCardProps {
  record: PriceRecord;
}

const ResultCard: React.FC<ResultCardProps> = ({ record }) => (
  <div className="bg-white rounded-xl shadow-lg p-5 border border-neutral-200 hover:shadow-xl hover:border-brand-green/40 transition-all duration-300">
    <div className="flex justify-between items-start mb-2">
      <h2 className="text-xl font-bold text-brand-green">{record.commodity} <span className="text-base font-medium text-neutral-600">({record.variety})</span></h2>
      <div className="text-sm bg-brand-green/10 text-brand-green font-semibold px-3 py-1 rounded-full">{record.grade}</div>
    </div>
    <p className="text-neutral-600 text-sm mb-4">{record.market}, {record.district}, {record.state}</p>
    
    <div className="grid grid-cols-3 gap-4 text-center border-t border-neutral-200 pt-4">
      <div>
        <p className="text-xs text-neutral-500">Min Price</p>
        <p className="font-semibold text-neutral-800">₹{record.min_price}</p>
      </div>
      <div>
        <p className="text-xs font-bold text-brand-green">Modal Price</p>
        <p className="font-bold text-xl text-brand-green">₹{record.modal_price}</p>
      </div>
      <div>
        <p className="text-xs text-neutral-500">Max Price</p>
        <p className="font-semibold text-neutral-800">₹{record.max_price}</p>
      </div>
    </div>
     <div className="text-center mt-3 text-xs text-neutral-400">
        Arrival Date: {record.arrival_date}
    </div>
  </div>
);

const Spinner: React.FC = () => (
    <svg className="animate-spin h-8 w-8 text-brand-green mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


// --- MAIN APP COMPONENT ---

export default function MarketPriceFinder() {
  const { t } = useLanguage();
  const initialFilters: Filters = {
    state: "",
    district: "",
    market: "",
    commodity: "",
    variety: "",
    grade: "",
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [options, setOptions] = useState<Options>({ state: [], district: [], market: [], commodity: [], variety: [], grade: [] });
  const [records, setRecords] = useState<PriceRecord[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState<Record<FilterCategory, boolean>>({ state: false, district: false, market: false, commodity: false, variety: false, grade: false });
  const [searchPerformed, setSearchPerformed] = useState(false);

  const filterOrder: FilterCategory[] = ['state', 'district', 'market', 'commodity', 'variety', 'grade'];

  const fetchOptions = useCallback(async (field: FilterCategory, currentFilters: Partial<Filters>): Promise<string[]> => {
    setDropdownLoading(prev => ({ ...prev, [field]: true }));
    const params = new URLSearchParams({
      "api-key": API_KEY,
      format: "json",
      limit: "1000", // Fetch a decent sample to get unique values
    });

    for (const key in currentFilters) {
        if (currentFilters[key as FilterCategory]) {
            // The state filter has a .keyword suffix in the API
            const filterKey = key === 'state' ? 'filters[state.keyword]' : `filters[${key}]`;
            params.append(filterKey, currentFilters[key as FilterCategory] as string);
        }
    }
    
    try {
      const url = `${BASE_URL}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const json = await res.json();
      const data: PriceRecord[] = json.records || [];
      const uniqueOptions = Array.from(new Set(data.map((d) => d[field]).filter(Boolean)));
      return uniqueOptions.sort();
    } catch (error) {
      console.error(`Failed to fetch options for ${field}:`, error);
      return [];
    } finally {
      setDropdownLoading(prev => ({ ...prev, [field]: false }));
    }
  }, []);

  // Effect to fetch initial states
  useEffect(() => {
    fetchOptions('state', {}).then(states => {
      setOptions(prev => ({ ...prev, state: states }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effects for dependent dropdowns
  useEffect(() => {
    if (filters.state) {
      fetchOptions('district', { state: filters.state }).then(districts => {
        setOptions(prev => ({ ...prev, district: districts }));
      });
    }
  }, [filters.state, fetchOptions]);

  useEffect(() => {
    if (filters.district) {
      fetchOptions('market', { state: filters.state, district: filters.district }).then(markets => {
        setOptions(prev => ({ ...prev, market: markets }));
      });
    }
  }, [filters.district, filters.state, fetchOptions]);

  useEffect(() => {
    if (filters.market) {
      fetchOptions('commodity', { state: filters.state, district: filters.district, market: filters.market }).then(commodities => {
        setOptions(prev => ({ ...prev, commodity: commodities }));
      });
    }
  }, [filters.market, filters.district, filters.state, fetchOptions]);

  useEffect(() => {
    if (filters.commodity) {
      fetchOptions('variety', { state: filters.state, district: filters.district, market: filters.market, commodity: filters.commodity }).then(varieties => {
        setOptions(prev => ({ ...prev, variety: varieties }));
      });
    }
  }, [filters.commodity, filters.market, filters.district, filters.state, fetchOptions]);
  
  useEffect(() => {
    if (filters.variety) {
      fetchOptions('grade', { ...filters }).then(grades => {
        setOptions(prev => ({ ...prev, grade: grades }));
      });
    }
  }, [filters.variety, filters.commodity, filters.market, filters.district, filters.state, fetchOptions]);

  const handleFilterChange = (field: FilterCategory, value: string) => {
    const newFilters = { ...filters, [field]: value };
    
    // Reset subsequent filters
    const currentIndex = filterOrder.indexOf(field);
    for (let i = currentIndex + 1; i < filterOrder.length; i++) {
        const nextField = filterOrder[i];
        newFilters[nextField] = "";
        setOptions(prev => ({...prev, [nextField]: []}));
    }

    setFilters(newFilters);
  };

  const handleSearch = async () => {
    setLoadingResults(true);
    setSearchPerformed(true);
    const params = new URLSearchParams({
      "api-key": API_KEY,
      format: "json",
      limit: "100",
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const filterKey = key === 'state' ? 'filters[state.keyword]' : `filters[${key}]`;
        params.append(filterKey, value);
      }
    });

    try {
        const url = `${BASE_URL}?${params.toString()}`;
        const res = await fetch(url);
        if(!res.ok) throw new Error(`API error: ${res.statusText}`);
        const json = await res.json();
        setRecords(json.records || []);
    } catch(error) {
        console.error("Failed to fetch price data:", error);
        setRecords([]);
    } finally {
        setLoadingResults(false);
    }
  };
  
  const isSearchDisabled = () => {
    // A user should at least select a commodity to search
    return !filters.commodity || loadingResults;
  };

  const downloadCSV = () => {
    if (records.length === 0) return;

    const headers: (keyof PriceRecord)[] = ['state', 'district', 'market', 'commodity', 'variety', 'grade', 'min_price', 'max_price', 'modal_price', 'arrival_date'];
    
    const sanitize = (value: string | null) => {
        if (value === null || value === undefined) return '""';
        const strValue = String(value);
        const escapedValue = strValue.replace(/"/g, '""');
        return `"${escapedValue}"`;
    };

    const headerRow = headers.map(h => `"${h}"`).join(',');
    const dataRows = records.map(record => 
        headers.map(header => sanitize(record[header])).join(',')
    );

    const csvContent = [headerRow, ...dataRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `market_prices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-full font-sans">
      <main className="space-y-8">
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-green">🌾 {t('marketFinder.title')}</h1>
            <p className="mt-2 text-lg text-neutral-600">{t('marketFinder.description')}</p>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterOrder.map((key, index) => {
                  const isEnabled = index === 0 || !!filters[filterOrder[index - 1]];
                  return (
                    <SelectDropdown
                      key={key}
                      label={key}
                      value={filters[key]}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      options={options[key]}
                      disabled={!isEnabled}
                      loading={dropdownLoading[key]}
                    />
                  );
                })}
            </div>
             <div className="mt-6 flex justify-center">
                <button
                    onClick={handleSearch}
                    disabled={isSearchDisabled()}
                    className="px-8 py-3 bg-brand-blue text-white font-bold rounded-lg shadow-md hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-transform transform hover:scale-105 disabled:bg-neutral-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loadingResults ? t('marketFinder.searching') : t('marketFinder.getPrices')}
                </button>
            </div>
        </div>

        <div>
            {loadingResults && <Spinner />}
            {!loadingResults && searchPerformed && records.length === 0 && (
                 <div className="text-center bg-white p-10 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-neutral-700">{t('marketFinder.noResultsTitle')}</h3>
                    <p className="text-neutral-500 mt-2">{t('marketFinder.noResultsDescription')}</p>
                </div>
            )}
            {!loadingResults && records.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-neutral-800">{t('marketFinder.results', { count: records.length })}</h2>
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-white border border-brand-green text-brand-green font-semibold rounded-lg shadow-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
                    >
                        {t('marketFinder.downloadCsv')}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {records.map((record, idx) => (
                    <ResultCard key={`${record.market}-${record.commodity}-${idx}`} record={record} />
                  ))}
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}