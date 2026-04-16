import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';

export interface UserWithRole {
  email: string;
  role: 'admin' | 'technician';
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }

    const userEmail = session.user.email?.trim().toLowerCase(); // Normalize email for robust comparison
    const userRole: 'admin' | 'technician' =
      userEmail === 'mundinet.sincelejo@gmail.com' ? 'admin' : 'technician';

    // Log for debugging purposes
    console.log(`User email: ${userEmail}, Assigned role: ${userRole}`);

    return {
      user: {
        email: userEmail,
        role: userRole,
      } as UserWithRole,
    };
  },
  component: AuthenticatedComponent,
});

function AuthenticatedComponent() {
  const { user } = Route.useRouteContext();
  return (
    <AppLayout user={user}>
      <Outlet />
    </AppLayout>
  );
}
