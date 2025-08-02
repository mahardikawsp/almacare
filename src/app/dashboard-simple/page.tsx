export default function DashboardSimplePage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Simple Dashboard Test</h1>
                <p>If you can see this page, the routing is working correctly.</p>
                <a href="/dashboard" className="text-blue-500 underline">
                    Go to Real Dashboard
                </a>
            </div>
        </div>
    )
}