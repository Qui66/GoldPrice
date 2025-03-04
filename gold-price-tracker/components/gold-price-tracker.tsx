"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

// Mock data for gold prices
const generateMockData = (startPrice: number, days: number, isInternational: boolean) => {
  const data = []
  let currentPrice = startPrice

  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Add some random fluctuation
    const change = (Math.random() - 0.5) * (isInternational ? 20 : 2)
    currentPrice += change

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number(currentPrice.toFixed(2)),
    })
  }

  return data
}

// Generate data for international and domestic gold prices
const internationalGoldData = generateMockData(2000, 30, true)
const domesticGoldData = generateMockData(600, 30, false)

// Get current prices from the last data point
const currentInternationalPrice = internationalGoldData[internationalGoldData.length - 1].price
const previousInternationalPrice = internationalGoldData[internationalGoldData.length - 2].price
const internationalChange = Number((currentInternationalPrice - previousInternationalPrice).toFixed(2))

const currentDomesticPrice = domesticGoldData[domesticGoldData.length - 1].price
const previousDomesticPrice = domesticGoldData[domesticGoldData.length - 2].price
const domesticChange = Number((currentDomesticPrice - previousDomesticPrice).toFixed(2))

// Generate data for 5 major Chinese banks
const bankNames = ["中国工商银行", "中国农业银行", "中国银行", "中国建设银行", "交通银行"]
const bankData = bankNames.map((bank, index) => {
  // Slightly different base prices for each bank
  const basePrice = 605 + index * 2
  const data = generateMockData(basePrice, 30, false)

  // Get current price and change from the chart data
  const currentPrice = data[data.length - 1].price
  const previousPrice = data[data.length - 2].price
  const change = Number((currentPrice - previousPrice).toFixed(2))

  return {
    name: bank,
    currentPrice,
    change,
    data,
  }
})

// Generate data for gold shops
const shopNames = ["周大福", "周生生", "老凤祥", "中国黄金", "萃华金店"]
const shopData = shopNames.map((shop, index) => {
  // Gold shops usually have higher prices than banks
  const basePrice = 615 + index * 3
  const data = generateMockData(basePrice, 30, false)

  // Get current price and change from the chart data
  const currentPrice = data[data.length - 1].price
  const previousPrice = data[data.length - 2].price
  const change = Number((currentPrice - previousPrice).toFixed(2))

  return {
    name: shop,
    currentPrice,
    change,
    data,
  }
})

export default function GoldPriceTracker() {
  return (
    <div className="grid gap-6">
      {/* Top row - Main current prices */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>当前国际金价</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold">${currentInternationalPrice}</span>
              <span className="ml-2 text-sm text-muted-foreground">USD/盎司</span>
              <div className={`ml-4 flex items-center ${internationalChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {internationalChange >= 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                <span>{Math.abs(internationalChange)}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">最后更新: {new Date().toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>当前国内金价</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold">¥{currentDomesticPrice}</span>
              <span className="ml-2 text-sm text-muted-foreground">元/克</span>
              <div className={`ml-4 flex items-center ${domesticChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {domesticChange >= 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                <span>{Math.abs(domesticChange)}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">最后更新: {new Date().toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>国际金价走势图</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={internationalGoldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip formatter={(value) => [`$${value}`, "价格"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  name="国际金价"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>国内金价走势图</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={domesticGoldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip formatter={(value) => [`¥${value}`, "价格"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  name="国内金价"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bank section title */}
      <h2 className="text-2xl font-bold mt-4">中国五大银行投资金条价格</h2>

      {/* Bank prices */}
      <div className="grid gap-4 md:grid-cols-5">
        {bankData.map((bank, index) => (
          <Card key={`bank-${index}`}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">{bank.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">¥{bank.currentPrice}</span>
                <div className={`ml-2 flex items-center ${bank.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {bank.change >= 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  <span className="text-sm">{Math.abs(bank.change)}</span>
                </div>
              </div>
              <div className="h-[120px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bank.data}>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip formatter={(value) => [`¥${value}`, "价格"]} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gold shop section title */}
      <h2 className="text-2xl font-bold mt-4">黄金首饰店金价</h2>

      {/* Gold shop prices */}
      <div className="grid gap-4 md:grid-cols-5">
        {shopData.map((shop, index) => (
          <Card key={`shop-${index}`}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">{shop.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">¥{shop.currentPrice}</span>
                <div className={`ml-2 flex items-center ${shop.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {shop.change >= 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  <span className="text-sm">{Math.abs(shop.change)}</span>
                </div>
              </div>
              <div className="h-[120px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={shop.data}>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip formatter={(value) => [`¥${value}`, "价格"]} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

