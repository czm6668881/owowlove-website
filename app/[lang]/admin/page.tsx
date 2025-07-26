import { SettingsDisplay } from '@/components/admin/settings-display'

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome to the product management system</p>

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Admin dashboard loaded successfully!
        </div>
      </div>

      {/* Current Settings Display */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Settings</h2>
        <SettingsDisplay />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-3">Quick Links:</h2>
        <div className="space-y-2">
          <a href="products" className="block text-blue-600 hover:underline">📦 Product Management</a>
          <a href="products/new" className="block text-blue-600 hover:underline">➕ Add Product</a>
          <a href="categories" className="block text-blue-600 hover:underline">🏷️ Categories</a>
          <a href="settings" className="block text-blue-600 hover:underline">⚙️ Settings</a>
          <a href="debug" className="block text-blue-600 hover:underline">🔧 Debug Page</a>
        </div>
      </div>
    </div>
  )
}