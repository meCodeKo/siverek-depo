'use client';

import { useEffect, useState } from 'react';
import { inventoryService } from '@/services/inventoryService';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { InventoryItem, StockTransaction, ReportFilter } from '@/types/inventory';
import { 
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// jsPDF TypeScript tip tanımları için
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function ReportsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);

  const [filters, setFilters] = useState<ReportFilter>({
    dateFrom: undefined,
    dateTo: undefined,
    category: undefined,
    status: undefined,
    location: undefined,
    lowStock: false,
  });

  const [selectedReport, setSelectedReport] = useState<string>('inventory-summary');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Düşük stok ürünlerini ayrı olarak yükle
    const loadLowStockItems = async () => {
      try {
        const lowStock = await inventoryService.getLowStockItems();
        setLowStockItems(lowStock || []);
      } catch (error) {
        console.error('Düşük stok ürünleri yüklenirken hata:', error);
        setLowStockItems([]);
      }
    };
    
    if (!loading) {
      loadLowStockItems();
    }
  }, [loading]);

  const loadData = async () => {
    try {
      const inventoryItems = await inventoryService.getInventoryItems();
      const stockTransactions = await inventoryService.getStockTransactions();
      const categoriesData = await inventoryService.getCategories();
      const locationsData = await inventoryService.getLocations();
      
      setItems(inventoryItems || []);
      setTransactions(stockTransactions || []);
      setCategories(categoriesData || []);
      setLocations(locationsData || []);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      setItems([]);
      setTransactions([]);
      setCategories([]);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredItems = () => {
    let filtered = items;

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.location) {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    if (filters.lowStock) {
      filtered = filtered.filter(item => item.quantity <= item.minStockLevel);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.createdAt) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.createdAt) <= new Date(filters.dateTo!)
      );
    }

    return filtered;
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;

    if (filters.dateFrom) {
      filtered = filtered.filter(t => 
        new Date(t.createdAt) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => 
        new Date(t.createdAt) <= new Date(filters.dateTo!)
      );
    }

    return filtered;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : locationId;
  };

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Bilinmeyen Ürün';
  };

  const generateInventorySummaryData = () => {
    const filteredItems = getFilteredItems();
    
    return filteredItems.map(item => ({
      'Ürün Adı': item.name,
      'Kategori': getCategoryName(item.category),
      'Marka': item.brand,
      'Model': item.model,
      'Miktar': item.quantity,
      'Birim': item.unit,
      'Konum': getLocationName(item.location),
      'Durum': item.status === 'active' ? 'Aktif' : 
               item.status === 'inactive' ? 'Pasif' :
               item.status === 'damaged' ? 'Hasarlı' : 'Bakımda',
      'Son Güncelleme': format(new Date(item.updatedAt), 'dd.MM.yyyy', { locale: tr })
    }));
  };

  const generateLowStockData = async () => {
    const lowStockItems = await inventoryService.getLowStockItems();
    
    return lowStockItems.map(item => ({
      'Ürün Adı': item.name,
      'Kategori': getCategoryName(item.category),
      'Mevcut Miktar': item.quantity,
      'Minimum Seviye': item.minStockLevel,
      'Eksik Miktar': item.minStockLevel - item.quantity,
      'Birim': item.unit,
      'Konum': getLocationName(item.location)
    }));
  };

  const generateStockMovementsData = () => {
    const filteredTransactions = getFilteredTransactions();
    
    return filteredTransactions.map(transaction => ({
      'Tarih': format(new Date(transaction.createdAt), 'dd.MM.yyyy HH:mm', { locale: tr }),
      'Ürün': getItemName(transaction.itemId),
      'İşlem Tipi': transaction.type === 'in' ? 'Giriş' : 
                   transaction.type === 'out' ? 'Çıkış' : 'Düzeltme',
      'Miktar': transaction.quantity,
      'Önceki Miktar': transaction.previousQuantity,
      'Yeni Miktar': transaction.newQuantity,
      'Sebep': transaction.reason,
      'Yapan': transaction.performedBy,
      'Notlar': transaction.notes || ''
    }));
  };

  const generateCategoryBreakdownData = () => {
    const filteredItems = getFilteredItems();
    const categoryStats = categories.map(category => {
      const categoryItems = filteredItems.filter(item => item.category === category.id);
      const totalQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        'Kategori': category.name,
        'Ürün Sayısı': categoryItems.length,
        'Toplam Miktar': totalQuantity,
        'Ortalama Miktar': categoryItems.length > 0 ? (totalQuantity / categoryItems.length).toFixed(2) : '0'
      };
    });

    return categoryStats.filter(stat => stat['Ürün Sayısı'] > 0);
  };

  const exportToExcel = async () => {
    let data: any[] = [];
    let fileName = '';

    switch (selectedReport) {
      case 'inventory-summary':
        data = generateInventorySummaryData();
        fileName = 'stok-ozeti';
        break;
      case 'low-stock':
        data = await generateLowStockData();
        fileName = 'dusuk-stok-raporu';
        break;
      case 'stock-movements':
        data = generateStockMovementsData();
        fileName = 'stok-hareketleri';
        break;
      case 'category-breakdown':
        data = generateCategoryBreakdownData();
        fileName = 'kategori-analizi';
        break;
      default:
        data = generateInventorySummaryData();
        fileName = 'rapor';
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rapor');
    
    const today = format(new Date(), 'dd-MM-yyyy');
    XLSX.writeFile(wb, `${fileName}-${today}.xlsx`);
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // PDF başlığı
    doc.setFontSize(16);
    doc.text('Siverek Belediyesi - Stok Raporu', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Rapor Tarihi: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: tr })}`, 14, 32);
    
    let data: any[] = [];
    let columns: string[] = [];

    switch (selectedReport) {
      case 'inventory-summary':
        data = generateInventorySummaryData();
        columns = ['Ürün Adı', 'Kategori', 'Miktar', 'Birim', 'Konum', 'Durum'];
        break;
      case 'low-stock':
        data = await generateLowStockData();
        columns = ['Ürün Adı', 'Mevcut Miktar', 'Minimum Seviye', 'Eksik Miktar', 'Birim'];
        break;
      case 'stock-movements':
        data = generateStockMovementsData();
        columns = ['Tarih', 'Ürün', 'İşlem Tipi', 'Miktar', 'Sebep'];
        break;
      case 'category-breakdown':
        data = generateCategoryBreakdownData();
        columns = ['Kategori', 'Ürün Sayısı', 'Toplam Miktar', 'Ortalama Miktar'];
        break;
    }

    // Tabloyu sadece seçilen sütunlarla filtrele
    const tableData = data.map(row => 
      columns.map(col => row[col] || '')
    );

    // autoTable fonksiyonunu direkt kullan
    autoTable(doc, {
      head: [columns],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    const today = format(new Date(), 'dd-MM-yyyy');
    doc.save(`rapor-${today}.pdf`);
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'inventory-summary':
        const filteredItems = getFilteredItems();
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stok Özeti</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-blue-900">{filteredItems.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Toplam Miktar</p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredItems.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Toplam Miktar</p>
                <p className="text-2xl font-bold text-purple-900">
                  {filteredItems.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Düşük Stok</p>
                <p className="text-2xl font-bold text-red-900">
                  {filteredItems.filter(item => item.quantity <= item.minStockLevel).length}
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.slice(0, 10).map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryName(item.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getLocationName(item.location)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'active' ? 'bg-green-100 text-green-800' :
                          item.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          item.status === 'damaged' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'active' ? 'Aktif' :
                           item.status === 'inactive' ? 'Pasif' :
                           item.status === 'damaged' ? 'Hasarlı' : 'Bakımda'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length > 10 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  ... ve {filteredItems.length - 10} ürün daha. Tüm listeyi görmek için Excel'e aktarın.
                </p>
              )}
            </div>
          </div>
        );

      case 'low-stock':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Düşük Stok Raporu</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mevcut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eksik</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(lowStockItems) && lowStockItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.minStockLevel} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {item.minStockLevel - item.quantity} {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Rapor türü seçin.</p>
          </div>
        );
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
            <p className="mt-2 text-sm text-gray-700">
              Stok durumu ve hareketleri hakkında detaylı raporlar
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
              Excel'e Aktar
            </button>
            <button
              onClick={exportToPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentChartBarIcon className="-ml-1 mr-2 h-5 w-5" />
              PDF'e Aktar
            </button>
          </div>
        </div>

        {/* Report Selection and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rapor Türü
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="inventory-summary">Stok Özeti</option>
                <option value="low-stock">Düşük Stok Raporu</option>
                <option value="stock-movements">Stok Hareketleri</option>
                <option value="category-breakdown">Kategori Analizi</option>
              </select>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Filtreler</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={filters.dateFrom ? format(new Date(filters.dateFrom), 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateFrom: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={filters.dateTo ? format(new Date(filters.dateTo), 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateTo: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Tüm Kategoriler</option>
                  {Array.isArray(categories) && categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.location || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Tüm Konumlar</option>
                  {Array.isArray(locations) && locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lowStock"
                  checked={filters.lowStock}
                  onChange={(e) => setFilters(prev => ({ ...prev, lowStock: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="lowStock" className="ml-2 block text-sm text-gray-900">
                  Sadece düşük stok ürünleri
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        {renderReportContent()}
      </div>
    </DashboardLayout>
  );
}