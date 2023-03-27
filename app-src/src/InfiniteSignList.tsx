import useSigns from './useSigns'
import Sign from './Sign'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { useRef, useEffect } from 'react'

const InfiniteSignList = ({ searchValue }) => {
    // console.log(searchValue, 'infinitesignlist')
    const { signs, loadChunkOfData, checkIfSignLoaded, allSignsCount } =
        useSigns({ searchValue })

    const infiniteLoaderRef = useRef<InfiniteLoader>(null)
    const hasMountedRef = useRef(false)

    // Each time the sort prop changed we called the method resetloadMoreItemsCache to clear the cache
    useEffect(() => {
        // We only need to reset cached items when "sortOrder" changes.
        // This effect will run on mount too; there's no need to reset in that case.
        if (hasMountedRef.current) {
            if (infiniteLoaderRef.current) {
                infiniteLoaderRef.current!.resetloadMoreItemsCache(true)
                loadChunkOfData()
            }
        }
        hasMountedRef.current = true
    }, [searchValue])
    return (
        <InfiniteLoader
            isItemLoaded={checkIfSignLoaded}
            loadMoreItems={loadChunkOfData}
            itemCount={allSignsCount}
            ref={infiniteLoaderRef}
        >
            {({ onItemsRendered, ref }) => (
                <AutoSizer>
                    {({ height, width }) => (
                        <FixedSizeList
                            height={height!}
                            width={width!}
                            itemCount={signs.length}
                            itemSize={30}
                            onItemsRendered={onItemsRendered}
                            overscanCount={100}
                        >
                            {({ index, style }) => {
                                const sign = signs[index]
                                return (
                                    <div style={style}>
                                        <Sign sign={sign} />
                                    </div>
                                )
                            }}
                        </FixedSizeList>
                    )}
                </AutoSizer>
            )}
        </InfiniteLoader>
    )
}

export default InfiniteSignList
