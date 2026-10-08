/**
 * A central de ajuda publicada — o mesmo link que os botões "Acesse a central de ajuda" do
 * Cadastro carregam no arquivo (1078:9585, 1089:10584, 3690:623, 3690:641) desde 08/10/2026.
 */
export const CENTRAL_DE_AJUDA_URL =
  'https://sites.google.com/guiadaalma.com.br/central-de-ajuda-clientes/p%C3%A1gina-inicial?pli=1&authuser=0'

/**
 * Numa aba nova, como o frame pede — e como os links do Consentimento: sair na mesma aba
 * perderia o cadastro. Função e não `<a>` porque o `Button` do DS não renderiza como link.
 */
export const abrirCentralDeAjuda = () => {
  window.open(CENTRAL_DE_AJUDA_URL, '_blank', 'noopener,noreferrer')
}
