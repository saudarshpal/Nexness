import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { User, SignupRequest, SigninRequest} from "../types/auth.type";
import { authService } from "../services/auth.service";



export const useAuth = ()=>{

    const queryClient = useQueryClient();

    const {data : user , isLoading } = useQuery<User>({
        queryKey : ["user"],
        queryFn : authService.getCurrentUser,
        retry : false,
        staleTime : 5 * 60 * 1000,
    })

    const signupMutation = useMutation({
        mutationFn : ({name,email,password} : SignupRequest) => authService.signup(name,email,password),
        onSuccess : (data) => {
            queryClient.setQueryData(['user'],data.user);
        },
        onError : (error : any)=>{
            const errorMessage = error?.response?.data?.error ;
            console.log(errorMessage);
        }
    })

    const signinMutation = useMutation({
        mutationFn : ({email,password} : SigninRequest) => authService.signin(email,password),
        onSuccess : (data) =>{
            queryClient.setQueryData(['user'],data.user);
            
        },
        onError : (error : any)=>{
            const errorMessage = error?.response?.data?.error ;
            console.log(errorMessage);
        }
    })

    const logoutMutation = useMutation({
        mutationFn : () => authService.logout(),
        onSuccess : ()=>{
            queryClient.setQueryData(['user'],null);
            queryClient.invalidateQueries({queryKey : ['user']});
        },
        onError : (error : any)=>{
            const errorMessage = error?.response?.data?.error ;
            console.log(errorMessage);
        }
    })

    return {
        signupMutation,
        signinMutation,
        user,
        isLoading,
        isAuthenticated : !!user ,
        logoutMutation
    }
    
}