"use client"
import { useMemo, useState } from "react"
import { useOrders } from "../hooks/useOrders"
import { useWebsocket } from "../hooks/useWebsocket"

type Tab = "Open Orders" | "Trade History"

const tabs: Tab[] = ["Open Orders", "Trade History"]
const openOrderColumns = ["Symbol", "Side", "Opening Price", "Quantity", "PnL", "Leverage", "Date", "Time", "Close"]
const tradeHistoryColoumns = ["Symbol", "Side", "Opening Price", "Quantity", "Closing Price", "PnL", "Close Type", "Date", "Time"]

export default function BottomBar() {
  const [activeTab, setActiveTab] = useState<Tab>("Open Orders");
  const { openOrders, closedOrders, closeOrderMutation } = useOrders();
  const { priceUpdate, positionUpdate, connected } = useWebsocket();

  const enrichedOpenOrders = useMemo(() => {
    return openOrders?.openPositions?.map((order: any) => {
      const symbol = order.symbol.toLowerCase();
      const livePrice = priceUpdate[symbol];
      const livePnL = positionUpdate[order.id]?.unrealizedPnL;

      let unrealizedPnL = 0;

      if (connected && livePrice) {
        const currentPrice = order.type === "LONG" ? livePrice.bid : livePrice.ask;
        unrealizedPnL = order.type === "LONG"
          ? (currentPrice - Number(order.openingPrice)) * Number(order.quantity)
          : (Number(order.openingPrice) - currentPrice) * Number(order.quantity);
      } 
      else if (livePnL) {
        unrealizedPnL = livePnL;
      }

      return {
        ...order,
        unrealizedPnL,
        currentPrice: livePrice
      };
    })
  },[openOrders, priceUpdate, positionUpdate, connected]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClose = (positionId: string) => {
    if (confirm("Are you sure you want to close this position?")) {
      closeOrderMutation.mutate({ positionId });
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden flex gap-6 px-6 pt-2 border-b border-gray-100 ">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm pb-3 border-b-2 transition-colors ${
              activeTab === tab
                ? "border-black text-black font-semibold"
                : "border-transparent text-black/70 font-normal"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Open Orders" && (
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {openOrderColumns.map((col) => (
                  <th key={col} className="px-6 py-4 text-center whitespace-nowrap font-light text-sm">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enrichedOpenOrders?.map((position: any) => (
                <tr key={position.id} className="whitespace-nowrap border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-center text-sm ">
                    {position.symbol.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className={position.type === "LONG" ? "text-green-700" : "text-red-600"}>
                      {position.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    $ {Number(position.openingPrice).toFixed(2)} 
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {Number(position.quantity).toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {connected ? (
                      <span className={Number(position.unrealizedPnL) >= 0 ? "text-green-700" : "text-red-600"}>
                       $ {Number(position.unrealizedPnL).toFixed(2)} 
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center justify-center gap-1">
                        ...
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {position.leverage}x
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {formatDate(position.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {formatTime(position.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleClose(position.id)}
                      disabled={closeOrderMutation.isPending}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-500"
                    >
                      {closeOrderMutation.isPending ? "Closing..." : "Close"}
                    </button>
                  </td>
                </tr>
              ))}
              {!enrichedOpenOrders?.length && ( 
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500">
                    No open positions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Trade History" && (
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {tradeHistoryColoumns.map((col) => (
                  <th key={col} className="px-6 py-4 text-center whitespace-nowrap text-sm font-normal">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {closedOrders?.closedPositions?.map((position: any) => (
                <tr key={position.id} className=" whitespace-nowrap border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-center text-sm">
                    {position.symbol.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className={position.type === "LONG" ? "text-green-700" : "text-red-600"}>
                      {position.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    $ {Number(position.openingPrice).toFixed(2)} 
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {Number(position.quantity).toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    $ {Number(position.closingPrice).toFixed(2)} 
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className={Number(position.pnl) >= 0 ? "text-green-700" : "text-red-600"}>
                      $ {Number(position.pnl).toFixed(2)} 
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm capitalize">
                    {position.closeType?.toLowerCase() || "manual"}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {formatDate(position.closedAt)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {formatTime(position.closedAt)}
                  </td>
                </tr>
              ))}
              {!closedOrders?.closedPositions?.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    No trade history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}