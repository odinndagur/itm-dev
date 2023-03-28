function Sign({ sign }) {
    return (
        <div key={sign.id}>
            {sign.phrase}
            <button
                onClick={() => {
                    window.promiseWorker.postMessage({
                        type: 'addToDefaultUserCollection',
                        query: sign.id,
                    })
                }}
            >
                INSERT
            </button>
        </div>
    )
}

export default Sign
