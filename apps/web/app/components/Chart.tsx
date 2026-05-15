"use client"
import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, UTCTimestamp } from "lightweight-charts";
import { Loader2 } from "lucide-react";


const SYMBOL_ICONS: Record<string, { base: string; label: string }> = {
  BTCUSDT: { base: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/btc.svg", label: "BTC" },
  SOLUSDT: { base: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/sol.svg", label: "SOL" },
  ETHUSDT: { base: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/eth.svg", label: "ETH" },
}

const USDT = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/usdt.svg"

const TIMEFRAMES = [
  { label: "5m",  interval: "5m" },
  { label: "30m", interval: "30m" },
  { label: "1H",  interval: "1h" },
  { label: "12H", interval: "12h" },
  { label: "1D",  interval: "1d" },
]

const Chart = ( {symbol} : { symbol : string}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const [interval, setInterval]   = useState("5m");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      autoSize: true,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
    })

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    })

    const loadHistory = async () => {
      try{
        const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=500`
        )
        const data = await res.json()
        const candles = data.map((k: any) => ({
          time: (k[0] / 1000) as UTCTimestamp,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }))
        candleSeries.setData(candles)
      }finally{
        setIsLoading(false)
      }
    }
    loadHistory()

    // Live updates
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
    )

    ws.onmessage = (event) => {
      const { k } = JSON.parse(event.data)
      candleSeries.update({
        time: (k.t / 1000) as UTCTimestamp,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      })
    }

    return () => {
      ws.close()
      chart.remove()
    }
  }, [symbol,interval])

  return (
    <div className="flex flex-col w-full h-full">
      { !isLoading ? (
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 ">

        <div className="flex  items-center gap-1.5  font-semibold  px-2 py-2 border border-gray-200 rounded-full">
          <span>{SYMBOL_ICONS[symbol]?.label}</span>
          <img src={SYMBOL_ICONS[symbol]?.base} width={18} height={18} className="rounded-full" />
          <span >/</span>
          <span >USDT</span>
          <img src={USDT} width={18} height={18} className="rounded-full" />
        </div>

        <div className="flex items-center gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.interval}
              onClick={() => setInterval(tf.interval)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                interval === tf.interval
                  ? "bg-black text-white font-semibold"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div> 
      ) : ( 
      <div className="flex items-center justify-center p-30">
         <Loader2 className="w-7 h-7 animate-spin text-gray-600" />
      </div>)
    }
    <div ref={chartRef} className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" />   
  </div>
  )
}

export default Chart