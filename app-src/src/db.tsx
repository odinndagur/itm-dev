const getSignById = async (id: number) => {
    const signs = await window.promiseWorker.postMessage({
        type: 'sql',
        query: `select * from sign where id = ${id}`,
    } satisfies absurdSqlPromiseWorkerMessage)
    return signs[0]
}

const searchSigns = async (searchValue: string, collectionId?: number) => {
    const signs = await window.promiseWorker.postMessage({
        type: 'signSearch',
        query: searchValue,
        collectionId: collectionId,
    } satisfies absurdSqlPromiseWorkerMessage)
    return signs
}

const signSearchWithCollectionId = async (
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

const getCollectionById = async (
    searchValue: string,
    collectionId: number,
    limit?: number,
    offset?: number
) => {
    const signs = await window.promiseWorker.postMessage({
        type: 'getCollectionById',
        query: searchValue,
        collectionId: collectionId,
        signLimit: limit ?? undefined,
        signOffset: offset ?? undefined,
    } satisfies absurdSqlPromiseWorkerMessage)
    // console.log(signs)
    return signs
}

const checkSignInCollection = async ({
    sign_id,
    collection_id,
}: {
    sign_id: number
    collection_id: number
}) => {
    const res = await window.promiseWorker.postMessage({
        type: 'checkSignInCollection',
        query: {
            sign_id,
            collection_id,
        },
    } satisfies absurdSqlPromiseWorkerMessage)
    return res
}

export {
    getSignById,
    searchSigns,
    signSearchWithCollectionId,
    getCollectionById,
    checkSignInCollection,
}
