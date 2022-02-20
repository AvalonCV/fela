import { render, rehydrate } from 'fela-dom'
import { objectEach } from 'fast-loops'

function hasDOM(renderer, targetDocument) {
  // ensure we're on a browser by using document since window is defined in e.g. React Native
  // see https://github.com/robinweser/fela/issues/736
  if (typeof document === 'undefined') {
    return false
  }

  const doc = targetDocument || document

  return renderer && !renderer.isNativeRenderer && doc && doc.createElement
}

function hasServerRenderedStyle(targetDocument = document) {
  return targetDocument.querySelectorAll('[data-fela-type]').length > 0
}

export default function RendererProviderFactory(
  BaseComponent,
  RendererContext,
  createElement,
  renderChildren,
  statics
) {
  class RendererProvider extends BaseComponent {
    constructor(props, context) {
      super(props, context)

      this._renderStyle()
    }

    componentDidUpdate(prevProps) {
      if (prevProps.renderer !== this.props.renderer) {
        // add warning that renderer is changed
        this._renderStyle()
      }
    }

    _renderStyle() {
      const {
        renderer,
        rehydrate: shouldRehydrate,
        targetDocument,
      } = this.props

      if (hasDOM(renderer, targetDocument)) {
        if (shouldRehydrate && hasServerRenderedStyle(targetDocument)) {
          rehydrate(renderer, targetDocument)
        } else {
          render(renderer, targetDocument)
        }
      }
    }

    render() {
      return createElement(
        RendererContext.Provider,
        {
          value: this.props.renderer,
        },
        renderChildren(this.props.children)
      )
    }
  }

  if (statics) {
    objectEach(statics, (value, key) => {
      RendererProvider[key] = value
    })
  }

  return RendererProvider
}
