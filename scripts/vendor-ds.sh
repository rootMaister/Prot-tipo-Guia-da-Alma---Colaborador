#!/usr/bin/env bash
# Re-empacota o design system local para vendor/guia-da-alma-ds.tgz.
#
# O protótipo depende de `file:vendor/guia-da-alma-ds.tgz` em vez de
# `link:../design-system` porque a Vercel constrói a partir de um clone deste
# repo, onde ../design-system não existe. O preço é que o DS virou um snapshot:
# mexer no src do DS não chega mais aqui sozinho — rode este script.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ds_dir="${DS_DIR:-$repo_root/../design-system}"

if [[ ! -f "$ds_dir/package.json" ]]; then
  echo "erro: design system não encontrado em $ds_dir" >&2
  echo "      passe o caminho com DS_DIR=/algum/lugar $0" >&2
  exit 1
fi

echo "==> construindo o DS em $ds_dir"
(cd "$ds_dir" && pnpm build)

echo "==> empacotando"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
(cd "$ds_dir" && pnpm pack --pack-destination "$tmp" >/dev/null)
mv "$tmp"/*.tgz "$repo_root/vendor/guia-da-alma-ds.tgz"

# Procedência: sem isto não há como saber que DS este tarball é.
ds_version="$(cd "$ds_dir" && node -p "require('./package.json').version")"
ds_commit="$(cd "$ds_dir" && git rev-parse --short HEAD)"
ds_dirty=""
if ! (cd "$ds_dir" && git diff --quiet HEAD -- src); then
  ds_dirty=" + mudanças não commitadas em src/"
fi

cat > "$repo_root/vendor/PROCEDENCIA.md" <<EOF
# vendor/guia-da-alma-ds.tgz

Snapshot de \`@guia-da-alma/ds\`, gerado por \`pnpm ds:vendor\`. Não edite à mão.

- versão no package.json: **$ds_version**
- commit do design-system: **$ds_commit**$ds_dirty
- empacotado em: $(date -u '+%Y-%m-%d %H:%M UTC')

A versão acima é a que está no package.json do DS, não necessariamente uma
release publicada — este snapshot pode conter trabalho ainda não lançado. Foi
por isso que ele existe: a 0.1.9 publicada no GitHub Packages não exporta
\`IconButton\`, \`FeaturedIcon\`, \`GuiaDaAlmaSymbol\` nem \`GuiaDaAlmaWordmark\`,
que este protótipo usa.

Quando o DS tiver uma release com esses exports, o caminho certo é trocar isto
por uma dependência de registry (\`^x.y.z\` + \`.npmrc\` apontando para
npm.pkg.github.com, e um PAT com \`read:packages\` nas env vars da Vercel).
EOF

echo "==> instalando no protótipo"
(cd "$repo_root" && pnpm install)

echo "pronto: DS $ds_version ($ds_commit$ds_dirty) vendorizado"
