interface absurdSqlPromiseWorker {}

interface absurdSqlPromiseWorkerMessage {
    type:
        | 'signSearch'
        | 'sql'
        | 'listCollections'
        | 'getCollectionById'
        | 'getDefaultUserCollection'
        | 'addToDefaultUserCollection'
        | 'signSearchWithCollectionId'
        | 'checkSignInCollection'
    query: string | object
    collectionId?: number
    signOffset?: number
    signLimit?: number
}
