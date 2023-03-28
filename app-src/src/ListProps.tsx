import { forwardRef } from 'react'
const PADDING_SIZE = 50
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

export default { PADDING_SIZE, innerElementType }
