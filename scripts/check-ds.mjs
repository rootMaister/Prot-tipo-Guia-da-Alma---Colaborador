// Falha cedo e com diagnóstico quando @guia-da-alma/ds não está instalado.
//
// Sem isto, um DS ausente aparece como ~30 erros TS2307/TS7006 espalhados pelas
// telas, que não dizem nada sobre a causa (o pacote vem de um tarball
// vendorizado, não do registry). Roda dentro do script `build` de propósito: o
// pnpm 10+ não executa `prebuild` automaticamente.
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const tarball = 'vendor/guia-da-alma-ds.tgz'
const pkgDir = 'node_modules/@guia-da-alma/ds'

// Só o entry principal: o `exports` do DS não expõe ./package.json, então
// require.resolve('@guia-da-alma/ds/package.json') é bloqueado mesmo instalado.
let entry = null
try {
  entry = require.resolve('@guia-da-alma/ds')
} catch {}

// O tsc precisa dos .d.ts, não do JS — um sem o outro ainda quebra o build.
const types = existsSync(`${pkgDir}/dist/index.d.ts`)

if (entry && types) {
  let version = '?'
  try {
    version = JSON.parse(readFileSync(`${pkgDir}/package.json`, 'utf8')).version
  } catch {}
  console.log(`[check-ds] @guia-da-alma/ds ${version} ok (entry + tipos)`)
  process.exit(0)
}

console.error('[check-ds] @guia-da-alma/ds indisponível. Estado do ambiente:')
console.error(`  node                 ${process.version}`)
console.error(`  cwd                  ${process.cwd()}`)
console.error(`  package manager      ${process.env.npm_config_user_agent ?? '(não veio de um install)'}`)
console.error(`  entry resolvido      ${entry ?? 'NÃO'}`)
console.error(`  dist/index.d.ts      ${types ? 'presente' : 'AUSENTE'}`)
console.error(`  ${tarball}   ${existsSync(tarball) ? `presente, ${statSync(tarball).size} bytes` : 'AUSENTE <- vendor/ não chegou no build'}`)
console.error(`  node_modules/        ${existsSync('node_modules') ? 'presente' : 'AUSENTE <- install não rodou'}`)
console.error(`  ${pkgDir}   ${existsSync(pkgDir) ? 'presente' : 'AUSENTE <- install pulou a dep file:'}`)
console.error('')
console.error('  A dependência é "@guia-da-alma/ds": "file:vendor/guia-da-alma-ds.tgz".')
console.error('  Tarball presente + node_modules/@guia-da-alma ausente = o install pulou a dep')
console.error('  file:. Tente um deploy sem cache de build. Contexto em vendor/PROCEDENCIA.md.')
process.exit(1)
