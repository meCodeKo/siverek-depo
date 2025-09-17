'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { inventoryService } from '@/services/inventoryService';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { InventoryItem } from '@/types/inventory';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function InventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      loadItemData(params.id as string);
      loadReferenceData();
    }
  }, [params?.id]);

  const loadItemData = async (itemId: string) => {
    try {
      const inventoryItem = await inventoryService.getInventoryItem(itemId);
      if (inventoryItem) {
        setItem(inventoryItem);
      } else {
        router.push('/inventory');
      }
    } catch (error) {
      console.error('Ürün bilgileri yüklenirken hata:', error);
      router.push('/inventory');
    } finally {
      setLoading(false);
    }
  };

  const loadReferenceData = async () => {
    try {
      const categoriesData = await inventoryService.getCategories();
      const locationsData = await inventoryService.getLocations();
      setCategories(categoriesData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Referans veriler yüklenirken hata:', error);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : locationId;
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      active: 'Aktif',
      inactive: 'Pasif',
      damaged: 'Hasarlı',
      maintenance: 'Bakımda'
    };
    return statusMap[status as keyof typeof statusMap] || status;
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!item) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aradığınız ürün bulunamadı veya silinmiş olabilir.
          </p>
          <div className="mt-6">
            <Link
              href="/inventory"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Stok Listesine Dön
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Link
              href="/inventory"
              className="mr-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Geri
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {item.brand} {item.model}
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href={`/inventory/${item.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Düzenle
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Ürün Adı</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Açıklama</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.description || 'Belirtilmemiş'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Kategori</dt>
                <dd className="mt-1 text-sm text-gray-900">{getCategoryName(item.category)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Marka</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.brand || 'Belirtilmemiş'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Model</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.model || 'Belirtilmemiş'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Seri No</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.serialNumber || 'Belirtilmemiş'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Durum</dt>
                <dd className="mt-1">{getStatusBadge(item.status)}</dd>
              </div>
            </dl>
          </div>

          {/* Stock Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stok Bilgileri</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Mevcut Miktar</dt>
                <dd className={`mt-1 text-lg font-semibold ${item.quantity <= item.minStockLevel ? 'text-red-600' : 'text-green-600'}`}>
                  {item.quantity} {item.unit}
                  {item.quantity <= item.minStockLevel && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Düşük Stok
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Minimum Stok Seviyesi</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.minStockLevel} {item.unit}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Birim</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.unit}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Konum</dt>
                <dd className="mt-1 text-sm text-gray-900">{getLocationName(item.location)}</dd>
              </div>
            </dl>
          </div>

          {/* System Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Bilgileri</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(item.createdAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Son Güncelleme</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(item.updatedAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ürün ID</dt>
                <dd className="mt-1 text-sm text-gray-500 font-mono">{item.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}