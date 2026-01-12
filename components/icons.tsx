import React from 'react';

export const UserIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
  </svg>
);

export const LocationIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.145Zm.5 0c-.238.062-.41.128-.5.128s-.262-.066-.504-.128L9.69 18.933ZM10 2.5a5.5 5.5 0 0 0-5.5 5.5c0 1.352.486 2.59 1.32 3.562l.005.007c.032.037.066.07.1.101l.005.007L10 17l4.07-4.829.007-.007.005-.007c.033-.03.065-.064.1-.101l.005-.007A5.496 5.496 0 0 0 15.5 8a5.5 5.5 0 0 0-5.5-5.5Z" clipRule="evenodd" />
  </svg>
);

export const LeafIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M15.03 3.03a.75.75 0 0 0-1.06 0l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72a.75.75 0 0 0 0-1.06ZM11.5 6.44a.75.75 0 0 0-1.06 0L2.12 14.77a.75.75 0 0 0 0 1.06L2.62 16.34a.75.75 0 0 0 .4.23H17.5a.75.75 0 0 0 .75-.75V8.06a.75.75 0 0 0-.22-.53l-6.5-6.5ZM3.97 14.5l6.47-6.47 1.06-1.06V9.5h2.56l-3.62 3.62a.75.75 0 0 0-.22.53v2.85H3.97Z" />
    <path d="m6.81 16 1.06 1.06a.75.75 0 0 0 1.06 0l1.94-1.94a.75.75 0 1 0-1.06-1.06L8.75 15.12V12.5a.75.75 0 0 0-1.5 0v3.5Z" />
 </svg>
);

export const CalendarIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0 .69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
  </svg>
);

export const CameraIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
  </svg>
);

export const PencilIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
  </svg>
);

export const PlusCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const FarmIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M11.25 3.25A2.25 2.25 0 0 0 9 1H7.25A2.25 2.25 0 0 0 5 3.25V4.75h6.25V3.25Z" />
    <path fillRule="evenodd" d="M3.75 6A2.25 2.25 0 0 0 1.5 8.25v7.5A2.25 2.25 0 0 0 3.75 18h12.5A2.25 2.25 0 0 0 18.5 15.75v-7.5A2.25 2.25 0 0 0 16.25 6H3.75ZM2.25 8.25A.75.75 0 0 1 3 7.5h14a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75v-7.5Z" clipRule="evenodd" />
    <path d="M 8 12.75 a .75 .75 0 0 1 .75-.75 h 2.5 a .75 .75 0 0 1 0 1.5 H 8.75 a .75 .75 0 0 1-.75-.75 Z m -3 0 a .75 .75 0 0 1 .75-.75 h .5 a .75 .75 0 0 1 0 1.5 h-.5 a .75 .75 0 0 1-.75-.75 Z m 6 0 a .75 .75 0 0 1 .75-.75 h .5 a .75 .75 0 0 1 0 1.5 h-.5 a .75 .75 0 0 1-.75-.75 Z" />
  </svg>
);

export const PlotIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M4.25 4.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25Z" />
    <path d="M4.25 8.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25Z" />
    <path d="M4.25 12.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25Z" />
  </svg>
);

export const InfoIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
  </svg>
);

export const ActivityLogIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2Z" />
    <path fillRule="evenodd" d="M8.5 4.5a.5.5 0 0 0-1 0v3.25a.25.25 0 0 0 .25.25h3.5a.5.5 0 0 0 0-1h-2.75V4.5ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-6.5 4a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z" clipRule="evenodd" />
  </svg>
);

export const DashboardIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M11.25 3.25A1.75 1.75 0 0 0 9.5 5v10A1.75 1.75 0 0 0 11.25 16.75h5.5A1.75 1.75 0 0 0 18.5 15V5A1.75 1.75 0 0 0 16.75 3.25h-5.5ZM10.5 5A.5.5 0 0 1 11 4.75h5.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-5.5a.5.5 0 0 1-.5-.5V5Z" clipRule="evenodd" />
    <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h2A1.5 1.5 0 0 1 7 5.5v9A1.5 1.5 0 0 1 5.5 16h-2A1.5 1.5 0 0 1 2 14.5v-9Z" />
  </svg>
);

