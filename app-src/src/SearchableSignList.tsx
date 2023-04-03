import useSigns from './useSigns'
import Sign from './Sign'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { useRef, useEffect, useState, forwardRef } from 'react'

import {
    searchSigns,
    signSearchWithCollectionId,
    getCollectionById,
} from './db'

const SearchableSignList = ({
    searchValue,
    collection,
}: {
    searchValue: string
    collection: number
}) => {
    // console.log(searchValue, 'infinitesignlist')
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
    const [signs, setSigns] = useState<Signs>([])
    //@ts-ignore
    const onItemsRendered = ({visibleStartIndex, visibleStopIndex}) => {
        console.log(visibleStartIndex, visibleStopIndex)
    }
    useEffect(() => {
        console.log(searchValue)
        getCollectionById(searchValue, collection).then((signs: Signs) => {
            setSigns(signs)
            console.log(signs)
        })
        outerListRef.current &&
            outerListRef.current.scrollTo({
                left: 0,
                top: 0,
                behavior: 'auto',
            })
    }, [searchValue, collection])
    const outerListRef = useRef<FixedSizeList>(null)

    return (
        <AutoSizer>
            {({ height, width }) => (
                <FixedSizeList
                    height={height!}
                    width={width!}
                    itemCount={signs.length}
                    itemSize={40}
                    overscanCount={100}
                    outerRef={outerListRef}
                    innerElementType={innerElementType}
                    onItemsRendered={onItemsRendered}
                >
                    {({ index, style }) => {
                        const sign = signs[index]
                        return (
                            <div
                                style={{
                                    ...style,
                                    top: `${
                                        parseFloat(style.top) + PADDING_SIZE
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
    )
}

export default SearchableSignList
