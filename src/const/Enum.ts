export default class Enum {
  value: string
  name: string
  icon: string
  color: string

  constructor (value: string, name?: string, icon?: string, color?: string) {
    this.value = value
    this.name = name
    this.icon = icon
    this.color = color
  }
}
