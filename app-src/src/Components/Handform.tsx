import { useSearch } from "@tanstack/react-location"


export function Handform() {
    const search = useSearch()
    return (
        <div className="placeholder-image-container">
            <p>{search.handform}</p>
            <img
                className="placeholder-image"
                src={`/itm-dev/assets/itm-images/handform/${search.handform}.png`}
            />
        </div>
    )
}