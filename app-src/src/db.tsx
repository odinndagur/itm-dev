const query = async (query:string) => {
    const result = await window.promiseWorker.postMessage({type:'sql',query:query})
    return result
}

const exec = async (query:string) => {
    window.promiseWorker.postMessage({type:'exec',query:query})
}

//@ts-ignore
const addSignToCollection = async ({signId, collectionId}) => {
    exec(`insert into sign_collection(sign_id, collection_id) values(${signId},${collectionId})`)
}

//@ts-ignore
const deleteSignFromCollection = async ({signId, collectionId}) => {
    exec(`delete from sign_collection
    where sign_id = ${signId}
    and collection_id = ${collectionId}`)
}

const getSignById = async (id: number) => {
    const stmt = `
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
    `
    const signs = await query(stmt)
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

const searchSigns = async (searchValue: string, collectionId: number = 3) => {
    let stmt = ''
    // const collectionId = message.collectionId ?? 3
    console.log('searchsigns')
    if (!searchValue) {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            LEFT JOIN sign_collection
            ON sign_collection.sign_id = sign.id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            group by sign.id
            order by phrase asc`
    }
    if (searchValue[0] === '*') {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            LEFT JOIN sign_collection
            ON sign_collection.sign_id = sign.id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign.phrase like "%${searchValue.substring(1)}%"
            group by sign.id
            order by sign.phrase asc`
    }
    if (searchValue && searchValue[0] != '*') {
        if (searchValue[searchValue.length - 1] != '*') {
            searchValue = searchValue + '*'
        }
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
            from sign_fts
            join sign on sign.id = sign_fts.id
            LEFT JOIN sign_collection
            ON sign_collection.sign_id = sign.id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign_fts match "${searchValue}"
            group by sign.id
            order by sign_fts.rank, sign.phrase asc`
    }
    const result = await query(stmt)
    return result
}

const signSearchWithCollectionId = async (
    searchValue: string,
    collectionId: number,
    limit: number = 500,
    offset: number = 0
) => {
    let stmt = `
        select distinct
        sign.id as sign_id,
        sign.phrase as phrase,
        sign_video.video_id as youtube_id,
        sign_fts.related_signs as related_signs,
            case when sign_collection.collection_id = ${collectionId} then true else false end as in_collection
        from sign
        join sign_fts
        on sign.id = sign_fts.id
        left join sign_collection
        on sign.id = sign_collection.sign_id
        and sign_collection.collection_id = ${collectionId}
        LEFT JOIN sign_video
        ON sign.id = sign_video.sign_id
        order by sign.phrase asc
        limit ${limit}
        offset ${offset}`
    const result = await query(stmt)
    return result
}

const getCollectionById = async (
    searchValue: string,
    collectionId: number,
    limit: number = 500,
    offset: number = 0
) => {
    let stmt = ''
    if (!searchValue) {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.id as collection_id,
            collection.name as collection_name,
                case when sign_collection.collection_id = ${collectionId} then true else false end as in_collection
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where collection.id = ${collectionId}
            group by sign.id
            order by sign.phrase asc
            limit ${limit}
            offset ${offset}`
    }
    if (searchValue[0] === '*') {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.id as collection_id,
            collection.name as collection_name,
                case when sign_collection.collection_id = ${collectionId} then true else false end as in_collection
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign.phrase like "%${searchValue.substring(1)}%"
            and collection.id = ${collectionId}
            group by sign.id
            order by sign.phrase asc
            limit ${limit}
            offset ${offset}`
    }
    if (searchValue && searchValue[0] != '*') {
        if (searchValue[searchValue.length - 1] != '*') {
            searchValue = searchValue + '*'
        }
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.id as collection_id,
            collection.name as collection_name,
                case when sign_collection.collection_id = ${collectionId} then true else false end as in_collection
            from sign_fts
            join sign on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign_fts match "${searchValue}"
            and collection.id = ${collectionId}
            group by sign.id
            order by sign_fts.rank, sign.phrase asc
            limit ${limit}
            offset ${offset}`
    }
    const result = await query(stmt)
    return result
}

    const checkSignInCollection = async ({
        sign_id,
        collection_id,
    }: {
        sign_id: number
        collection_id: number
    }) => {
        let res = await query(`
        select case when exists
            (select *
            from sign_collection
            where sign_id = ${sign_id}
            and collection_id = ${collection_id}
            )
            then true
            else false
            end
            as in_collection;
        `)
        console.log(res)
        return res[0].in_collection
    }

export {
    query,
    getSignById,
    searchSigns,
    signSearchWithCollectionId,
    getCollectionById,
    checkSignInCollection,
    addSignToCollection,
    deleteSignFromCollection
}
