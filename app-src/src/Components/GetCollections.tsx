import { useQuery } from '@tanstack/react-query'
import { listDefaultCollections } from '../db'

export function GetCollections() {
    const { data: defaultCollections } = useQuery({
        queryFn: () => listDefaultCollections(),
        queryKey: ['default-collections'],
    })

    return <div>{JSON.stringify(defaultCollections)}</div>
}
