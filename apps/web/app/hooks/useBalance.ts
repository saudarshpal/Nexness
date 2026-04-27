import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { balanceService } from "../services/balance.service"
import { DepositRequest } from "../types/balance.type";
import toast from "react-hot-toast";

export const useBalance = () =>{

    const queryClient = useQueryClient();
    
    const { data }  =  useQuery({
        queryKey : ['balance'],
        queryFn : () => balanceService.getBalance(),
        staleTime : 10000,
        refetchInterval : 15000,
    });
    
    const depositBalance = useMutation({
        mutationFn : (amount : DepositRequest) => balanceService.deposit(amount),
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey :['balance']});
            queryClient.setQueryData(['balance'],data);
            toast.success("Deposit successfull!");
            
            
        },
        onError : (error : any)=>{
            console.log(error);
            toast.error("Deposit failed!");
        }
    });

    return {
        data,
        depositBalance
    }
}
