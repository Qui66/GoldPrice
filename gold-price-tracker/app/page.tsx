import GoldPriceTracker from "@/components/gold-price-tracker"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">黄金价格查询</h1>
        <GoldPriceTracker />
      </div>
    </main>
  )
}

