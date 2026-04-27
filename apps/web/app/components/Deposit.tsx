"use client"
import { useState } from "react";
import { X } from "lucide-react";
import { useBalance } from "../hooks/useBalance";

interface DepositProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export default function Deposit({ isOpen, onClose, currentBalance }: DepositProps) {
  const [amount, setAmount] = useState("");
  const { depositBalance } = useBalance()

  if (!isOpen) return null;

  const presetAmounts = [100, 500, 1000, 5000, 10000];

  const parsedAmount = amount ? Number(parseFloat(amount)) : 0;

  const handleDeposit = async(e : React.FormEvent) => {
    try{
        const payload = {
            amount : parseFloat(amount)
        }
    await depositBalance.mutateAsync(payload);
    }catch(err){
        console.log("Deposit Failed")
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-sm shadow-xl">

        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <h2 className="text-md">Deposit Funds</h2>
          <button
            onClick={onClose}
          >
            <X className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-3 ">
            <p className="text-sm ">Current Balance</p>
            <p className="text-2xl font-semibold text-gray-900">
              $ {currentBalance}
            </p>

        <div>
            <label className="block text-sm mb-2">Enter Amount (USD)</label>
            <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 ">$</span>
            <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-md focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            </div>
        </div>

          <div>
            <p className="text-sm mb-2">Quick Select</p>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount((preset.toString()))}
                  className="py-2 px-3 border border-gray-200 rounded-lg text-sm hover:border-black hover:bg-gray-50 transition-all"
                >
                  $ {preset}
                </button>
              ))}
            </div>
          </div>

          {parsedAmount > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">New Balance</span>
                <span className="text-lg font-medium text-gray-900">
                    $ { (parseFloat(currentBalance.toString()) + parseFloat(parsedAmount.toString()))}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 border border-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 }
            className="flex-1 py-2.5 px-4 bg-black text-white rounded-lg hover:bg-black/90 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}