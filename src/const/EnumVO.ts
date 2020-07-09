export default class EnumVO {
  value: string | number
  name: string
  icon: string
  color: string

  constructor (value: string | number, name?: string, icon?: string, color?: string) {
    this.value = value
    this.name = name
    this.icon = icon
    this.color = color
  }
}
