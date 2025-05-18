'use client'
import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function NavSEarch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [ search, setSearch] = useState(searchParams.get('search')?.toString() || '');

  const handleOnChange = useDebouncedCallback((value:string)=>{
     const params = new URLSearchParams(searchParams);
     if (value) {
      params.set('search',value);
     }else{
      params.delete('search');
     }
     replace(`/products?${params.toString()}`);
  },300);

  useEffect(()=>{
     if(!searchParams.get('search')){
      setSearch('');
     }
  },[searchParams.get('search')]);

  return (
    <Input
      type="search"
      placeholder="search product..."
      className="max-w-xs"
      style={{
        backgroundColor: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
      }}
      value={search}
      onChange={(e) => {
        setSearch(e.target.value)
        handleOnChange(e.target.value)
      }}
    />
  );
}
