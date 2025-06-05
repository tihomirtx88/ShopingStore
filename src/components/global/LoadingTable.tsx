import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function LoadingTable({row=5}: {row?:number}) {
    const tableRows = Array.from({length: row}, (_,index) =>{
        return <div className='mb-4' key={index}>
           <Skeleton className='w-full h-8 rounded'/>
        </div>
    });
  return (
    <>
      {tableRows}
    </>
  )
}
