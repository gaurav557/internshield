import { redirect } from 'next/navigation'; import { getSession } from '@/lib/auth'; import Shell from '@/components/shell'; import Reports from '@/components/reports';
export default async function Page(){const user=await getSession();if(!user)redirect('/login');return <Shell user={user}><Reports role={user.role}/></Shell>}
