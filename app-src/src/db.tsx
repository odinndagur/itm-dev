const DB_CONSOLE_LOGS = true

const query = async (query: string) => {
    DB_CONSOLE_LOGS && console.log(query)
    const result = await window.promiseWorker.postMessage({
        type: 'sql',
        query: query,
    })
    return result
}

const exec = async (query: string) => {
    DB_CONSOLE_LOGS && console.log(query)

    window.promiseWorker.postMessage({ type: 'exec', query: query })
}

//@ts-ignore
const addSignToCollection = async ({ signId, collectionId }) => {
    exec(
        `insert into sign_collection(sign_id, collection_id) values(${signId},${collectionId})`
    )
}

//@ts-ignore
const deleteSignFromCollection = async ({ signId, collectionId }) => {
    exec(`delete from sign_collection
    where sign_id = ${signId}
    and collection_id = ${collectionId}`)
}

const createCollection = async ({
    userId,
    collectionName,
}: {
    userId: string | number
    collectionName: string
}) => {
    exec(`
    INSERT INTO collection(name,user_id)
    VALUES ("${collectionName}",${userId})
    `)
}

const deleteCollection = async ({ collectionId }: { collectionId: number }) => {
    exec(`
    DELETE FROM collection WHERE collection.id = ${collectionId}
    `)
    exec(`
    DELETE FROM sign_collection WHERE collection_id = ${collectionId}
    `)
}

const getSignByIdJson = async (id: number) => {
    console.log('getting sign by id with json: ' + id)
    const stmt = `
        SELECT
        json_object(
            'id',sign.id,
            'phrase',sign.phrase,
            'videos', json_group_array(distinct json_object('rank',sign_video.rank,'video_id', sign_video.video_id)),
            'efnisflokkar', json_group_array(distinct efnisflokkur.text),
            'related_signs', json_group_array(distinct json_object('phrase',related.phrase,'id', related.id)),
            'myndunarstadur',sign.myndunarstadur,
            'ordflokkur',sign.ordflokkur,
            'islenska',sign.islenska,
            'taknmal',sign.taknmal,
            'description',sign.description,
            'munnhreyfing', sign.munnhreyfing
        ) as sign_json
        FROM sign
        LEFT JOIN sign_video
        ON sign.id = sign_video.sign_id
        LEFT JOIN sign_efnisflokkur
        ON sign_efnisflokkur.sign_id = sign.id
        LEFT JOIN efnisflokkur
        ON sign_efnisflokkur.efnisflokkur_id = efnisflokkur.id
        LEFT JOIN sign_related
        ON sign_related.sign_id = sign.id
        LEFT JOIN
            (SELECT * FROM sign WHERE sign.id IN
                (SELECT sign_id from sign_related where related_id = ${id}
                UNION
                SELECT related_id from sign_related where sign_id = ${id}
                )
            ) as related
        WHERE sign.id = ${id}
        GROUP BY sign.id
    `
    const signs = await query(stmt)
    // console.log(signs)
    // console.log(signs[0])
    // console.log(signs[0].sign_json)
    // console.log(JSON.parse(signs[0].sign_json))
    let sign: {
        id: string
        phrase: string
        videos: { rank: number; video_id: string }[]
        efnisflokkar: string[]
        related_signs: { phrase: string; id: number }[]
        myndunarstadur: string
        ordflokkur: string
    } = JSON.parse(signs[0].sign_json)
    sign.videos = sign.videos
        .sort((a: any, b: any) => {
            return a.rank - b.rank
        })
        .map((video: any) => {
            return video.video_id
        })
    DB_CONSOLE_LOGS && console.log(sign)
    return sign
}

const getUserById = async (id: number) => {
    console.log(`Getting user by id: ${id}`)
    const stmt = `
        SELECT
        json_object(
            'id',user.id,
            'name',user.name,
            'collections', json_group_array(distinct json_object('id',collection.id,'name', collection.name, 'user_id', collection.user_id, 'created_at', collection.created_at))
        ) as user_json
        FROM user
        LEFT JOIN collection
        ON collection.id = 1
        OR user.id = collection.user_id
        WHERE user.id = ${id}
        GROUP BY user.id
    `
    const users = await query(stmt)
    let user: {
        id: number
        name: string
        collections: { id: number; name: string }[]
    } = JSON.parse(users[0].user_json)
    DB_CONSOLE_LOGS && console.log(user)
    return user
}

