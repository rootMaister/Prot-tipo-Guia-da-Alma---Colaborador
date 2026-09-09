# vendor/guia-da-alma-ds.tgz

Snapshot de `@guia-da-alma/ds`, gerado por `pnpm ds:vendor`. Não edite à mão.

- versão no package.json: **0.1.9**
- commit do design-system: **1c238fa** + mudanças não commitadas em src/
- empacotado em: 2026-09-09 22:23 UTC

A versão acima é a que está no package.json do DS, não necessariamente uma
release publicada — este snapshot pode conter trabalho ainda não lançado. Foi
por isso que ele existe: a 0.1.9 publicada no GitHub Packages não exporta
`IconButton`, `FeaturedIcon`, `GuiaDaAlmaSymbol` nem `GuiaDaAlmaWordmark`,
que este protótipo usa.

Quando o DS tiver uma release com esses exports, o caminho certo é trocar isto
por uma dependência de registry (`^x.y.z` + `.npmrc` apontando para
npm.pkg.github.com, e um PAT com `read:packages` nas env vars da Vercel).
