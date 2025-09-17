import { InventoryItem, StockTransaction, Category, Location } from '@/types/inventory';
import { authService } from '@/services/authService';
import { v4 as uuidv4 } from 'uuid';

// API Base URL for production deployment
const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin
  : 'http://localhost:3000';

// LocalStorage keys for migration
const STORAGE_KEYS = {
  INVENTORY_ITEMS: 'siverek_inventory_items',
  STOCK_TRANSACTIONS: 'siverek_stock_transactions',
  CATEGORIES: 'siverek_categories',
  LOCATIONS: 'siverek_locations',
};

class InventoryService {
  private migrationCompleted = false;

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    if (typeof window === 'undefined') return;
    
    // Check if we need to migrate localStorage data
    await this.migrateLocalStorageData();
  }

  // Migration from localStorage to server
  private async migrateLocalStorageData() {
    if (this.migrationCompleted) return;
    
    try {
      const localItems = localStorage.getItem(STORAGE_KEYS.INVENTORY_ITEMS);
      const localTransactions = localStorage.getItem(STORAGE_KEYS.STOCK_TRANSACTIONS);
      
      if (localItems || localTransactions) {
        console.log('LocalStorage verisi bulundu, sunucuya aktarılıyor...');
        
        const items = localItems ? JSON.parse(localItems) : [];
        const transactions = localTransactions ? JSON.parse(localTransactions) : [];
        
        const response = await fetch(`${API_BASE_URL}/api/inventory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'importData',
            data: { items, transactions }
          })
        });
        
        if (response.ok) {
          console.log('Veriler başarıyla sunucuya aktarıldı');
          // Clear localStorage after successful migration
          localStorage.removeItem(STORAGE_KEYS.INVENTORY_ITEMS);
          localStorage.removeItem(STORAGE_KEYS.STOCK_TRANSACTIONS);
          this.migrationCompleted = true;
        }
      }
    } catch (error) {
      console.error('Migration hatası:', error);
    }
  }

  // API Helper methods
  private async apiCall(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API çağrısı başarısız');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const items = await this.getInventoryItems();
    return items.find(item => item.id === id);
  }

  // Inventory Items - Now using API
  async getInventoryItems(): Promise<InventoryItem[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await this.apiCall('/api/inventory?action=items');
      return response.data;
    } catch (error) {
      console.error('Envanter verileri yüklenirken hata:', error);
      return [];
    }
  }

  async addInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem | null> {
    // Yetki kontrolü
    if (!authService.hasPermission('inventory', 'create')) {
      throw new Error('Bu işlem için yetkiniz bulunmamaktadır.');
    }

    try {
      console.log('Ürün ekleme isteği:', item);
      const response = await this.apiCall('/api/inventory', {
        method: 'POST',
        body: JSON.stringify({
          action: 'addItem',
          data: item
        })
      });
      
      console.log('Ürün ekleme yanıtı:', response);
      
      // İlk stok girişi için transaction oluştur
      const currentUser = authService.getCurrentUser();
      await this.addStockTransaction({
        itemId: response.data.id,
        type: 'in',
        quantity: item.quantity,
        previousQuantity: 0,
        newQuantity: item.quantity,
        reason: 'İlk stok girişi',
        performedBy: currentUser?.fullName || 'Sistem',
        notes: 'Ürün ilk kez sisteme eklendi',
      });
      
      return response.data;
    } catch (error) {
      console.error('Ürün eklenirken hata:', error);
      throw error;
    }
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    // Yetki kontrolü
    if (!authService.hasPermission('inventory', 'update')) {
      throw new Error('Bu işlem için yetkiniz bulunmamaktadır.');
    }

    try {
      console.log('Ürün güncelleme isteği:', { id, updates });
      const response = await this.apiCall('/api/inventory', {
        method: 'PUT',
        body: JSON.stringify({
          action: 'updateItem',
          data: { id, updates }
        })
      });
      
      console.log('Ürün güncelleme yanıtı:', response);
      return response.data;
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      throw error;
    }
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    // Yetki kontrolü
    console.log('Silme işlemi yetki kontrolü yapılıyor...');
    if (!authService.hasPermission('inventory', 'delete')) {
      console.error('Yetki hatası: Inventory delete yetkisi yok');
      throw new Error('Bu işlem için yetkiniz bulunmamaktadır.');
    }
    console.log('Yetki kontrolü başarılı');

    try {
      console.log('API çağrısı yapılıyor, ID:', id);
      const response = await this.apiCall('/api/inventory', {
        method: 'DELETE',
        body: JSON.stringify({
          action: 'deleteItem',
          data: { itemId: id }
        })
      });
      
      console.log('Ürün başarıyla silindi, ID:', id);
      return true;
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
      throw error; // Error'u yukarı fırlat
    }
  }

  // Stock Transactions - Now using API
  async getStockTransactions(): Promise<StockTransaction[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await this.apiCall('/api/inventory?action=transactions');
      return response.data;
    } catch (error) {
      console.error('Transaction verileri yüklenirken hata:', error);
      return [];
    }
  }

  async addStockTransaction(transaction: Omit<StockTransaction, 'id' | 'createdAt'>): Promise<StockTransaction> {
    try {
      const response = await this.apiCall('/api/inventory', {
        method: 'POST',
        body: JSON.stringify({
          action: 'addTransaction',
          data: transaction
        })
      });
      
      return response.data;
    } catch (error) {
      console.error('Transaction kaydedilirken hata:', error);
      throw error;
    }
  }

  async getItemTransactions(itemId: string): Promise<StockTransaction[]> {
    const transactions = await this.getStockTransactions();
    return transactions
      .filter(transaction => transaction.itemId === itemId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateStock(itemId: string, quantity: number, type: 'in' | 'out' | 'adjustment', reason: string, notes?: string): Promise<boolean> {
    // Yetki kontrolü
    if (!authService.hasPermission('transactions', 'create')) {
      throw new Error('Bu işlem için yetkiniz bulunmamaktadır.');
    }

    try {
      const currentUser = authService.getCurrentUser();
      
      const response = await this.apiCall('/api/inventory', {
        method: 'PUT',
        body: JSON.stringify({
          action: 'updateStock',
          data: {
            itemId,
            quantity,
            type,
            reason,
            notes,
            performedBy: currentUser?.fullName || 'Bilinmeyen Kullanıcı'
          }
        })
      });
      
      return true;
    } catch (error) {
      console.error('Stok güncellenirken hata:', error);
      return false;
    }
  }

  // Categories - Now using API
  async getCategories(): Promise<Category[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      console.log('Fetching categories from API...');
      const response = await this.apiCall('/api/inventory?action=categories');
      console.log('Categories API response:', response);
      return response.data;
    } catch (error) {
      console.error('Kategori verileri yüklenirken hata:', error);
      return [];
    }
  }

  // Locations - Now using API
  async getLocations(): Promise<Location[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      console.log('Fetching locations from API...');
      const response = await this.apiCall('/api/inventory?action=locations');
      console.log('Locations API response:', response);
      return response.data;
    } catch (error) {
      console.error('Lokasyon verileri yüklenirken hata:', error);
      return [];
    }
  }

  // Search and Filter - Updated for async
  async searchInventoryItems(query: string): Promise<InventoryItem[]> {
    const items = await this.getInventoryItems();
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.brand.toLowerCase().includes(lowerQuery) ||
      item.model.toLowerCase().includes(lowerQuery) ||
      item.serialNumber?.toLowerCase().includes(lowerQuery) ||
      item.barcode?.toLowerCase().includes(lowerQuery)
    );
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    const items = await this.getInventoryItems();
    return items.filter(item => item.quantity <= item.minStockLevel);
  }

  async getItemsByCategory(categoryId: string): Promise<InventoryItem[]> {
    const items = await this.getInventoryItems();
    return items.filter(item => item.category === categoryId);
  }

  async getItemsByStatus(status: string): Promise<InventoryItem[]> {
    const items = await this.getInventoryItems();
    return items.filter(item => item.status === status);
  }

  // Statistics - Updated for async
  async getInventoryStatistics() {
    const items = await this.getInventoryItems();
    const lowStockItems = await this.getLowStockItems();
    
    return {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      lowStockCount: lowStockItems.length,
      activeItems: items.filter(item => item.status === 'active').length,
      inactiveItems: items.filter(item => item.status === 'inactive').length,
      damagedItems: items.filter(item => item.status === 'damaged').length,
      maintenanceItems: items.filter(item => item.status === 'maintenance').length,
    };
  }
}

export const inventoryService = new InventoryService();