interface absurdSqlPromiseWorker {}

interface absurdSqlPromiseWorkerMessage {
    type: 'sql' | 'exec' | 'export'
    query: string | object
}
