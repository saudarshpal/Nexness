import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { balanceService } from "../services/balance.service"
import { DepositRequest } from "../types/balance.type";

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
        },
        onError : (error : any)=>{
            console.log(error);
        }
    });

    return {
        data,
        depositBalance
    }
}
