export function numFixed (num: number, place: number) {
  if (num) {
    return num.toFixed(place)
  }
}

export function numFixed1 (num: number) {
  if (num) {
    return num.toFixed(1)
  }
}

export function numFixed2 (num: number) {
  if (num) {
    return num.toFixed(2)
  }
}
