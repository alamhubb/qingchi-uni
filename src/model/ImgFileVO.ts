export default class ImgFileVO {
  public id: number
  public path: string
  public size: number
  public src: string
  public aspectRatio: number
  public height: number
  public width: number
  public quality: number
  public reportNum: number

  constructor (imgFile: ImgFileVO) {
    if (imgFile) {
      this.path = imgFile.path
      this.size = imgFile.size
      this.aspectRatio = 1
    }
  }
}
