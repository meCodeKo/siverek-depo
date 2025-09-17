'use client';

import { useEffect, useState } from 'react';
import { inventoryService } from '@/services/inventoryService';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { StockTransaction, InventoryItem } from '@/types/inventory';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  AdjustmentsHorizontalIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<StockTransaction[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Stok güncelleme formu
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    itemId: '',
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reason: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allTransactions = await inventoryService.getStockTransactions();
      const allItems = await inventoryService.getInventoryItems();
      
      // Tarihe göre sırala (en yeni en üstte)
      const sortedTransactions = allTransactions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
      setItems(allItems);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = transactions;

    // Ürün filtresi
    if (selectedItem) {
      filtered = filtered.filter(t => t.itemId === selectedItem);
    }

    // İşlem tipi filtresi
    if (selectedType) {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Arama filtresi
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [selectedItem, selectedType, searchQuery, transactions]);

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Bilinmeyen Ürün';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowUpIcon className="h-5 w-5 text-green-600" />;
      case 'out':
        return <ArrowDownIcon className="h-5 w-5 text-red-600" />;
      case 'adjustment':
        return <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-green-100 text-green-800';
      case 'out':
        return 'bg-red-100 text-red-800';
      case 'adjustment':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'in':
        return 'Giriş';
      case 'out':
        return 'Çıkış';
      case 'adjustment':
        return 'Düzeltme';
      default:
        return 'Bilinmeyen';
    }
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateForm.itemId || !updateForm.reason) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const success = await inventoryService.updateStock(
      updateForm.itemId,
      updateForm.quantity,
      updateForm.type,
      updateForm.reason,
      updateForm.notes
    );

    if (success) {
      alert('Stok başarıyla güncellendi!');
      setShowUpdateForm(false);
      setUpdateForm({
        itemId: '',
        type: 'in',
        quantity: 0,
        reason: '',
        notes: '',
      });
      loadData(); // Veriyi yeniden yükle
    } else {
      alert('Stok güncellenirken bir hata oluştu. Lütfen girdiğiniz değerleri kontrol edin.');
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
            <h1 className="text-2xl font-bold text-gray-900">Stok Hareketleri</h1>
            <p className="mt-2 text-sm text-gray-700">
              Toplam {filteredTransactions.length} işlem listeleniyor
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowUpdateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowUpIcon className="-ml-1 mr-2 h-5 w-5" />
              Stok Güncelle
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arama */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="İşlem ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Ürün Filtresi */}
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Ürünler</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {/* İşlem Tipi Filtresi */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm İşlemler</option>
              <option value="in">Giriş</option>
              <option value="out">Çıkış</option>
              <option value="adjustment">Düzeltme</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredTransactions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <li key={transaction.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {getItemName(transaction.itemId)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.reason}
                          </p>
                          {transaction.notes && (
                            <p className="text-xs text-gray-400 mt-1">
                              {transaction.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionColor(transaction.type)}`}>
                            {getTransactionLabel(transaction.type)}
                          </span>
                          <p className="text-sm text-gray-900 mt-1">
                            {transaction.type === 'adjustment' 
                              ? `${transaction.previousQuantity} → ${transaction.newQuantity}`
                              : `${transaction.type === 'in' ? '+' : '-'}${Math.abs(transaction.quantity)}`
                            }
                          </p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>
                            {format(new Date(transaction.createdAt), 'dd MMM yyyy', { locale: tr })}
                          </p>
                          <p>
                            {format(new Date(transaction.createdAt), 'HH:mm')}
                          </p>
                          <p className="mt-1">
                            {transaction.performedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">İşlem bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Arama kriterlerinize uygun işlem bulunamadı.
              </p>
            </div>
          )}
        </div>

        {/* Stock Update Modal */}
        {showUpdateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stok Güncelle</h3>
                
                <form onSubmit={handleStockUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ürün *
                    </label>
                    <select
                      value={updateForm.itemId}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, itemId: e.target.value }))}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Ürün Seçin</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Mevcut: {item.quantity} {item.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      İşlem Tipi *
                    </label>
                    <select
                      value={updateForm.type}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="in">Giriş (+)</option>
                      <option value="out">Çıkış (-)</option>
                      <option value="adjustment">Düzeltme (=)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Miktar *
                    </label>
                    <input
                      type="number"
                      value={updateForm.quantity}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                      min="0"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {updateForm.type === 'adjustment' 
                        ? 'Yeni toplam miktar'
                        : `${updateForm.type === 'in' ? 'Eklenecek' : 'Çıkarılacak'} miktar`
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sebep *
                    </label>
                    <input
                      type="text"
                      value={updateForm.reason}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, reason: e.target.value }))}
                      required
                      placeholder="Örn: Yeni satın alma, kullanım, sayım düzeltmesi"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notlar
                    </label>
                    <textarea
                      value={updateForm.notes}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ek açıklamalar..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUpdateForm(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Güncelle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}