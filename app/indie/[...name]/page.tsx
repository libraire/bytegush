"use client"
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import FMTable, { FMPlayer } from "../../components/table"
import collection from "./collection"

export default function DynamicPage() {

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const name = searchParams.get('name')

    const [rows, setRows] = useState<FMPlayer[]>([]);
    const [category, setCategory] = useState<string>('');

    useEffect(() => {
        const key = pathname.substring(pathname.lastIndexOf('/') + 1);
        const category = collection.find((dict) => dict.key === key)
        setCategory(category?.name ?? '')
        const items = category?.rows.map((row, index) => {
            return {
                id: index,
                name: row.name,
                link: row.herf,
                caption: "",
                image: "",
                vote: "0"
            }
        }) ?? []
        setRows(items)

    }, [])

    return (
        <div className='w-full flex justify-center items-center mb-40 px-6'>

            <FMTable players={rows} category={category} like={(player: FMPlayer) => {

            }}
            />
        </div>
    )
}