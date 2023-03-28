import InfiniteSignList from './InfiniteSignList'
import SearchableSignList from './SearchableSignList'

//@ts-expect-error
function SignList({ searchValue, listProps }) {
    return searchValue === '' ? (
        <InfiniteSignList {...listProps} />
    ) : (
        <SearchableSignList searchValue={searchValue} {...listProps} />
    )
}

export default SignList
