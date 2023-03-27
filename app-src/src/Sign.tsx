function Sign(props) {
    return (
        <div key={props.sign.id}>
            {props.sign.phrase}
            <button
                onClick={() => {
                    window.promiseWorker.postMessage({
                        type: 'addToDefaultUserCollection',
                        query: props.sign.id,
                    })
                }}
            >
                INSERT
            </button>
        </div>
    )
}

export default Sign
