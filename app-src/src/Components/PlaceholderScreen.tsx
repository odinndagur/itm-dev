function PlaceholderScreen() {
    return (
        <div className="placeholder-image-container">
            <img
                className="placeholder-image"
                src={`${
                    import.meta.env.BASE_URL
                }assets/images/manifest-icon-512.maskable.png`}
            />
        </div>
    )
}

export default PlaceholderScreen
