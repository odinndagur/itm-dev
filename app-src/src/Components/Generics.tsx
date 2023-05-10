import { MakeGenerics } from '@tanstack/react-location'

export type MyLocationGenerics = MakeGenerics<{
    Search: {
        page?: number
        query?: string
        scroll?: number
        lastSearch?: { page?: number; query?: string; scroll?: number }
        id?: number
    }
}>

export type SignGenerics = MakeGenerics<{
    LoaderData: {
        sign?: {
            id: string
            phrase: string
            videos: { rank: number; video_id: string }[]
            efnisflokkar: string[]
            related_signs: { phrase: string; id: number }[]
            myndunarstadur: string
            ordflokkur: string
        }
        user?: {
            id: number
            name: string
            collections: {
                id: number
                name: string
            }[]
        }
    }
}>
export type SignCollectionGenerics = MakeGenerics<{
    LoaderData: {
        signCollection?: {
            signs: {
                sign_id: number
                phrase: string
                youtube_id: string
                related_signs: string
                collection_id: number
                collection_name: string
                in_collection: boolean
            }[]
            totalPages: number
            totalSignCount: number
            offset: number
            limit: number
        }
    }
}>