export const SettingsIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M11.078 2.25c-.217.065-.437.145-.654.245-.218.1-.433.217-.645.345a1.5 1.5 0 0 1-1.562 0 11.12 11.12 0 0 0-1.298-.59 1.5 1.5 0 0 1-.95 2.593 11.25 11.25 0 0 0-.244 1.323 1.5 1.5 0 0 1 2.592.95c.18-.086.362-.168.547-.245a11.122 11.122 0 0 0 1.298.59 1.5 1.5 0 0 1 0 1.562 11.12 11.12 0 0 0-.547.245 1.5 1.5 0 0 1-2.592.95c.03.468.08.932.146 1.388a1.5 1.5 0 0 1-2.593.95 11.12 11.12 0 0 0-1.298-.59 1.5 1.5 0 0 1-1.562 0 11.12 11.12 0 0 0-1.298.59 1.5 1.5 0 0 1-.95-2.593 11.25 11.25 0 0 0-.146-1.388 1.5 1.5 0 0 1 2.593-.95c.18.086.362.168.547.245a11.121 11.121 0 0 0 1.298-.59 1.5 1.5 0 0 1 0-1.562 11.12 11.12 0 0 0-.547-.245 1.5 1.5 0 0 1-2.593-.95c.066-.456.115-.915.146-1.388a1.5 1.5 0 0 1 2.593-.95 11.12 11.12 0 0 0 1.298.59 1.5 1.5 0 0 1 1.562 0Zm-2.628 8.05a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Z" clipRule="evenodd" />
    <path d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
  </svg>
);

export const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

export const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

export const LogoutIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-1.047a.75.75 0 1 1 1.06-1.06l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06L16.296 10.75H6.75A.75.75 0 0 1 6 10Z" clipRule="evenodd" />
  </svg>
);

export const MapIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M11.64 2.232a.75.75 0 0 1 .52.22l4.5 4.5a.75.75 0 0 1-.52 1.28H11.5a.75.75 0 0 1-.75-.75V2.5a.75.75 0 0 1 .89-.718ZM9.75 4.5a.75.75 0 0 0-1.5 0v11a.75.75 0 0 0 1.5 0v-11ZM6 5.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 6 5.25ZM2.25 8.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);
export const GlobeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm12.3-3.645.025.033A5.25 5.25 0 0 1 15.25 10c0 .356-.035.706-.102 1.047l-1.22-.305a4.01 4.01 0 0 0 .122-1.042 4 4 0 0 0-.124-1.285L14.3 6.355ZM10 15.25a5.23 5.23 0 0 0 3.844-1.636l-.993-.992a4 4 0 0 1-5.702 0l-.993.992A5.23 5.23 0 0 0 10 15.25Zm0-10.5a5.23 5.23 0 0 0-3.844 1.636l.993.992a4 4 0 0 1 5.702 0l.993-.992A5.23 5.23 0 0 0 10 4.75ZM4.94 11.047A5.25 5.25 0 0 1 4.75 10c0-.356.035-.706.102-1.047l1.22.305a4.01 4.01 0 0 0-.122 1.042 4 4 0 0 0 .124 1.285l-1.222.305Z" clipRule="evenodd" />
  </svg>
);
export const AIServiceIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.898 20.648 16.5 21.75l-.398-1.102a3.375 3.375 0 0 0-2.455-2.456L12.75 18l1.102-.398a3.375 3.375 0 0 0 2.455-2.456L16.5 14.25l.398 1.102a3.375 3.375 0 0 0 2.456 2.455L20.25 18l-1.102.398a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);
export const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);
export const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);
export const BrainCircuitIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a.75.75 0 0 0 .75-.75V11.25a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 .75.75Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H18.75Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75a.75.75 0 0 0 .75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008a.75.75 0 0 0-.75.75v.008Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 5.25a.75.75 0 0 0 .75.75h.008a.75.75 0 0 0 .75-.75V5.25a.75.75 0 0 0-.75-.75h-.008a.75.75 0 0 0-.75.75v.008Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 18.75a.75.75 0 0 0 .75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H8.25a.75.75 0 0 0-.75.75v.008Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5.25a.75.75 0 0 0 .75.75h.008a.75.75 0 0 0 .75-.75V5.25a.75.75 0 0 0-.75-.75H8.25a.75.75 0 0 0-.75.75v.008Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75H5.25a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H5.25Z" />
  </svg>
);
export const MarketIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
      <path d="M11.25 3.25A2.25 2.25 0 0 0 9 1H7.25A2.25 2.25 0 0 0 5 3.25V4.75h6.25V3.25Z" />
      <path fillRule="evenodd" d="M3.75 6A2.25 2.25 0 0 0 1.5 8.25v7.5A2.25 2.25 0 0 0 3.75 18h12.5A2.25 2.25 0 0 0 18.5 15.75v-7.5A2.25 2.25 0 0 0 16.25 6H3.75ZM2.25 8.25A.75.75 0 0 1 3 7.5h14a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V9h-11v1.25a.75.75 0 0 1-1.5 0V8.25ZM9.25 10.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm-3 0a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm6 0a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);
