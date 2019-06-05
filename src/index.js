module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement (path, { file }) {
        file.set('hasJSX', true)
      },

      Program: {
        enter (path, { file }) {
          file.set('hasJSX', false)
        },

        exit ({ node, scope }, {
          file,
          opts: {
            identifier = 'React',
            moduleName = 'react',
            isNamed = false
          }
        }) {
          if (!(file.get('hasJSX') && !scope.hasBinding(identifier))) {
            return
          }

          const dec = t.importDeclaration

          const jsxImportDeclaration = isNamed
            ? dec([t.ImportSpecifier(t.identifier(identifier), t.identifier(identifier))], t.stringLiteral(moduleName))
            : dec([t.importDefaultSpecifier(t.identifier(identifier))], t.stringLiteral(moduleName))

          node.body.unshift(jsxImportDeclaration)
        }
      }
    }
  }
}
