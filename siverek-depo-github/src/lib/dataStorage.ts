import fs from 'fs';
import path from 'path';
import { InventoryItem, StockTransaction, Category, Location } from '@/types/inventory';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILES = {
  INVENTORY: path.join(DATA_DIR, 'inventory.json'),
  TRANSACTIONS: path.join(DATA_DIR, 'transactions.json'),
  CATEGORIES: path.join(DATA_DIR, 'categories.json'),
  LOCATIONS: path.join(DATA_DIR, 'locations.json'),
};

// Production environment check
function isProduction() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

// In-memory storage for production (server-side)
let memoryStorage = {
  inventory: [] as InventoryItem[],
  transactions: [] as StockTransaction[],
  categories: [] as Category[],
  locations: [] as Location[],
  initialized: false
};

// LocalStorage keys for client-side fallback
const STORAGE_KEYS = {
  INVENTORY: 'siverek_production_inventory',
  TRANSACTIONS: 'siverek_production_transactions', 
  CATEGORIES: 'siverek_production_categories',
  LOCATIONS: 'siverek_production_locations',
};

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
function readJSONFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeJSONFile<T>(filePath: string, data: T): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Inventory Items
export function getInventoryItems(): InventoryItem[] {
  // Her durumda dosya sistemini kullan
  const items = readJSONFile<InventoryItem[]>(FILES.INVENTORY, []);
  return items.map(item => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt)
  }));
}

export function saveInventoryItems(items: InventoryItem[]): boolean {
  // Her durumda dosya sistemine yaz
  return writeJSONFile(FILES.INVENTORY, items);
}

// Stock Transactions
export function getStockTransactions(): StockTransaction[] {
  // Her durumda dosya sistemini kullan
  const transactions = readJSONFile<StockTransaction[]>(FILES.TRANSACTIONS, []);
  return transactions.map(transaction => ({
    ...transaction,
    createdAt: new Date(transaction.createdAt)
  }));
}

export function saveStockTransactions(transactions: StockTransaction[]): boolean {
  // Her durumda dosya sistemine yaz
  return writeJSONFile(FILES.TRANSACTIONS, transactions);
}

// Categories
export function getCategories(): Category[] {
  // Her durumda dosya sistemini kullan
  return readJSONFile<Category[]>(FILES.CATEGORIES, getDefaultCategories());
}

export function saveCategories(categories: Category[]): boolean {
  // Her durumda dosya sistemine yaz
  return writeJSONFile(FILES.CATEGORIES, categories);
}

function getDefaultCategories(): Category[] {
  return [
    { id: '1', name: 'Bilgisayar ve Donanım', isActive: true },
    { id: '2', name: 'Ağ Ekipmanları', isActive: true },
    { id: '3', name: 'Yazıcı ve Tarayıcı', isActive: true },
    { id: '4', name: 'Yazılım ve Lisans', isActive: true },
    { id: '5', name: 'Kablolar ve Aksesuarlar', isActive: true },
    { id: '6', name: 'Güvenlik Sistemleri', isActive: true },
    { id: '7', name: 'Yedek Parça', isActive: true },
  ];
}

// Locations
export function getLocations(): Location[] {
  // Her durumda dosya sistemini kullan
  return readJSONFile<Location[]>(FILES.LOCATIONS, getDefaultLocations());
}

export function saveLocations(locations: Location[]): boolean {
  // Her durumda dosya sistemine yaz
  return writeJSONFile(FILES.LOCATIONS, locations);
}

function getDefaultLocations(): Location[] {
  return [
    { id: '1', name: 'Ana Depo', description: 'Bilgi İşlem Müdürlüğü Ana Deposu', building: 'Belediye Binası', floor: 'Zemin Kat', isActive: true },
    { id: '2', name: 'Yedek Parça Deposu', description: 'Yedek parça ve aksesuarlar', building: 'Belediye Binası', floor: 'Zemin Kat', isActive: true },
    { id: '3', name: 'Arşiv Deposu', description: 'Kullanılmayan ekipmanlar', building: 'Belediye Binası', floor: 'Bodrum', isActive: true },
  ];
}

// Initialize default data
export function initializeDefaultData() {
  if (isProduction()) {
    // Production: initialize localStorage if needed
    if (typeof window !== 'undefined') {
      // Initialize categories if they don't exist
      if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(getDefaultCategories()));
      }
      
      // Initialize locations if they don't exist
      if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(getDefaultLocations()));
      }
      
      // Initialize empty arrays if they don't exist
      if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify([]));
      }
      
      if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
      }
    }
    return;
  }
  
  // Development: use file system
  ensureDataDir();
  
  // Initialize categories if they don't exist
  if (!fs.existsSync(FILES.CATEGORIES)) {
    saveCategories(getDefaultCategories());
  }
  
  // Initialize locations if they don't exist
  if (!fs.existsSync(FILES.LOCATIONS)) {
    saveLocations(getDefaultLocations());
  }
  
  // Initialize empty inventory and transactions if they don't exist
  if (!fs.existsSync(FILES.INVENTORY)) {
    saveInventoryItems([]);
  }
  
  if (!fs.existsSync(FILES.TRANSACTIONS)) {
    saveStockTransactions([]);
  }
}