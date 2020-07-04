export default class TagAddVO {
  public tagName: string = null
  public description: string = null

  constructor (tagName: string, description: string) {
    this.tagName = tagName
    this.description = description
  }
}
