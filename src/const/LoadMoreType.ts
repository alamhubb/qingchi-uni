export default class LoadMoreType {
  // loading前
  static readonly more: string = 'more'
  // loading中
  static readonly loading: string = 'loading'
  // 没有更多了
  static readonly noMore: string = 'noMore'
  //不允许加载更多的状态列表
  static readonly cantLoading = [LoadMoreType.loading, LoadMoreType.noMore]
}
