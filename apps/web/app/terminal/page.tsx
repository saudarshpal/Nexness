"use client"
import { Group, Panel, Separator  } from "react-resizable-panels";
import LiveTicker from "../components/LiveTicker";
import PositionCard from "../components/OrderCard";
import BottomBar from "../components/BottomBar";
import Chart from "../components/Chart";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import  { useRouter } from 'next/navigation';
import { useWebsocket } from "../hooks/useWebsocket";
import { useBalance } from "../hooks/useBalance";
import Deposit from "../components/Deposit";


const Terminal = () => {
    const { data, depositBalance } = useBalance();
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const router = useRouter();
    
    const { isAuthenticated, isLoading } = useAuth();
    useWebsocket();

    useEffect(() => {
        if( !isLoading && !isAuthenticated ){
            router.push('/signin')
        }
    },[isAuthenticated])

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-300 py-5  px-5 ">
                <span className="font-semibold text-2xl">
                    Nexness Terminal
                </span>
                <div className="flex justify-center text-center pl-35">
                    <span onClick={()=> router.push('/')} className="hover:text-gray-700 cursor-pointer">
                        Home
                    </span>
                </div>
                <div className="flex justify-between items-center ">
                    <span className="w-50"> Balance : $ {data?.balance ?? 0}</span>
                    <button 
                        onClick={() => setIsDepositOpen(true)}
                        className="bg-black text-white font-semibold rounded-full px-5 py-[6px] "
                    >
                        Deposit
                    </button>
                </div>
                <Deposit
                    isOpen={isDepositOpen}
                    onClose={() => setIsDepositOpen(false)}
                    currentBalance={data?.balance ?? 0}
                />
            </div>
            <Group orientation="horizontal">
                <Panel defaultSize="30%">
                    <LiveTicker></LiveTicker>
                </Panel>
                <Separator className="outline-none">
                    <div className="w-[3px] h-full bg-gray-200 " />
                </Separator>
                <Panel defaultSize={`70%`} minSize={`70%`}>
                    <Group orientation="vertical">
                        <Panel>
                            <Chart></Chart>
                        </Panel>
                        <Separator className="outline-none">
                            <div className="block h-[3px] bg-gray-200 " />
                        </Separator>
                        <Panel defaultSize="30%" minSize="11%" maxSize="100%">
                            <BottomBar></BottomBar>
                        </Panel>
                    </Group>
                </Panel>
                <Separator>
                    <div className="w-[3px] h-full bg-gray-200 " />
                </Separator>
                <div>
                    <PositionCard ></PositionCard>
                </div>
                
            </Group>
                
        
        </div>
    )
}

export default Terminal