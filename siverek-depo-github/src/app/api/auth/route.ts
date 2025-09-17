import { NextRequest, NextResponse } from 'next/server';
import { 
  getUsers, 
  getUserByUsername,
  connectToDatabase
} from '@/services/dbService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'list':
        const users = await getUsers();
        return NextResponse.json({ success: true, data: users });
      
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { action, user } = await request.json();

    switch (action) {
      case 'login':
        const { username, password } = user;
        const dbUser = await getUserByUsername(username);
        
        if (dbUser && dbUser.password === password) {
          // In a real application, you would hash passwords and use proper authentication
          return NextResponse.json({ 
            success: true, 
            data: { 
              id: dbUser.id,
              username: dbUser.username,
              fullName: dbUser.fullName,
              role: dbUser.role,
              isActive: dbUser.isActive
            } 
          });
        } else {
          return NextResponse.json({ success: false, error: 'Geçersiz kullanıcı adı veya şifre' });
        }

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}