import { useCallback, useEffect, useRef, useState } from 'react'
const elementsPerPage = 200

function useSigns({ searchValue }) {
    const [isLoading, setIsLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [signs, setSigns] = useState<Signs>([])
    const [allSignsCount, setAllSignsCount] = useState(0)
    const didFetchInitialData = useRef(false)

    const [signOffset, setSignOffset] = useState(0)
    const [signLimit, setSignLimit] = useState(elementsPerPage)

    const [resetSigns, setResetSigns] = useState(true)

    const loadChunkOfData = useCallback(async () => {
        console.log(searchValue, 'yonettwhat')
        // if (isLoading) {
        //     console.log('isloading')
        //     return
        // }

        // setIsLoading(true)

        const pageNumber = signs.length / elementsPerPage
        const offset = searchValue === '' ? elementsPerPage * pageNumber : 0
        const limit = elementsPerPage

        // const offset = signOffset
        // const limit = signLimit

        window.promiseWorker
            .postMessage({
                type: 'signSearch',
                query: searchValue,
                signOffset: offset,
                signLimit: limit,
            } satisfies absurdSqlPromiseWorkerMessage)
            .then((signsData: Signs) => {
                console.log(signs)
                console.log({ signsdata: signsData })
                if (signsData.length < elementsPerPage) {
                    setHasNextPage(false)
                }
                // if (searchValue !== '') {
                //     setSigns([...signsData])
                //     setResetSigns(false)
                // } else {
                setSigns([...signsData])
                // }
            })
        // setIsLoading(false)
    }, [isLoading, signs])

    async function handleSearch(offset, limit) {
        const signs: Signs = window.promiseWorker.postMessage({
            type: 'signSearch',
            query: searchValue,
            signOffset: offset,
            signLimit: limit,
        } satisfies absurdSqlPromiseWorkerMessage)
        return signs
    }

    const checkIfSignLoaded = (index: number) => {
        return !hasNextPage || index < signs.length
    }

    useEffect(() => {
        // setIsLoading(false)
        // setSigns([])
        setSignOffset(0)
    }, [searchValue])

    useEffect(() => {
        // const msCount = 200
        // const timer = setTimeout(() => {
        if (!didFetchInitialData.current) {
            didFetchInitialData.current = true
            window.promiseWorker
                .postMessage({
                    type: 'sql',
                    query: 'select count(*) as allSignsCount from sign',
                } satisfies absurdSqlPromiseWorkerMessage)
                .then((res: any) => {
                    setAllSignsCount(res[0].allSignsCount)
                })
            loadChunkOfData()
        }
        // }, msCount)
        // console.log(allSignsCount)
        // return () => clearTimeout(timer)
    }, [loadChunkOfData])

    return {
        signs,
        loadChunkOfData,
        checkIfSignLoaded,
        allSignsCount,
    }
}

export default useSigns
