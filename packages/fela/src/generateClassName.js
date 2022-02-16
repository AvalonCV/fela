const chars = 'abcdefghijklmnopqrstuvwxyz'
const charLength = chars.length

function generateUniqueClassName(id, className = '') {
  if (id <= charLength) {
    return chars[id - 1] + className
  }

  // Bitwise floor as safari performs much faster
  // https://jsperf.com/math-floor-vs-math-round-vs-parseint/55
  return generateUniqueClassName(
    (id / charLength) | 0,
    chars[id % charLength] + className
  )
}

export default function generateClassName(getId, filterClassName = () => true) {
  const startId = getId()
  const generatedClassName = generateUniqueClassName(startId)

  if (!filterClassName(generatedClassName)) {
    return generateClassName(getId, filterClassName)
  }

  return generatedClassName
}
