import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { initialProperties } from '@/lib/properties';
import AdminDashboard from './admin-dashboard';

export const metadata = {
  title: 'Restora Admin · Real Estate Management',
  description: 'Manage luxury listings, property statuses, and client portfolio.',
};

export default async function AdminPage() {
  const authed = await isAdmin();
  if (!authed) {
    redirect('/admin/login');
  }

  return <AdminDashboard initialProperties={initialProperties} />;
}
