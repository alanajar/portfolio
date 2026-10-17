// Extrait de code affiché sur l'écran du portable 3D (et dans la version statique).
// Chaque ligne = liste de segments [texte, couleur] pour la coloration syntaxique.
const K = '#c792ea' // mot-clé
const C = '#ffcb6b' // classe
const F = '#82aaff' // fonction
const S = '#c3e88d' // chaîne
const N = '#f78c6c' // nombre
const T = '#e2e8f0' // texte
const M = '#64748b' // commentaire

export const CODE_LINES = [
  [['class ', K], ['Developpeur', C], [' {', T]],
  [['  constructor', F], ['() {', T]],
  [['    this', K], ['.nom = ', T], ['"Ala NAJAR"', S], [';', T]],
  [['    this', K], ['.formation = ', T], ['"BUT Informatique"', S], [';', T]],
  [['    this', K], ['.stack = [', T], ['"Python"', S], [', ', T], ['"C++"', S], [', ', T], ['"JS"', S], [', ', T], ['"SQL"', S], ['];', T]],
  [['  }', T]],
  [],
  [['  coder', F], ['() {', T]],
  [['    while ', K], ['(', T], ['this', K], ['.cafe > ', T], ['0', N], [') {', T]],
  [['      this', K], ['.apprendre', F], ['();', T]],
  [['      this', K], ['.creer', F], ['();', T]],
  [['    }', T]],
  [['  }', T]],
  [['}', T]],
  [['// toujours en train d\'apprendre', M]],
]

export const CODE_LENGTH = CODE_LINES.reduce(
  (sum, line) => sum + line.reduce((s, [text]) => s + text.length, 0) + 1,
  0,
)
