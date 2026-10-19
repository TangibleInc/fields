import path from 'node:path'
// Utilities from @tangible/roller
import fs from 'fs-extra'
import esbuild from 'esbuild'
import glob from 'fast-glob'

import { esbuildResolveImportsPlugin } from './tools/esbuild-resolve-imports-plugin/index.js'

async function buildForNpm() {
  const sourceFolder = `assets/src`
  const targetFolder = `publish/npm`

  console.log('Prepare target folder', targetFolder)
  if (await fs.exists(targetFolder)) {
    await fs.remove(targetFolder)
  }
  await fs.ensureDir(targetFolder)

  console.log('Build files from', sourceFolder)

  let i = 0

  for (const file of await glob(`**/*.{js,jsx,ts,tsx,scss}`, {
    cwd: sourceFolder,
  })) {
    i++
    console.log(file)

    const extension = file.split('.').pop()
    const sourceFile = path.join(sourceFolder, file)

    if (extension === 'scss') {
      // Copy as is
      const targetFile = path.join(targetFolder, file)
      await fs.copy(sourceFile, targetFile)
      continue
    }

    // Compile
    const targetFile = path.join(targetFolder, file.substring(0, file.lastIndexOf('.')) + '.js')

    await esbuild.build({
      entryPoints: [sourceFile],
      bundle: false,
      outfile: targetFile,
      format: 'esm',
      plugins: [esbuildResolveImportsPlugin()]
    })
  }

  console.log('Built', i, 'files')

  await fs.copy('readme.md', path.join(targetFolder, 'readme.md'))
  console.log('Copied readme.md')

  const config = await fs.readJson('package.json')

  /**
   * Both scripts and devDependencies are unneeded in the published
   * module, and scripts.postinstall will trigger a warning if not allowed
   *
   * @see https://github.com/TangibleInc/fields/pull/98#issuecomment-6269142517
   */
  delete config.scripts
  delete config.devDependencies

  await fs.writeJson(
    `${targetFolder}/package.json`,
    config,
    { spaces: 2 }
  )
  console.log('Generated package.json')
}

async function help() {
  console.log(`Usage: node build.js [command] [...options]
Available commands:
  npm - Build NPM package`)
}

const [command, ...args] = process.argv.slice(2)
const run =
  {
    npm: buildForNpm,
  }[command] || help

run().catch(console.error)
