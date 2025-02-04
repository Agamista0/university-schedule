'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/db-status');
        const data = await response.json();
        setDbStatus(data);
      } catch (error) {
        setDbStatus({ status: 'error', message: 'Failed to check connection' });
      }
    };

    checkConnection();
  }, []);

  return (
    <>
      <h1>Hello World</h1>
      {dbStatus && (
        <div className={`p-4 ${dbStatus.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {dbStatus.message}
        </div>
      )}
    </>
  );
}