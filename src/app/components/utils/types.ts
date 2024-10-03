
export interface UserData {
    first_name:string;
    last_name:string;
    phone_number:string;
    email:string;
    password:string;
    role:string;
   
    
}

export interface RegistrationErrorResponse {
    error: string;
    details?:{
        field?: string;
        message?: string;
    };
}

export interface RegistrationSuccessResponse {
    message: string;
    users: UserData[];
}
export interface Performance{
    location: string;
    status:string;
}
// googlemaps.d.ts
interface Window {
    google: any;
  }
  
export interface PerformanceData {
  address?: string;
  latitude?: number;
  longitude?: number;
  id?: number;
  system_performance?: string;
  date_of_record: string;
  status: string;
}