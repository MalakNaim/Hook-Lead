import { redirect } from 'next/navigation';

// Root route: redirect authenticated users to leads, unauthenticated users
// are caught by middleware and sent to /login before reaching here.
export default function RootPage() {
  redirect('/leads');
}
