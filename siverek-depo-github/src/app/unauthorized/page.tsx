'use client';

import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Yetkisiz Erişim
        </h1>
        
        <p className="mt-4 text-lg text-gray-600">
          Bu sayfaya erişim yetkiniz bulunmamaktadır.
        </p>
        
        <p className="mt-2 text-sm text-gray-500">
          Bu işlemi gerçekleştirmek için gerekli yetkiye sahip değilsiniz. 
          Lütfen sistem yöneticinizle iletişime geçin.
        </p>
        
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
        
        <div className="mt-6 text-xs text-gray-400">
          <p>Hata Kodu: 403 - Forbidden</p>
          <p>Siverek Belediyesi Bilgi İşlem Müdürlüğü</p>
        </div>
      </div>
    </div>
  );
}