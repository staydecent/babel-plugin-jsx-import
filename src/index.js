module.exports = function ({types: t}) {
  return {
    visitor: {
      JSXOpeningElement (path, {file}) {
        file.set('hasJSX', true)
      },

      Program: {
        enter (path, {file}) {
          file.set('hasJSX', false)
        },

        exit ({node, scope}, {
          file,
          opts: {
            identifier = 'React',
            moduleName = 'react'
          }
        }) {
          if (!(file.get('hasJSX') && !scope.hasBinding(identifier))) {
            return
          }

          const jsxImportDeclaration = t.importDeclaration([
            t.importDefaultSpecifier(t.identifier(identifier))
          ], t.stringLiteral(moduleName))

          node.body.unshift(jsxImportDeclaration)
        }
      }
    }
  }
}
