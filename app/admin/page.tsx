import { redirect } from 'next/navigation'; import { getSession } from '@/lib/auth'; import Shell from '@/components/shell'; import Admin from '@/components/admin';
export default async function Page(){const user=await getSession();if(!user)redirect('/login');if(user.role!=='ADMIN')redirect('/dashboard');return <Shell user={user}><Admin/></Shell>}
