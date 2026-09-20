import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { Plot, AIImageAnalysis, NotificationType } from '../types';
import Modal from './Modal';
import { useData } from '../contexts/DataContext';
import { UploadIcon, CameraIcon, BrainCircuitIcon, AIServiceIcon, XCircleIcon } from './icons';
import CameraCapture from './CameraCapture';
import { useLanguage } from '../contexts/LanguageContext';

interface AddDailyLogModalProps {
  isOpen: boolean;
  plot: Plot | null;
  farmerId: string;
  onClose: () => void;
  analyzePlotImageWithAI: (imageDataBase64: string, mimeType: string) => Promise<AIImageAnalysis | null>;
  showNotification: (message: string, type: NotificationType) => void;
}

const AddDailyLogModal: React.FC<AddDailyLogModalProps> = ({ isOpen, plot, farmerId, onClose, analyzePlotImageWithAI, showNotification }) => {
    const { t } = useLanguage();
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [farmerNotes, setFarmerNotes] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState<AIImageAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addDailyPlotLog } = useData();

    useEffect(() => {
        // Reset state when modal is closed
        if (!isOpen) {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            setImages([]);
            setImagePreviews([]);
            setFarmerNotes('');
            setAiAnalysis(null);
            setIsAnalyzing(false);
            setIsSubmitting(false);
        }
    }, [isOpen, imagePreviews]);
    
    // Additional cleanup for object URLs on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        }
    }, [imagePreviews]);

    if (!plot) return null;

    const handleImageChange = async (files: FileList | null) => {
        if (!files) return;

        const newFiles: File[] = Array.from(files);
        const compressedFiles: File[] = [];

        showNotification(t('assistant.compressing'), NotificationType.INFO);

        for (const file of newFiles) {
            try {
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
                const compressedFile = await imageCompression(file, options);
                compressedFiles.push(compressedFile);
            } catch (error) {
                console.error('Image compression error:', error);
                showNotification(`Failed to compress ${file.name}.`, NotificationType.ERROR);
            }
        }

        setImages(prev => [...prev, ...compressedFiles]);
        const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };
    
    const handleCapture = (file: File) => {
        // Create a FileList-like object to pass to handleImageChange
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        handleImageChange(dataTransfer.files);
        setIsCameraOpen(false);
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]); // Revoke object URL
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleAnalyze = async () => {
        if (images.length === 0) {
            showNotification(t('modals.addDailyLog.imageRequired'), NotificationType.ERROR);
            return;
        }
        setIsAnalyzing(true);
        setAiAnalysis(null);

        const primaryImage = images[0];
        const reader = new FileReader();
        reader.readAsDataURL(primaryImage);
        reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            const analysisResult = await analyzePlotImageWithAI(base64Data, primaryImage.type);
            setAiAnalysis(analysisResult);
            setIsAnalyzing(false);
            if (analysisResult && !analysisResult.error) {
                showNotification(t('modals.addDailyLog.analysisComplete'), NotificationType.SUCCESS);
            }
        };
        reader.onerror = () => {
             showNotification('Failed to read image for analysis.', NotificationType.ERROR);
             setIsAnalyzing(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0 && !farmerNotes.trim()) {
            showNotification(t('modals.addDailyLog.addNoteOrPhoto'), NotificationType.ERROR);
            return;
        }

        setIsSubmitting(true);
        try {
            await addDailyPlotLog(
                plot.farmId,
                plot.id,
                {
                    photoFiles: images,
                    farmerNotes: farmerNotes.trim(),
                    aiAnalysis: aiAnalysis || undefined,
                },
                farmerId
            );
            showNotification(t('modals.addDailyLog.logAdded', { plotName: plot.name }), NotificationType.SUCCESS);
            onClose();
        } catch (error) {
            console.error('Failed to add daily log:', error);
            showNotification(t('modals.addDailyLog.logFailed'), NotificationType.ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={t('modals.addDailyLog.title', { plotName: plot.name })}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">{t('modals.addDailyLog.photos')}</label>
                        <div className="flex space-x-2">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 p-4 border-2 border-dashed border-neutral-300 rounded-md flex flex-col items-center justify-center text-neutral-500 hover:border-brand-blue hover:text-brand-blue transition">
                                <UploadIcon className="w-8 h-8"/>
                                <span className="text-xs mt-1">{t('modals.addDailyLog.upload')}</span>
                            </button>
                             <button type="button" onClick={() => setIsCameraOpen(true)} className="flex-1 p-4 border-2 border-dashed border-neutral-300 rounded-md flex flex-col items-center justify-center text-neutral-500 hover:border-brand-blue hover:text-brand-blue transition">
                                <CameraIcon className="w-8 h-8"/>
                                <span className="text-xs mt-1">{t('modals.addDailyLog.camera')}</span>
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={(e) => handleImageChange(e.target.files)} multiple accept="image/*" className="hidden" />
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img src={preview} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md"/>
                                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                                            <XCircleIcon className="w-4 h-4"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="farmer-notes" className="block text-sm font-medium text-neutral-700">{t('modals.addDailyLog.notes')}</label>
                        <textarea id="farmer-notes" value={farmerNotes} onChange={e => setFarmerNotes(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"></textarea>
                    </div>
                    
                    <div>
                        <button type="button" onClick={handleAnalyze} disabled={images.length === 0 || isAnalyzing || isSubmitting} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 disabled:opacity-50">
                            {isAnalyzing ? <><AIServiceIcon className="w-5 h-5 mr-2 animate-spin"/>{t('modals.addDailyLog.analyzing')}</> : <><BrainCircuitIcon className="w-5 h-5 mr-2"/>{t('modals.addDailyLog.runAI')}</>}
                        </button>
                        {aiAnalysis && (
                            <div className="mt-2 p-2 bg-neutral-100 rounded text-xs text-neutral-600 border">
                                <p><strong>{t('modals.addDailyLog.aiSummary')}</strong> {aiAnalysis.summary || 'Analysis complete.'}</p>
                                {aiAnalysis.error && <p className="text-red-500"><strong>{t('modals.addDailyLog.error')}</strong> {aiAnalysis.error}</p>}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200">{t('forms.buttons.cancel')}</button>
                        <button type="submit" disabled={isSubmitting || isAnalyzing} className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue/90 disabled:opacity-50 flex items-center">
                            {isSubmitting && <AIServiceIcon className="w-4 h-4 mr-2 animate-spin" />}
                            {isSubmitting ? t('modals.addDailyLog.saving') : t('modals.addDailyLog.save')}
                        </button>
                    </div>
                </form>
            </Modal>
            <CameraCapture 
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCapture}
                showNotification={showNotification}
            />
        </>
    );
};

export default AddDailyLogModal;