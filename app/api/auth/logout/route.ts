import { NextResponse } from 'next/server'; import { cookies } from 'next/headers';
export async function POST(){(await cookies()).delete('internshield_session');return NextResponse.json({ok:true});}
