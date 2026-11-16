'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type Theme = 'light'|'dark'; const Ctx = createContext<{theme:Theme;toggle:()=>void}>({theme:'light',toggle:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}) { const [theme,setTheme]=useState<Theme>('light'); useEffect(()=>{const saved=localStorage.getItem('internshield-theme') as Theme|null;const prefers=window.matchMedia('(prefers-color-scheme: dark)').matches;setTheme(saved|| (prefers?'dark':'light'));},[]); useEffect(()=>{document.documentElement.classList.toggle('dark',theme==='dark');localStorage.setItem('internshield-theme',theme);},[theme]); return <Ctx.Provider value={{theme,toggle:()=>setTheme(t=>t==='dark'?'light':'dark')}}>{children}</Ctx.Provider>; }
export const useTheme=()=>useContext(Ctx);
