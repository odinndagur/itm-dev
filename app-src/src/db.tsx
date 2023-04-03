const getSignById = async (id: number) => {
    const signs = await window.promiseWorker.postMessage({
        type: 'sql',
        query: `
            SELECT sign.*,
            GROUP_CONCAT(distinct sign_video.rank || ':' || sign_video.video_id) as youtube_ids,
            GROUP_CONCAT(distinct efnisflokkur.text) as efnisflokkar,
            myndunarstadur,
            ordflokkur
            FROM sign
            JOIN sign_video
            ON sign.id = sign_video.sign_id
            JOIN sign_efnisflokkur
            ON sign_efnisflokkur.sign_id = sign.id
            JOIN efnisflokkur
            ON sign_efnisflokkur.efnisflokkur_id = efnisflokkur.id

            
            WHERE sign.id = ${id}
            GROUP BY sign.id
            `,
    } satisfies absurdSqlPromiseWorkerMessage)
    let sign = signs[0]
    sign['youtube_ids'] = sign['youtube_ids']
        .split(',')
        .sort((a: any, b: any) => {
            let rank1 = a.split(':')[0]
            let rank2 = b.split(':')[0]
            return rank1 - rank2
        })
        .map((video: any) => {
            return video.split(':')[1]
        })

    sign['efnisflokkar'] = sign['efnisflokkar'].split(',')
    console.log('getsignbyid')
    console.log(sign)
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
