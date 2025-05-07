import axios from 'axios';

const API_URL = 'http://localhost:8081/api/compensation';

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

export interface ValidationResponse {
    success: boolean;
    message: string;
}


export const uploadFileCSV = async (formData: FormData): Promise<UploadResponse> => {
    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            params: {
                fileName
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            throw error.response.data;
        }
        throw new Error('Failed to upload file');
    }
};

export const validateCompensations = async (compensationIds : number[]): Promise<ValidationResponse> => {
    try{
        const response = await axios.post(`${API_URL}/validate`, {
            compensationIds
          });
        return response.data;
    }catch(error : any){
        console.error('Error validating compensations:', error);
    
        if (error.response?.data) {
          throw error.response.data;
        }
        
        throw {
          success: false,
          message: error.message || 'Failed to validate compensations'
        };
      }
    
};

export const getUploadedCompensations = async () => {
    const response = await axios.get(`${API_URL}/getTempComp`);
    console.log(response);
    return response.data;
};

export const getValidatedCompensations = async () => {
    const response = await axios.get(`${API_URL}/getValidComp`);
    console.log(response);
    return response.data;
};