export const SunIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
      <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 4.343a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM6.464 13.536a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM4.25 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4.25 10ZM13.536 6.464a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM4.343 15.657a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Z" />
    </svg>
);
export const ShieldCheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
);
export const MicrophoneIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
      <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
      <path d="M5.5 8.5a.5.5 0 0 1 .5.5v1a4 4 0 0 0 8 0v-1a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V17.5a.5.5 0 0 1-1 0v-2.025A5 5 0 0 1 4.5 9.5v-1a.5.5 0 0 1 .5-.5Z" />
    </svg>
);
export const VideoCameraIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path fillRule="evenodd" d="M1.5 6.5A.5.5 0 0 1 2 6h16a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7ZM2.502 7.342a.5.5 0 0 1 .655-.333l2.57 1.285a.5.5 0 0 1 0 .812l-2.57 1.285a.5.5 0 0 1-.655-.333V7.342Zm14.996 0v5.316a.5.5 0 0 1-.655.333L14.273 11.7a.5.5 0 0 1 0-.812l2.57-1.285a.5.5 0 0 1 .655.333Z" clipRule="evenodd" />
  </svg>
);
// FIX: Add missing icons
export const WindIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M3.5 5.75c0-1.063.29-1.95.81-2.691L3.98 2.73C3.3 3.684 3 4.654 3 5.75c0 1.933 1.567 3.5 3.5 3.5h10a.75.75 0 0 0 0-1.5H6.5a2 2 0 0 1-2-2c0-.651.31-1.222.784-1.595L4.854 3.73A3.482 3.482 0 0 0 3.5 5.75ZM15.5 11a2 2 0 0 1 2 2c0 1.063-.29 1.95-.81 2.691l.33.33c.69-.954 1.04-1.924 1.04-3.021 0-1.933-1.567-3.5-3.5-3.5h-10a.75.75 0 0 0 0 1.5h10Z" />
  </svg>
);

export const DropletIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M10 19c-3.866 0-7-3.134-7-7 0-4.172 4.44-9.282 6.36-11.23a.75.75 0 0 1 1.28 0C12.56 2.718 17 7.828 17 12c0 3.866-3.134 7-7 7Z" />
  </svg>
);

export const LightBulbIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M10 2a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2Z"/>
    <path fillRule="evenodd" d="M8.22 4.22a.75.75 0 0 1 1.06 0l.09.09a4.5 4.5 0 0 1 2.38 3.86v.28a.75.75 0 0 1-1.5 0v-.28a3 3 0 0 0-1.99-2.72l-.09-.06a.75.75 0 0 1 0-1.06l.09-.09ZM5.5 8.75a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75ZM13.75 9.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Z" clipRule="evenodd"/>
    <path d="M8.25 15.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75Z"/>
  </svg>
);

export const TrendingUpIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M2.5 14.5a.75.75 0 0 1 0-1.5h1.25a.75.75 0 0 1 0 1.5H2.5Z"/>
    <path d="m4.33 6.22 2.22 2.22a.75.75 0 0 0 1.06 0l2.22-2.22a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 0 1-1.06 1.06l-3.5-3.5a.75.75 0 0 0-1.06 0L9.47 8.53a.75.75 0 0 1-1.06 0L6.19 6.31a.75.75 0 0 0-1.06 0l-2.22 2.22a.75.75 0 0 1-1.06-1.06l2.22-2.22a.75.75 0 0 1 1.06 0Z"/>
  </svg>
);

export const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M15.25 3.007a.75.75 0 0 1 .75.75v12.486a.75.75 0 0 1-1.5 0V3.757a.75.75 0 0 1 .75-.75Z" />
    <path d="M10 5.257a.75.75 0 0 1 .75.75v10.236a.75.75 0 0 1-1.5 0V6.007a.75.75 0 0 1 .75-.75Z" />
    <path d="M4.75 8.257a.75.75 0 0 1 .75.75v7.236a.75.75 0 0 1-1.5 0V9.007a.75.75 0 0 1 .75-.75Z" />
  </svg>
);

export const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

export const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
  </svg>
);

export const BeakerIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M3.25 2.75A.75.75 0 0 0 2.5 3.5v9.5A4.25 4.25 0 0 0 6.75 17h6.5A4.25 4.25 0 0 0 17.5 13V3.5a.75.75 0 0 0-.75-.75h-13.5Zm1.5 1.5v5.03a2.742 2.742 0 0 0 .998 2.057 2.75 2.75 0 0 0 4.103 0 2.742 2.742 0 0 0 .998-2.057V4.25H4.75ZM11 11.28A2.742 2.742 0 0 0 12.002 9.22V4.25h3.248v4.97a2.742 2.742 0 0 0-1.002 2.057 2.75 2.75 0 0 0 0 1.085c.01.03.018.06.028.09a3.003 3.003 0 0 1-3.236-1.325A2.76 2.76 0 0 0 11 11.28Z" clipRule="evenodd" />
  </svg>
);

export const WelcomeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M10 2c-1.717 0-3.417.345-5.025.975A.75.75 0 0 0 4.25 3.75v12.5a.75.75 0 0 0 .725.748 8.955 8.955 0 0 0 10.052 0 .75.75 0 0 0 .723-.748V3.75a.75.75 0 0 0-.725-.775A14.242 14.242 0 0 0 10 2Z" clipRule="evenodd"/>
    </svg>
);