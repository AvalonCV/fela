import isPlainObject from 'isobject'

function addImportantToValue(value) {
  if (
    typeof value === 'number' ||
    (typeof value === 'string' &&
      value.toLowerCase().indexOf('!important') === -1)
  ) {
    return `${value}!important`
  }

  return value
}

function isAnimation(style) {
  const styleNames = Object.getOwnPropertyNames(style)
  let isAnimationItem = false

  for (let i = 0; i < styleNames.length; i++) {
    const property = styleNames[i].toString()

    isAnimationItem =
      property === 'to' ||
      property.includes('from') ||
      property.includes('animation') ||
      property.includes('%')
  }

  return isAnimationItem
}

function importantPlugin(style) {
  if (!isAnimation(style)) {
    for (const property in style) {
      const value = style[property]
      if (property === 'className') {
        // this is a fixed classname, not a style rule - leave as is
      } else if (isPlainObject(value)) {
        style[property] = importantPlugin(value)
      } else if (Array.isArray(value)) {
        style[property] = value.map(addImportantToValue)
      } else {
        style[property] = addImportantToValue(value)
      }
    }
  }

  return style
}

export default function important() {
  return importantPlugin
}
