import { useCallback, useEffect, useRef, useState } from 'react'
import { query, signSearchWithCollectionId } from '../db'
const elementsPerPage = 300

function useSigns({ collection }) {
    const [isLoading, setIsLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [signs, setSigns] = useState<Signs>([])
    const [allSignsCount, setAllSignsCount] = useState(0)
    const didFetchInitialData = useRef(false)

    const loadChunkOfData = useCallback(async () => {
        console.log('yonettwhat')
        // if (isLoading) {
        //     console.log('isloading')
        //     return
        // }

        // setIsLoading(true)

        const pageNumber = signs.length / elementsPerPage
        // const offset = searchValue === '' ? elementsPerPage * pageNumber : 0
        const offset = elementsPerPage * pageNumber
        const limit = elementsPerPage

        signSearchWithCollectionId('', collection, limit, offset).then(
            (signsData: Signs) => {
                console.log({ signsdata: signsData })
                if (signsData.length < elementsPerPage) {
                    setHasNextPage(false)
                }
                // if (searchValue !== '') {
                //     setSigns([...signsData])
                //     setResetSigns(false)
                // } else {
                setSigns([...signs, ...signsData])
                // }
            }
        )
        // setIsLoading(false)
    }, [isLoading, signs])

    useEffect(() => {
        setSigns([])
    }, [collection])
    const checkIfSignLoaded = (index: number) => {
        return !hasNextPage || index < signs.length
    }

    useEffect(() => {
        if (!didFetchInitialData.current) {
            didFetchInitialData.current = true
                query('select count(*) as allSignsCount from sign').then((res: any) => {
                    setAllSignsCount(res[0].allSignsCount)
                })
            loadChunkOfData()
        }
    }, [loadChunkOfData])

    return {
        signs,
        loadChunkOfData,
        checkIfSignLoaded,
        allSignsCount,
    }
}

export default useSigns
