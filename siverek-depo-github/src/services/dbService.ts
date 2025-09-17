import mongoose, { Schema, Document, Model } from 'mongoose';
import { InventoryItem, StockTransaction, Category, Location, User } from '@/types/inventory';

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/siverekdepo';

// Define schemas
interface IInventoryItem extends Document, Omit<InventoryItem, 'id'> {}
interface IStockTransaction extends Document, Omit<StockTransaction, 'id'> {}
interface ICategory extends Document, Omit<Category, 'id'> {}
interface ILocation extends Document, Omit<Location, 'id'> {}
interface IUser extends Document, Omit<User, 'id'> {}

const InventoryItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  serialNumber: { type: String },
  barcode: { type: String },
  quantity: { type: Number, required: true },
  minStockLevel: { type: Number, required: true },
  unit: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

const StockTransactionSchema = new Schema({
  itemId: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  reason: { type: String, required: true },
  performedBy: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, required: true }
});

const CategorySchema = new Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, required: true }
});

const LocationSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  building: { type: String },
  floor: { type: String },
  isActive: { type: Boolean, required: true }
});

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  lastLogin: { type: Date }
});

// Create models
let InventoryItemModel: Model<IInventoryItem>;
let StockTransactionModel: Model<IStockTransaction>;
let CategoryModel: Model<ICategory>;
let LocationModel: Model<ILocation>;
let UserModel: Model<IUser>;

// Database connection
export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Initialize models
    InventoryItemModel = mongoose.models.InventoryItem || mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
    StockTransactionModel = mongoose.models.StockTransaction || mongoose.model<IStockTransaction>('StockTransaction', StockTransactionSchema);
    CategoryModel = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
    LocationModel = mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
    UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
    
    // Initialize default data if empty
    await initializeDefaultData();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Initialize default data
async function initializeDefaultData() {
  try {
    // Check if categories exist
    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: 'Bilgisayar ve Donanım', isActive: true },
        { name: 'Ağ Ekipmanları', isActive: true },
        { name: 'Yazıcı ve Tarayıcı', isActive: true },
        { name: 'Yazılım ve Lisans', isActive: true },
        { name: 'Kablolar ve Aksesuarlar', isActive: true },
        { name: 'Güvenlik Sistemleri', isActive: true },
        { name: 'Yedek Parça', isActive: true }
      ];
      await CategoryModel.insertMany(defaultCategories);
      console.log('Default categories initialized');
    }
    
    // Check if locations exist
    const locationCount = await LocationModel.countDocuments();
    if (locationCount === 0) {
      const defaultLocations = [
        { 
          name: 'Ana Depo', 
          description: 'Bilgi İşlem Müdürlüğü Ana Deposu', 
          building: 'Belediye Binası', 
          floor: 'Zemin Kat', 
          isActive: true 
        },
        { 
          name: 'Yedek Parça Deposu', 
          description: 'Yedek parça ve aksesuarlar', 
          building: 'Belediye Binası', 
          floor: 'Zemin Kat', 
          isActive: true 
        },
        { 
          name: 'Arşiv Deposu', 
          description: 'Kullanılmayan ekipmanlar', 
          building: 'Belediye Binası', 
          floor: 'Bodrum', 
          isActive: true 
        }
      ];
      await LocationModel.insertMany(defaultLocations);
      console.log('Default locations initialized');
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
}