const getSignById = async (id: number) => {
    console.log('getting sign by id: ' + id)
    const stmt = `
        SELECT sign.*,
        GROUP_CONCAT(distinct sign_video.rank || ':' || sign_video.video_id) as youtube_ids,
        GROUP_CONCAT(distinct efnisflokkur.text) as efnisflokkar,
        GROUP_CONCAT(distinct related.phrase || ':' || related.id) as related_signs,
        sign.myndunarstadur,
        sign.ordflokkur
        FROM sign
        JOIN sign_video
        ON sign.id = sign_video.sign_id
        JOIN sign_efnisflokkur
        ON sign_efnisflokkur.sign_id = sign.id
        JOIN efnisflokkur
        ON sign_efnisflokkur.efnisflokkur_id = efnisflokkur.id
        JOIN sign_related
        ON sign_related.sign_id = sign.id
        JOIN sign AS related
        ON sign_related.related_id = related.id

        
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

    sign['related_signs'] = sign['related_signs']
        .split(',')
        .map((sign: any) => {
            const [phrase, id] = sign.split(':')
            return { id, phrase }
        })

    sign['efnisflokkar'] = sign['efnisflokkar'].split(',')

    // console.log('getsignbyid')
    // console.log(sign)
    return signs[0]
}

const getSignByPhrase = async (phrase: string) => {
    console.log('getting sign by phrase with json: ' + phrase)
    const stmt = `
        SELECT
        json_object(
            'id',sign.id,
            'phrase',sign.phrase,
            'videos', json_group_array(distinct json_object('rank',sign_video.rank,'video_id', sign_video.video_id)),
            'efnisflokkar', json_group_array(distinct efnisflokkur.text),
            'related_signs', json_group_array(distinct json_object('phrase',related.phrase,'id', related.id)),
            'myndunarstadur',sign.myndunarstadur,
            'ordflokkur',sign.ordflokkur,
            'islenska',sign.islenska,
            'taknmal',sign.taknmal,
            'description',sign.description,
            'handform',sign.handform
        ) as sign_json
        FROM sign
        LEFT JOIN sign_video
        ON sign.id = sign_video.sign_id
        LEFT JOIN sign_efnisflokkur
        ON sign_efnisflokkur.sign_id = sign.id
        LEFT JOIN efnisflokkur
        ON sign_efnisflokkur.efnisflokkur_id = efnisflokkur.id
        LEFT JOIN sign_related
        ON sign_related.sign_id = sign.id
        LEFT JOIN
            (SELECT * FROM sign WHERE sign.id IN
                (SELECT sign_id from sign_related where related_id = sign.id
                UNION
                SELECT related_id from sign_related where sign_id = sign.id
                )
            ) as related
            WHERE sign.phrase LIKE "${String(phrase).toLowerCase().trim()}"
            GROUP BY sign.id
    `
    const signs = await query(stmt)
    // console.log(signs)
    // console.log(signs[0])
    // console.log(signs[0].sign_json)
    // console.log(JSON.parse(signs[0].sign_json))
    let sign: {
        id: string
        phrase: string
        videos: { rank: number; video_id: string }[]
        efnisflokkar: string[]
        related_signs: { phrase: string; id: number }[]
        myndunarstadur: string
        ordflokkur: string
    } = JSON.parse(signs[0].sign_json)
    sign.videos = sign.videos
        .sort((a: any, b: any) => {
            return a.rank - b.rank
        })
        .map((video: any) => {
            return video.video_id
        })
    // console.log(sign)
    return sign
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
    offset: number = 0,
    userCollection: number = 3
) => {
    let stmt = `
        select distinct
        sign.id as sign_id,
        sign.phrase as phrase,
        sign_video.video_id as youtube_id,
        sign_fts.related_signs as related_signs,
            case when sign_collection.collection_id = ${userCollection} then true else false end as in_collection
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
    limit: number = 20000,
    offset: number = 0,
    userCollection: number = 3
) => {
    let stmt = ''
    if (!searchValue) {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            json_group_array(
                distinct json_object('collection_name',collection.name,'collection_id',collection.id)
                )
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
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
                case when sign_collection.collection_id = ${userCollection} then true else false end as in_collection
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
                case when sign_collection.collection_id = ${userCollection} then true else false end as in_collection
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
    const result: {
        sign_id: number
        phrase: string
        youtube_id: string
        related_signs: string
        collection_id: number
        collection_name: string
        in_collection: boolean
    }[] = await query(stmt)
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
    // console.log(res)
    return res[0].in_collection
}

const searchPagedCollectionById = async ({
    searchValue,
    collectionId,
    page,
}: {
    searchValue: string
    collectionId: number
    page: number
}) => {
    const limit = 100
    const offset = (page - 1) * limit
    let stmt = ''
    let totalSignCount = 0
    let totalPages = 0
    if (!searchValue) {
        const tempCount = await query(`
            select count(*) as sign_count from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            where collection.id = ${collectionId}
        `)
        totalSignCount = tempCount[0].sign_count
        totalPages = Math.ceil(totalSignCount / limit)
        console.log({ offset, tempCount, totalSignCount, totalPages })
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.name as collection_name,
            group_concat(multiCollection.id) as collections
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            left join collection as multiCollection
            on multiCollection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where collection.id = ${collectionId}
            group by sign.id
            order by sign.phrase asc
            limit ${limit}
            offset ${offset}`
    }
    if (searchValue[0] === '*') {
        const tempCount = await query(`select count(*) as sign_count
        from sign
        join sign_fts
        on sign.id = sign_fts.id
        left join sign_collection on sign.id = sign_collection.sign_id
        left join collection
        on collection.id = sign_collection.collection_id
        where sign.phrase like "%${searchValue.substring(1)}%"
        and collection.id = ${collectionId}
        `)
        totalSignCount = tempCount[0].sign_count
        totalPages = Math.ceil(totalSignCount / limit)
        console.log({ offset, tempCount, totalSignCount, totalPages })
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.name as collection_name,
            group_concat(collection.id) as collections
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            left join collection as multiCollection
            on multiCollection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign.phrase like "%${searchValue.substring(1)}%"
            and collection.id = ${collectionId}
            group by sign_collection.sign_id
            order by levenshtein(sign.phrase,${searchValue.substring(1)}) asc
            limit ${limit}
            offset ${offset}`
    }
    if (searchValue && searchValue[0] != '*') {
        if (searchValue[searchValue.length - 1] != '*') {
            searchValue = searchValue + '*'
        }
        const tempCount = await query(`
        select count(*) as sign_count from sign_fts
        join sign on sign.id = sign_fts.id
        left join sign_collection on sign.id = sign_collection.sign_id
        left join collection
        on collection.id = sign_collection.collection_id
        where sign_fts match "${searchValue}"
        and collection.id = ${collectionId}
        `)
        totalSignCount = tempCount[0].sign_count
        totalPages = Math.ceil(totalSignCount / limit)
        console.log({ offset, tempCount, totalSignCount, totalPages })
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.name as collection_name,
            group_concat(collection.id) as collections
            from sign_fts
            join sign on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            left join collection as multiCollection
            on multiCollection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign_fts match "${searchValue}"
            and collection.id = ${collectionId}
            group by sign_collection.sign_id
            order by levenshtein(sign.phrase,"${searchValue.substring(1)}") asc
            limit ${limit}
            offset ${offset}`
    }
    DB_CONSOLE_LOGS && console.log(stmt)
    let result: {
        id: number
        phrase: string
        youtube_id: string
        related_signs: string
        collections: string
        collection_id?: number
        collection_name?: string
        in_collection?: boolean
    }[] = await query(stmt)
    DB_CONSOLE_LOGS && console.log(result)
    const collection_name = result[0]?.collection_name
    return {
        signs: result,
        totalPages,
        totalSignCount,
        offset,
        limit,
        collection_name,
    }
}

const getRandomSign = async () => {
    const res = await query('select count(*) as sign_count from sign')
    // console.log(res)
    const count = parseInt(res[0].sign_count)
    // console.log(count)
    const index = Math.floor(Math.random() * count)
    // console.log(index)
    const signs = await query(`select * from sign  limit 1 offset ${index}`)
    // console.log(signs)
    return signs[0].id
}

export {
    query,
    getSignById,
    getSignByPhrase,
    searchSigns,
    signSearchWithCollectionId,
    getCollectionById,
    checkSignInCollection,
    addSignToCollection,
    deleteSignFromCollection,
    searchPagedCollectionById,
    getSignByIdJson,
    getUserById,
    getRandomSign,
    createCollection,
    deleteCollection,
}
