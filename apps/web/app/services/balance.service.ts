import { axiosCall } from "../lib/axios";
import {  BalanceResponse, DepositRequest } from "../types/balance.type";

export const  balanceService = {
    getBalance : async() : Promise<BalanceResponse> => {
        const response = await axiosCall('/balance/');
        return response.data ; 
    },

    deposit : async( amount : DepositRequest ) : Promise<BalanceResponse> => {
        const response = await axiosCall.post('/balance/deposit',amount)
        return response.data;
    }
}