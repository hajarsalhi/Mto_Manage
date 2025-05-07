import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Upload, FileText, Check, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import { uploadFileCSV } from "../../services/compensation.service.ts";


interface UploadResponse {
  success: boolean;
  message: string;
  totalRecords?: number;
  validRecords?: number;
  errors?: Array<{
    line: number;
    message: string;
  }>;
}

const UploadCompensations: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | null) => {
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file type
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      return;
    }

    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    validateAndSetFile(droppedFile);
  };

  const removeBOM = (file: File): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            let text = event.target?.result as string;

            // Remove BOM if present
            if (text.charCodeAt(0) === 0xFEFF) {
                text = text.substring(1);
            }

            // Convert back to Blob/File
            const blob = new Blob([text], { type: file.type });
            const cleanedFile = new File([blob], file.name, { type: file.type });

            resolve(cleanedFile);
        };

        reader.readAsText(file, "UTF-8");
    });
};
  

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadResult(null);

    const cleanedFile = await removeBOM(file);

    const formData = new FormData();
    formData.append('compensations.csv', cleanedFile);

    try {


      const response = await uploadFileCSV(formData);
      setSuccess("Compensation uploaded successfully.");;
      
      setUploadResult(response);
      
      // Clear file after successful upload
      if (response.success) {
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err: any) {
      console.error('Error uploading compensations:', err);
      
      if (err.response?.err?.message) {
        setError(err.response.err.message);
      } else {
        setError('Failed to upload compensations. Please try again.');
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/compensations')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Compensations
      </Button>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Compensations</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-start justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">File Requirements</h2>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800 mb-2">
              Please ensure your CSV file contains the following headers:
            </p>
            <code className="block bg-white p-2 rounded border border-blue-200 text-sm font-mono">
              référence, date d'envoi, id MTO, nom MTO, montant, fx rate, devise
            </code>
            <p className="text-sm text-blue-800 mt-2">
              The file should be in CSV format and not exceed 5MB in size.
            </p>
          </div>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${file ? 'bg-green-50 border-green-300' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <FileText className="h-12 w-12 text-green-500 mb-2" />
              <p className="font-medium text-green-700">{file.name}</p>
              <p className="text-sm text-green-600 mb-4">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleBrowseClick}
                  className="text-sm"
                >
                  Change File
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="font-medium mb-1">Drag and drop your CSV file here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <Button onClick={handleBrowseClick}>Browse Files</Button>
            </div>
          )}
        </div>
        
        {uploadResult && (
          <div className={`mt-6 p-4 rounded-md ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {uploadResult.success ? (
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              )}
              <div>
                <h3 className="font-medium">{uploadResult.message}</h3>
                
                {uploadResult.totalRecords && (
                  <p className="text-sm mt-1">
                    Processed {uploadResult.totalRecords} records, 
                    {uploadResult.validRecords} valid.
                  </p>
                )}
                
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Errors:</p>
                    <ul className="mt-1 text-sm space-y-1">
                      {uploadResult.errors.map((err, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-600">Line {err.line}:</span>
                          <span>{err.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {uploadResult.success && (
                  <div className="mt-4">
                    <Button 
                      onClick={() => navigate('/compensations')}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      View Compensations
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCompensations;
