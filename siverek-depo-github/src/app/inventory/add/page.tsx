'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { inventoryService } from '@/services/inventoryService';
import { InventoryItem, Category, Location } from '@/types/inventory';

export default function AddInventoryPage() {
  return (
    <ProtectedRoute requiredPermission={{ resource: 'inventory', action: 'create' }}>
      <AddInventoryContent />
    </ProtectedRoute>
  );
}

function AddInventoryContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    barcode: '',
    quantity: 0,
    minStockLevel: 0,
    unit: 'adet',
    location: '',
    status: 'active' as const,
    notes: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading categories and locations...');
        
        // Fallback kategoriler
        const fallbackCategories: Category[] = [
          { id: '1', name: 'Bilgisayar ve Donanım', isActive: true },
          { id: '2', name: 'Ağ Ekipmanları', isActive: true },
          { id: '3', name: 'Yazıcı ve Tarayıcı', isActive: true },
          { id: '4', name: 'Yazılım ve Lisans', isActive: true },
          { id: '5', name: 'Kablolar ve Aksesuarlar', isActive: true },
          { id: '6', name: 'Güvenlik Sistemleri', isActive: true },
          { id: '7', name: 'Yedek Parça', isActive: true }
        ];
        
        // Fallback konumlar
        const fallbackLocations: Location[] = [
          { id: '1', name: 'Ana Depo', description: 'Bilgi İşlem Müdürlüğü Ana Deposu', isActive: true },
          { id: '2', name: 'Yedek Parça Deposu', description: 'Yedek parça ve aksesuarlar', isActive: true },
          { id: '3', name: 'Arşiv Deposu', description: 'Kullanılmayan ekipmanlar', isActive: true }
        ];
        
        let categoriesData: Category[] = [];
        let locationsData: Location[] = [];
        
        try {
          categoriesData = await inventoryService.getCategories();
          console.log('Categories loaded from API:', categoriesData);
        } catch (error) {
          console.warn('API den kategori yüklenemedi, fallback kullanılıyor:', error);
          categoriesData = fallbackCategories;
        }
        
        try {
          locationsData = await inventoryService.getLocations();
          console.log('Locations loaded from API:', locationsData);
        } catch (error) {
          console.warn('API den konum yüklenemedi, fallback kullanılıyor:', error);
          locationsData = fallbackLocations;
        }
        
        // Eğer API'den veri gelmezse fallback kullan
        if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
          console.log('Using fallback categories');
          categoriesData = fallbackCategories;
        }
        
        if (!Array.isArray(locationsData) || locationsData.length === 0) {
          console.log('Using fallback locations');
          locationsData = fallbackLocations;
        }
        
        setCategories(categoriesData);
        setLocations(locationsData);
        
        console.log('Final categories state:', categoriesData);
        console.log('Final locations state:', locationsData);
      } catch (error) {
        console.error('Kategoriler ve konumlar yüklenirken hata:', error);
        // En son çare olarak boş array yerine fallback kullan
        setCategories([
          { id: '1', name: 'Bilgisayar ve Donanım', isActive: true },
          { id: '2', name: 'Ağ Ekipmanları', isActive: true }
        ]);
        setLocations([
          { id: '1', name: 'Ana Depo', description: 'Ana depo', isActive: true }
        ]);
      }
    };
    
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Form validation
      if (!formData.name || !formData.category || !formData.location) {
        alert('Lütfen zorunlu alanları doldurun.');
        return;
      }

      // Tarih dönüşümü - removed purchase date

      const newItem = await inventoryService.addInventoryItem({
        ...formData,
        serialNumber: formData.serialNumber || undefined,
        barcode: formData.barcode || undefined,
        notes: formData.notes || undefined,
      });

      if (newItem) {
        alert('Ürün başarıyla eklendi!');
        console.log('Yeni ürün eklendi:', newItem);
        // Sunucuya kaydedildiğini doğrula
        const allItems = await inventoryService.getInventoryItems();
        console.log('Toplam ürün sayısı:', allItems.length);
        router.push('/inventory');
      }
    } catch (error) {
      console.error('Ürün eklenirken hata:', error);
      alert('Ürün eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-lg font-medium text-gray-900 mb-6">Yeni Ürün Ekle</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temel Bilgiler */}
              <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ürün Adı *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kategori *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Kategori Seçin</option>
                      {Array.isArray(categories) && categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Marka
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Seri Numarası
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Barkod
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Stok Bilgileri */}
              <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stok Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mevcut Miktar
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Stok Seviyesi
                    </label>
                    <input
                      type="number"
                      name="minStockLevel"
                      value={formData.minStockLevel}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Birim
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="adet">Adet</option>
                      <option value="kg">Kilogram</option>
                      <option value="lt">Litre</option>
                      <option value="m">Metre</option>
                      <option value="paket">Paket</option>
                      <option value="kutu">Kutu</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Konum */}
              <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Konum</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Konum *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Konum Seçin</option>
                    {Array.isArray(locations) && locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Durum ve Notlar */}
              <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Durum ve Notlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Durum
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                      <option value="damaged">Hasarlı</option>
                      <option value="maintenance">Bakımda</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Notlar
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ürün hakkında ek bilgiler..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}