const browserify = require("browserify")
const globby = require("globby")
const fs = require("fs")

const lavamoatOpts = {
  policy: "./lavamoat/policy.json",
  override: "./lavamoat/policy-override.json",
  writeAutoPolicyDebug: true,
  prunePolicy: true
}

;(async () => {
  const paths = await globby([
    "build/chrome-mv3-prod/content.*.js",
    "build/chrome-mv3-prod/background.*.js"
  ])

  paths.forEach((path) => {
    browserify(path, { plugin: [["lavamoat-browserify", lavamoatOpts]] })
      .bundle()
      .pipe(fs.createWriteStream(`${path}.tmp`))
      .once("finish", () => {
        fs.unlinkSync(path)
        fs.renameSync(`${path}.tmp`, path)
      })
  })
})()
