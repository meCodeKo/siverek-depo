'use client';
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { inventoryService } from '@/services/inventoryService';
import { authService } from '@/services/authService';
import { CubeIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DashboardStats {
  totalItems: number;
  totalQuantity: number;
  lowStockCount: number;
  activeItems: number;
  inactiveItems: number;
  damagedItems: number;
  maintenanceItems: number;
}

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalQuantity: 0,
    lowStockCount: 0,
    activeItems: 0,
    inactiveItems: 0,
    damagedItems: 0,
    maintenanceItems: 0,
  });

  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Check authentication status
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (!isAuth) {
        router.push('/login');
      } else {
        try {
          // Load data if authenticated
          const statisticsData = await inventoryService.getInventoryStatistics();
          setStats(statisticsData);
          
          const lowStock = await inventoryService.getLowStockItems();
          setLowStockItems(lowStock.slice(0, 5)); // Son 5 düşük stok ürünü
        } catch (error) {
          console.error('Veri yüklenirken hata:', error);
        }
      }
    };
    
    loadData();
  }, [router]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, return null (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  const statCards = [
    {
      title: 'Toplam Ürün',
      value: stats.totalItems,
      icon: CubeIcon,
      color: 'bg-blue-500',
      description: 'Sisteme kayıtlı toplam ürün sayısı'
    },
    {
      title: 'Toplam Miktar',
      value: stats.totalQuantity,
      icon: ChartBarIcon,
      color: 'bg-green-500',
      description: 'Depodaki toplam ürün miktarı'
    },
    {
      title: 'Düşük Stok',
      value: stats.lowStockCount,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      description: 'Minimum stok seviyesinin altındaki ürünler'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Siverek Belediyesi Bilgi İşlem Müdürlüğü
          </h1>
          <p className="text-gray-600">
            Malzeme Stok Takip ve Yönetim Sistemi
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${card.color} p-3 rounded-md`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {card.value}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ürün Durumu */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ürün Durumu</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Aktif Ürünler</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {stats.activeItems}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pasif Ürünler</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {stats.inactiveItems}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hasarlı Ürünler</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {stats.damagedItems}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bakımda Ürünler</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {stats.maintenanceItems}
                </span>
              </div>
            </div>
          </div>

          {/* Düşük Stok Uyarıları */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Düşük Stok Uyarıları</h3>
              <Link 
                href="/inventory?filter=low-stock"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Tümünü Gör
              </Link>
            </div>
            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand} {item.model}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-xs text-gray-500">
                        Min: {item.minStockLevel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Düşük stok uyarısı yok
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/inventory/add"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Yeni Ürün Ekle
            </Link>
            <Link
              href="/transactions"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Stok Hareketleri
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Raporlar
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
