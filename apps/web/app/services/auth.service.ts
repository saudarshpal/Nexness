import { axiosCall } from "../lib/axios";
import { SignupRequest, SigninRequest, AuthResponse, User} from "../types/auth.type";


export const authService = {
    signup : async (name : string , email : string, password : string) : Promise<AuthResponse> => {
        const response = await axiosCall.post<AuthResponse>('/auth/signup',{name,email,password});
        return response.data ;
    },

    signin  : async(email : string, password : string) : Promise<AuthResponse> =>{
        const response = await axiosCall.post<AuthResponse>('/auth/signin',{email,password});
        return response.data ; 

    },

    logout : async() => {
        const response = await axiosCall.post('auth/logout')
        return response.data
    },

    getCurrentUser : async() : Promise<User> =>{
        const response = await axiosCall.get<{user : User}>('/auth/me');
        return response.data.user
    }
}