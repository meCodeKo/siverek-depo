import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { 
  getInventoryItems, 
  getInventoryItem,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getStockTransactions, 
  addStockTransaction,
  getCategories,
  getLocations
} from '@/services/dbService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    switch (action) {
      case 'items':
        const items = await getInventoryItems();
        return NextResponse.json({
          success: true,
          data: items,
          timestamp: new Date().toISOString()
        });
        
      case 'transactions':
        const transactions = await getStockTransactions();
        return NextResponse.json({
          success: true,
          data: transactions,
          timestamp: new Date().toISOString()
        });
        
      case 'categories':
        const categories = await getCategories();
        console.log('API: Returning categories:', categories);
        return NextResponse.json({
          success: true,
          data: categories,
          timestamp: new Date().toISOString()
        });
        
      case 'locations':
        const locations = await getLocations();
        console.log('API: Returning locations:', locations);
        return NextResponse.json({
          success: true,
          data: locations,
          timestamp: new Date().toISOString()
        });
        
      default:
        // Return all data
        const allData = {
          items: await getInventoryItems(),
          transactions: await getStockTransactions(),
          categories: await getCategories(),
          locations: await getLocations()
        };
        return NextResponse.json({
          success: true,
          data: allData,
          timestamp: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Veri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    console.log('POST request received:', { action, data });
    
    switch (action) {
      case 'addItem':
        console.log('Adding new item:', data);
        const newItem = await addInventoryItem(data);
        
        if (newItem) {
          console.log('Item added successfully:', newItem);
          return NextResponse.json({
            success: true,
            message: 'Ürün başarıyla eklendi',
            data: newItem,
            timestamp: new Date().toISOString()
          });
        }
        console.error('Failed to save item');
        break;
        
      case 'addTransaction':
        const newTransaction = await addStockTransaction(data);
        
        if (newTransaction) {
          return NextResponse.json({
            success: true,
            message: 'İşlem başarıyla kaydedildi',
            data: newTransaction,
            timestamp: new Date().toISOString()
          });
        }
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(
      { success: false, error: 'İşlem başarısız' },
      { status: 500 }
    );
    
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Veri kaydedilirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    console.log('PUT request received:', { action, data });
    
    if (action === 'updateItem') {
      const { id, updates } = data;
      console.log('Updating item:', { id, updates });
      
      const updatedItem = await updateInventoryItem(id, updates);
      
      if (updatedItem) {
        return NextResponse.json({
          success: true,
          message: 'Ürün başarıyla güncellendi',
          data: updatedItem,
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Ürün bulunamadı' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'İşlem başarısız' },
      { status: 500 }
    );
    
  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Veri güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    console.log('DELETE request received:', { action, data });
    
    if (action === 'deleteItem') {
      const { itemId } = data;
      const success = await deleteInventoryItem(itemId);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Ürün başarıyla silindi',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'İşlem başarısız' },
      { status: 500 }
    );
    
  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Veri silinirken hata oluştu' },
      { status: 500 }
    );
  }
}
