interface absurdSqlPromiseWorker {}

interface absurdSqlPromiseWorkerMessage {
    type:
        | 'signSearch'
        | 'sql'
        | 'listCollections'
        | 'getCollectionById'
        | 'getDefaultUserCollection'
        | 'addToDefaultUserCollection'
    query: String
    collectionId?: number
    signOffset?: number
    signLimit?: number
}
