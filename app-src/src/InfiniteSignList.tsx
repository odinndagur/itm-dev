import useSigns from './useSigns'
import Sign from './Sign'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { useRef, useEffect, forwardRef } from 'react'
import { ConditionalWrapper } from './ConditionalWrapper'

import { getSignById } from './db'

const InfiniteSignList = () => {
    const PADDING_SIZE = 40
    const innerElementType = forwardRef(({ style, ...rest }, ref) => (
        <div
            ref={ref}
            style={{
                ...style,
                height: `${parseFloat(style.height) + PADDING_SIZE * 2}px`,
            }}
            {...rest}
            className="innerClass"
        />
    ))
    // console.log(searchValue, 'infinitesignlist')
    const { signs, loadChunkOfData, checkIfSignLoaded, allSignsCount } =
        useSigns()

    const infiniteLoaderRef = useRef<InfiniteLoader>(null)
    const hasMountedRef = useRef(false)

    // Each time the sort prop changed we called the method resetloadMoreItemsCache to clear the cache
    // useEffect(() => {
    //     // We only need to reset cached items when "sortOrder" changes.
    //     // This effect will run on mount too; there's no need to reset in that case.
    //     if (hasMountedRef.current) {
    //         if (infiniteLoaderRef.current) {
    //             infiniteLoaderRef.current!.resetloadMoreItemsCache(true)
    //             loadChunkOfData()
    //         }
    //     }
    //     hasMountedRef.current = true
    // }, [searchValue])
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
                            itemSize={40}
                            onItemsRendered={onItemsRendered}
                            overscanCount={200}
                            ref={ref}
                            innerElementType={innerElementType}
                        >
                            {({ index, style }) => {
                                const sign = signs[index]
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            top: `${
                                                parseFloat(style.top) +
                                                PADDING_SIZE
                                            }px`,
                                        }}
                                    >
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
