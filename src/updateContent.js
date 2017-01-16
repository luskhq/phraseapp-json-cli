const R = require("ramda")
const {invariant} = require("./utils")

const updateContent = (langs, keys, content, remoteContent) => {
  const paths = R.xprod(langs, keys)

  return R.reduce(
    (contentAcc, path) => {
      const value = R.path(path, remoteContent)
      invariant(value, `Supplied key ${path.join()} not found on remote content and therefore cannot be updated. Check your input for typos.`)
      return R.assocPath(path, value, contentAcc)
    },
    content,
    paths
  )
}

module.exports = {updateContent}
