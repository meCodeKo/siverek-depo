export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  serialNumber?: string;
  barcode?: string;
  quantity: number;
  minStockLevel: number;
  unit: string; // adet, kg, lt, etc.
  location: string; // depo konumu
  status: 'active' | 'inactive' | 'damaged' | 'maintenance';
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference?: string; // iş emri, fatura no vb.
  performedBy: string;
  createdAt: Date;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  building?: string;
  floor?: string;
  room?: string;
  shelf?: string;
  isActive: boolean;
}

export interface ReportFilter {
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  status?: string;
  location?: string;
  lowStock?: boolean;
}

export type ReportType = 
  | 'inventory-summary'
  | 'low-stock'
  | 'stock-movements'
  | 'item-details'
  | 'category-breakdown';