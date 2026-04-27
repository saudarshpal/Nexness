"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react"
import { queryClient } from "./lib/queryClient"
import { Toaster } from "react-hot-toast";


export const Providers = ({children} : {children : ReactNode}) =>{
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}