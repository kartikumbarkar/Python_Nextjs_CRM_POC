'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminTestPage() {
  const router = useRouter();

  useEffect(() => {
    // Direct check of localStorage
    const userData = localStorage.getItem('userData');
    console.log('Admin Test - userData:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Admin Test - parsed user:', user);
        console.log('Admin Test - is_superuser:', user.is_superuser);
        
        if (user.is_superuser) {
          alert('✅ You are an admin! is_superuser: true');
        } else {
          alert('❌ You are NOT an admin! is_superuser: false');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        alert('❌ Error parsing user data');
      }
    } else {
      alert('❌ No user data found');
    }
    
    // Go back to admin page
    setTimeout(() => {
      router.push('/admin');
    }, 3000);
  }, [router]);

  return (
    <div className="p-4">
      <h1>Admin Test Page</h1>
      <p>Checking your admin status...</p>
      <p>Check the browser console and alert for results.</p>
    </div>
  );
}