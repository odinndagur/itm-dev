import Sign from './Sign'
import CollectionListItem from './CollectionItem'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useRef, useEffect, useState, forwardRef } from 'react'
import CollectionPage from './CollectionPage'

const SearchableSignList = ({
    items,
    itemType = 'sign' || 'collection',
    itemSize = 40,
    paddingSize = 40,
}: {
    items: any
    itemType: string
    itemSize?: number
    paddingSize?: number
}) => {
    // console.log(searchValue, 'infinitesignlist')
    const PADDING_SIZE = paddingSize
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
    //@ts-ignore
    const onItemsRendered = ({ visibleStartIndex, visibleStopIndex }) => {
        console.log(visibleStartIndex, visibleStopIndex)
    }
    useEffect(() => {
        outerListRef.current &&
            outerListRef.current.scrollTo({
                left: 0,
                top: 0,
                behavior: 'auto',
            })
    }, [items])
    const outerListRef = useRef<FixedSizeList>(null)

    return (
        <AutoSizer>
            {({ height, width }) => (
                <FixedSizeList
                    height={height!}
                    width={width!}
                    itemCount={items.length}
                    itemSize={itemSize}
                    overscanCount={100}
                    outerRef={outerListRef}
                    innerElementType={innerElementType}
                    onItemsRendered={onItemsRendered}
                >
                    {({ index, style }) => {
                        const item = items[index]
                        return (
                            <div
                                style={{
                                    ...style,
                                    top: `${
                                        parseFloat(style.top) + PADDING_SIZE
                                    }px`,
                                }}
                            >
                                {itemType == 'sign' ? (
                                    <Sign sign={item} />
                                ) : (
                                    <CollectionListItem collection={item} />
                                )}
                            </div>
                        )
                    }}
                </FixedSizeList>
            )}
        </AutoSizer>
    )
}

export default SearchableSignList
