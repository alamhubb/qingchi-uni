import TagVO from '@/model/tag/TagVO'
import StorageUtil from '@/utils/StorageUtil'

const initTag = new TagVO()
initTag.name = '未选择'

export default class TagUtil {
  static readonly initTag: TagVO = initTag
  static readonly initTagAry: TagVO[] = [initTag]

  private static readonly historyTagsKey: string = 'historyTags'

  static getStorageHistoryTags (): TagVO[] {
    const tags: TagVO[] = StorageUtil.getObj(this.historyTagsKey)
    return tags || []
  }

  static setStorageHistoryTags (tags: TagVO[]) {
    StorageUtil.setObj(this.historyTagsKey, tags)
  }
}