// Inventory Items
export async function getInventoryItems(): Promise<InventoryItem[]> {
  try {
    await connectToDatabase();
    const items = await InventoryItemModel.find({});
    return items.map(item => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      brand: item.brand,
      model: item.model,
      serialNumber: item.serialNumber,
      barcode: item.barcode,
      quantity: item.quantity,
      minStockLevel: item.minStockLevel,
      unit: item.unit,
      location: item.location,
      status: item.status,
      notes: item.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  } catch (error) {
    console.error('Error getting inventory items:', error);
    throw error;
  }
}

export async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  try {
    await connectToDatabase();
    const item = await InventoryItemModel.findById(id);
    if (!item) return null;
    
    return {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      brand: item.brand,
      model: item.model,
      serialNumber: item.serialNumber,
      barcode: item.barcode,
      quantity: item.quantity,
      minStockLevel: item.minStockLevel,
      unit: item.unit,
      location: item.location,
      status: item.status,
      notes: item.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  } catch (error) {
    console.error('Error getting inventory item:', error);
    throw error;
  }
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
  try {
    await connectToDatabase();
    const newItem = new InventoryItemModel({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedItem = await newItem.save();
    
    return {
      id: savedItem._id.toString(),
      name: savedItem.name,
      description: savedItem.description,
      category: savedItem.category,
      brand: savedItem.brand,
      model: savedItem.model,
      serialNumber: savedItem.serialNumber,
      barcode: savedItem.barcode,
      quantity: savedItem.quantity,
      minStockLevel: savedItem.minStockLevel,
      unit: savedItem.unit,
      location: savedItem.location,
      status: savedItem.status,
      notes: savedItem.notes,
      createdAt: savedItem.createdAt,
      updatedAt: savedItem.updatedAt
    };
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
  try {
    await connectToDatabase();
    const updatedItem = await InventoryItemModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedItem) return null;
    
    return {
      id: updatedItem._id.toString(),
      name: updatedItem.name,
      description: updatedItem.description,
      category: updatedItem.category,
      brand: updatedItem.brand,
      model: updatedItem.model,
      serialNumber: updatedItem.serialNumber,
      barcode: updatedItem.barcode,
      quantity: updatedItem.quantity,
      minStockLevel: updatedItem.minStockLevel,
      unit: updatedItem.unit,
      location: updatedItem.location,
      status: updatedItem.status,
      notes: updatedItem.notes,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt
    };
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  try {
    await connectToDatabase();
    const result = await InventoryItemModel.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}

// Stock Transactions
export async function getStockTransactions(): Promise<StockTransaction[]> {
  try {
    await connectToDatabase();
    const transactions = await StockTransactionModel.find({});
    return transactions.map(transaction => ({
      id: transaction._id.toString(),
      itemId: transaction.itemId,
      type: transaction.type,
      quantity: transaction.quantity,
      previousQuantity: transaction.previousQuantity,
      newQuantity: transaction.newQuantity,
      reason: transaction.reason,
      performedBy: transaction.performedBy,
      notes: transaction.notes,
      createdAt: transaction.createdAt
    }));
  } catch (error) {
    console.error('Error getting stock transactions:', error);
    throw error;
  }
}

export async function addStockTransaction(transaction: Omit<StockTransaction, 'id' | 'createdAt'>): Promise<StockTransaction> {
  try {
    await connectToDatabase();
    const newTransaction = new StockTransactionModel({
      ...transaction,
      createdAt: new Date()
    });
    
    const savedTransaction = await newTransaction.save();
    
    return {
      id: savedTransaction._id.toString(),
      itemId: savedTransaction.itemId,
      type: savedTransaction.type,
      quantity: savedTransaction.quantity,
      previousQuantity: savedTransaction.previousQuantity,
      newQuantity: savedTransaction.newQuantity,
      reason: savedTransaction.reason,
      performedBy: savedTransaction.performedBy,
      notes: savedTransaction.notes,
      createdAt: savedTransaction.createdAt
    };
  } catch (error) {
    console.error('Error adding stock transaction:', error);
    throw error;
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find({});
    return categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      isActive: category.isActive
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}

// Locations
export async function getLocations(): Promise<Location[]> {
  try {
    await connectToDatabase();
    const locations = await LocationModel.find({});
    return locations.map(location => ({
      id: location._id.toString(),
      name: location.name,
      description: location.description,
      building: location.building,
      floor: location.floor,
      isActive: location.isActive
    }));
  } catch (error) {
    console.error('Error getting locations:', error);
    throw error;
  }
}

// Users
export async function getUsers(): Promise<User[]> {
  try {
    await connectToDatabase();
    const users = await UserModel.find({});
    return users.map(user => ({
      id: user._id.toString(),
      username: user.username,
      password: user.password, // Note: In a real application, passwords should be hashed
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    await connectToDatabase();
    const user = await UserModel.findOne({ username });
    if (!user) return null;
    
    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password, // Note: In a real application, passwords should be hashed
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    };
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error;
  }
}