'use client';

import { useEffect, useState, Suspense } from 'react';
import { inventoryService } from '@/services/inventoryService';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { InventoryItem } from '@/types/inventory';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function InventoryContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('Envanter sayfası yükleniyor...');
    loadData();
    
    // URL parametrelerini kontrol et
    const filter = searchParams?.get('filter');
    if (filter === 'low-stock') {
      loadLowStockItems();
    }
  }, [searchParams]);

  const loadLowStockItems = async () => {
    try {
      const lowStockItems = await inventoryService.getLowStockItems();
      setFilteredItems(lowStockItems);
    } catch (error) {
      console.error('Düşük stok ürünleri yüklenirken hata:', error);
    }
  };

  const loadData = async () => {
    try {
      console.log('Veri yükleniyor...');
      const inventoryItems = await inventoryService.getInventoryItems();
      const categoriesData = await inventoryService.getCategories();
      const locationsData = await inventoryService.getLocations();
      
      console.log('Yüklenen ürün sayısı:', inventoryItems.length);
      setItems(inventoryItems);
      setFilteredItems(inventoryItems);
      setCategories(categoriesData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterItems = async () => {
      let filtered = items;

      // Arama filtresi
      if (searchQuery) {
        filtered = await inventoryService.searchInventoryItems(searchQuery);
      }

      // Kategori filtresi
      if (selectedCategory) {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }

      // Durum filtresi
      if (selectedStatus) {
        filtered = filtered.filter(item => item.status === selectedStatus);
      }

      // Konum filtresi
      if (selectedLocation) {
        filtered = filtered.filter(item => item.location === selectedLocation);
      }

      setFilteredItems(filtered);
    };
    
    filterItems();
  }, [searchQuery, selectedCategory, selectedStatus, selectedLocation, items]);

  const handleDelete = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        console.log('Silme işlemi başlatılıyor, ID:', id);
        const success = await inventoryService.deleteInventoryItem(id);
        console.log('Silme işlemi sonucu:', success);
        
        if (success) {
          await loadData(); // Veriyi yeniden yükle
          alert('Ürün başarıyla silindi.');
        } else {
          alert('Ürün silinirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } catch (error) {
        console.error('Ürün silinirken hata:', error);
        alert(`Ürün silinirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aktif' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pasif' },
      damaged: { bg: 'bg-red-100', text: 'text-red-800', label: 'Hasarlı' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Bakımda' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : locationId;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stok Listesi</h1>
            <p className="mt-2 text-sm text-gray-700">
              Toplam {filteredItems.length} ürün listeleniyor
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/inventory/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Yeni Ürün Ekle
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Kategori Filtresi */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Kategoriler</option>
              {Array.isArray(categories) && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Durum Filtresi */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="damaged">Hasarlı</option>
              <option value="maintenance">Bakımda</option>
            </select>

            {/* Konum Filtresi */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Konumlar</option>
              {Array.isArray(locations) && locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredItems.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.brand} {item.model}
                            </p>
                          </div>
                          <div className="ml-4">
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Kategori: {getCategoryName(item.category)}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Konum: {getLocationName(item.location)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span className={`font-medium ${item.quantity <= item.minStockLevel ? 'text-red-600' : 'text-green-600'}`}>
                              {item.quantity} {item.unit}
                            </span>
                            {item.quantity <= item.minStockLevel && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Düşük Stok
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Link
                          href={`/inventory/${item.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Görüntüle"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/inventory/${item.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Düzenle"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Arama kriterlerinize uygun ürün bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <InventoryContent />
    </Suspense>
  );
}