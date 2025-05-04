import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

import { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { 
  DollarSign, AlertCircle, AlertTriangle, 
  Package, Zap 
} from 'lucide-react'
import axios from 'axios'

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiration_date: string | null;
  date_added: string;
}

interface CategoryDistribution {
  [key: string]: number;
}

interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  nearExpiration: number;
  lowStock: number;
  categoryDistribution: CategoryDistribution;
  recentProducts: Product[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalValue: 0,
    nearExpiration: 0,
    lowStock: 0,
    categoryDistribution: {},
    recentProducts: []
  })
  
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const products: Product[] = productsRes.data
        const now = new Date().getTime()
        
        const calculatedStats: DashboardStats = {
          totalProducts: products.length,
          totalValue: products.reduce((sum: number, p: Product) => sum + (p.price * p.quantity), 0),
          nearExpiration: products.filter((p: Product) => 
            p.expiration_date && 
            (new Date(p.expiration_date).getTime() - now) < 30 * 86400000
          ).length,
          lowStock: products.filter((p: Product) => p.quantity < 10).length,
          categoryDistribution: products.reduce((acc: CategoryDistribution, p: Product) => {
            acc[p.category] = (acc[p.category] || 0) + 1
            return acc
          }, {}),
          recentProducts: products
            .sort((a: Product, b: Product) => 
              new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
            )
            .slice(0, 5)
        }

        setStats(calculatedStats)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [token])

  const categoryData = {
    labels: Object.keys(stats.categoryDistribution),
    datasets: [{
      label: 'Products by Category',
      data: Object.values(stats.categoryDistribution),
      backgroundColor: [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
      ],
      borderWidth: 0
    }]
  }

  const stockData = {
    labels: ['Low Stock (<10)', 'Adequate Stock'],
    datasets: [{
      data: [stats.lowStock, stats.totalProducts - stats.lowStock],
      backgroundColor: ['#ef4444', '#3b82f6'],
      borderWidth: 0
    }]
  }

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Overview</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Package className="h-6 w-6" />} 
          title="Total Products"
          value={stats.totalProducts}
          trend="+12% from last month"
        />
        <StatCard 
          icon={<DollarSign className="h-6 w-6" />}
          title="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          trend="Inventory worth"
        />
        <StatCard 
          icon={<AlertCircle className="h-6 w-6" />}
          title="Near Expiration"
          value={stats.nearExpiration}
          trend="Within next 30 days"
        />
        <StatCard 
          icon={<AlertTriangle className="h-6 w-6" />}
          title="Low Stock Items"
          value={stats.lowStock}
          trend="Needs restocking"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-muted/5 p-4 rounded-lg border border-muted">
          <h3 className="font-semibold mb-4">Category Distribution</h3>
          <div className="h-64">
            <Pie 
              data={categoryData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        
        <div className="bg-muted/5 p-4 rounded-lg border border-muted">
          <h3 className="font-semibold mb-4">Stock Overview</h3>
          <div className="h-64">
            <Bar 
              data={stockData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      <div className="bg-muted/5 p-4 rounded-lg border border-muted">
        <h3 className="font-semibold mb-4">Recently Added Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm border-b border-muted">
                <th className="pb-2">Product</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Expiration</th>
                <th className="pb-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProducts.map((product: Product) => (
                <tr key={product.id} className="border-b border-muted/10">
                  <td className="py-3">{product.name}</td>
                  <td className="py-3">{product.category}</td>
                  <td className="py-3">{product.quantity}</td>
                  <td className="py-3">
                    {product.expiration_date || 'N/A'}
                  </td>
                  <td className="py-3">
                    ${(product.price * product.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend: string;
}

const StatCard = ({ icon, title, value, trend }: StatCardProps) => (
  <div className="bg-muted/5 p-4 rounded-lg border border-muted">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </div>
      <div className="p-2 rounded-full bg-accent/10">{icon}</div>
    </div>
    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
      <span>{trend}</span>
    </div>
  </div>
)

export default Dashboard