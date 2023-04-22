export function Pagination({
    offset,
    totalPages,
    totalSignCount,
    updatePage,
    limit,
    currentPage,
}: {
    offset: number
    totalPages: number
    totalSignCount: number
    updatePage: (page: number) => void
    limit: number
    currentPage: number
}) {
    const signCountOnPage = Math.min(totalSignCount - offset, limit)
    const paginationLinkCount = 4
    const firstLink = currentPage < 7 ? 1 : currentPage - 5
    const maxLastLink = totalPages
    let linkArr = []
    const realLinkCount = Math.min(paginationLinkCount, maxLastLink - firstLink)
    const showLastLink = realLinkCount >= paginationLinkCount
    for (let i = firstLink; i <= firstLink + realLinkCount; i++) {
        linkArr.push(i)
    }
    // < 1 2 3 4 5 6 ... 121 >
    return (
        <>
            <div className="center pad">
                Sýni tákn {offset}-{offset + signCountOnPage} af{' '}
                {totalSignCount}.
            </div>
            <div className="pagination">
                <a
                    onClick={() => updatePage(Math.max(1, currentPage - 1))}
                    className=""
                >
                    &lt;
                </a>
                {firstLink != 1 && (
                    <a onClick={() => updatePage(1)} className="">
                        1
                    </a>
                )}
                {/* <a onClick={() => updatePage(firstLink)} className="">
                    {firstLink}
                </a> */}
                {linkArr.map((index) => {
                    return (
                        <a
                            key={index}
                            className={index == currentPage ? 'active' : ''}
                            onClick={() => updatePage(index)}
                        >
                            {index}
                        </a>
                    )
                })}

                {/* <a className="active">{currentPage}</a> */}
                <a onClick={() => alert('velja')} className="">
                    ...
                </a>
                {showLastLink && (
                    <a onClick={() => updatePage(totalPages)} className="">
                        {totalPages}
                    </a>
                )}
                <a
                    onClick={() =>
                        updatePage(Math.min(totalPages, currentPage + 1))
                    }
                >
                    &gt;
                </a>
            </div>
        </>
    )
}
