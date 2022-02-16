/* eslint-disable no-console */
let counter = 0

function addPerfTool(renderer) {
  const existingRenderRule = renderer.renderRule.bind(renderer)

  renderer.renderRule = (rule, props) => {
    const timerCounter = `[${++counter}]`

    console.time(timerCounter)
    // eslint-disable-line
    const className = existingRenderRule(rule, props)
    console.log(`${timerCounter} ${rule.name || 'anonym'}`, props)
    // eslint-disable-line
    console.timeEnd(timerCounter)

    // eslint-disable-line
    return className
  }

  return renderer
}

export default function perf() {
  return addPerfTool
}
