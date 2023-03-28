const getSignById = async (id: number) => {
    const signs = await window.promiseWorker.postMessage({
        type: 'sql',
        query: `select * from sign where id = ${id}`,
    } satisfies absurdSqlPromiseWorkerMessage)
    return signs[0]
}

const searchSigns = async (searchValue: string) => {
    const signs = await window.promiseWorker.postMessage({
        type: 'signSearch',
        query: searchValue,
    } satisfies absurdSqlPromiseWorkerMessage)
    return signs
}

const searchSignsWithCollectionId = async (
    searchValue: string,
    collectionId: number,
    limit?: number,
    offset?: number
) => {
    const signs = await window.promiseWorker.postMessage({
        type: 'signSearchWithCollectionId',
        query: searchValue,
        collectionId: collectionId,
        signLimit: limit ?? undefined,
        signOffset: offset ?? undefined,
    } satisfies absurdSqlPromiseWorkerMessage)
    // console.log(signs)
    return signs
}

export { getSignById, searchSigns, searchSignsWithCollectionId }
