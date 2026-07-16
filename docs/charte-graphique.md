# Charte graphique — Rémy Guibert

Référence de direction artistique **commune à tous mes sites**. Elle est extraite du
portfolio (`assets/css/portfolio.css`), mais elle est écrite pour être réutilisable telle
quelle sur n'importe quel nouveau projet : portfolio, landing page, application, site client.

Deux volets indissociables :

- **Volet visuel** (§1 à §9) — l'identité : couleurs, typographie, rythme, composants.
- **Volet sémantique** (§10 à §12) — la règle « zéro `<div>`, zéro `<span>` », qui fait
  autant partie de la signature de mes sites que le dégradé cyan → violet → rose.

> Le guide de référence détaillé de la sémantique reste [`semantique-html.md`](semantique-html.md)
> (catalogue complet des balises + application au site). Cette charte en donne les règles
> applicables au quotidien.

---

## 1. Principes directeurs

L'identité tient en une phrase : **un socle éditorial noir & blanc, réveillé par un
accent néon en dégradé.**

| Principe | Ce que ça veut dire concrètement |
|---|---|
| **Monochrome d'abord** | Le texte, les fonds et les bordures sont neutres. Aucune couleur « décorative » sur du contenu. |
| **L'accent est rare** | Le dégradé néon signale : la marque, l'action principale, l'état actif, le survol. Jamais un aplat de fond plein page. |
| **Éditorial, pas décoratif** | Grandes typos serrées, index de section numérotés, filets, blancs généreux. La page se lit comme une mise en page imprimée. |
| **Le mouvement est une réponse** | Les animations réagissent à l'utilisateur (survol, scroll, focus). L'ambiant (aurora, particules) reste lent et sous le contenu. |
| **Accessible par défaut** | Contraste, focus visible, `prefers-reduced-motion`, sémantique : ce sont des contraintes de conception, pas des correctifs. |

---

## 2. Couleurs

### 2.1 Palette de base

Tout part d'une échelle neutre. Ce sont **les seules valeurs brutes autorisées** dans un
projet ; tout le reste se réfère à ces tokens.

| Rôle | Token | Valeur |
|---|---|---|
| Noir de marque | `--color-black` | `#0A0A0A` |
| Noir adouci | `--color-black-soft` | `#1A1A1A` |
| Noir sourd | `--color-black-muted` | `#2A2A2A` |
| Blanc | `--color-white` | `#FFFFFF` |
| Blanc cassé | `--color-white-soft` | `#FAFAFA` |
| Gris 100 → 900 | `--color-gray-100` … `--color-gray-900` | `#F5F5F5`, `#E5E5E5`, `#D4D4D4`, `#A3A3A3`, `#737373`, `#525252`, `#404040`, `#262626`, `#171717` |

### 2.2 Accents néon — la signature

Trois accents, déclarés en composantes RGB brutes pour pouvoir être utilisés en `rgba()`
avec une opacité variable (halos, bordures translucides, spotlights).

| Token | Valeur | Emploi |
|---|---|---|
| `--accent-1` (cyan) | `#22D3EE` | Ponctuation : crochets du logo, curseur, icônes secondaires. |
| `--accent-2` (violet) | `#8B5CF6` | **Accent principal** — c'est `--accent`. Index de section, liens actifs, bordures au survol, halos. |
| `--accent-3` (rose) | `#EC4899` | Fin de dégradé, touches finales (icônes de pied de page). |
| `--color-star` | `#FBBF24` | Étoiles de notation, uniquement. |

**Le dégradé signature** est l'élément identitaire le plus reconnaissable — il doit rester
identique partout, cyan → violet → rose à 120° :

```css
--gradient-brand: linear-gradient(120deg,
    var(--accent-1) 0%, var(--accent-2) 52%, var(--accent-3) 100%);
```

Sa variante `--gradient-brand-soft` (mêmes teintes à 14 % d'opacité, 135°) sert de **fond**
de badge ou d'encart. Règle simple : `--gradient-brand` pour ce qui est **au-dessus**
(texte détouré, bouton, filet), `--gradient-brand-soft` pour ce qui est **en dessous**.

### 2.3 Couleurs sémantiques

Réservées au **sens**, jamais à l'esthétique. Un bouton n'est pas vert parce que le vert est joli.

| Token | Valeur | Sens |
|---|---|---|
| `--color-success` | `#16A34A` | Disponible, validé, en ligne (ex. la pastille pulsante `.badge-dot`). |
| `--color-danger` | `#DC2626` | Erreur, suppression, indisponible. |
| `--color-warning` | `#EA580C` | En cours, attention, brouillon. |
| `--color-info` | `#0891B2` | Information neutre. |

### 2.4 Couleurs appliquées (la couche à consommer)

**Un composant ne lit jamais `--color-gray-600` ni `#8B5CF6` directement.** Il lit une
couleur *appliquée*. C'est cette indirection qui rend un thème sombre possible sans
retoucher un seul composant.

| Token | Pointe vers (thème clair) |
|---|---|
| `--color-background` | `--color-white` |
| `--color-surface` | `--color-white` |
| `--color-surface-alt` | `--color-white-soft` — sections alternées |
| `--color-surface-sunken` | `--color-gray-100` — zones en creux |
| `--color-border` | `--color-gray-200` |
| `--color-border-hover` | `--color-gray-400` |
| `--color-text` | `--color-black` |
| `--color-text-secondary` | `--color-gray-600` — texte courant secondaire |
| `--color-text-muted` | `--color-gray-500` — métadonnées |
| `--color-text-inverse` | `--color-white` |

Quatre tokens dépendent en plus du thème : `--nav-bg` (`rgba(255,255,255,0.72)`),
`--overlay-bg`, `--grid-line`, `--aurora-alpha`.

### 2.5 Contraste

Cible **WCAG AA** : 4,5:1 pour le texte courant, 3:1 pour le texte large (≥ 24 px) et les
bordures porteuses de sens. Deux pièges récurrents avec cette palette :

- `--color-text-muted` (`#737373`) sur `--color-white` passe (4,7:1), mais **échoue** dès
  qu'on le pose sur `--color-surface-sunken` en petit corps. Descendre à `--color-gray-600`.
- Le texte détouré en `--gradient-brand` (le `.hero-name`) n'est lisible qu'en très gros et
  très gras. **Interdit en dessous de `--font-size-3xl`** — en petit, utiliser `--accent-2` en aplat.

---

## 3. Typographie

| | Police | Emploi |
|---|---|---|
| `--font-sans` | **Inter** (fallback système) | Tout le contenu. Graisses chargées : 300, 400, 500, 600, 700, 900. |
| `--font-mono` | SF Mono / Monaco / Roboto Mono | Le « registre technique » : index de section, rôle du hero, terminal, sélecteur de langue, pourcentages. |

Le mono n'est pas décoratif : il marque **ce qui vient de la machine** (code, données,
numérotation). Il double visuellement les balises `<samp>`, `<var>`, `<code>` du volet sémantique.

### 3.1 Échelle

`--font-size-xs` 0.75rem · `sm` 0.875 · `base` 1 · `lg` 1.125 · `xl` 1.25 · `2xl` 1.5 ·
`3xl` 1.875 · `4xl` 2.25 · `5xl` 3rem.

Sous 768 px, l'échelle haute se contracte automatiquement via une redéclaration dans
`:root` (`5xl` → 2.25rem, `4xl` → 1.875rem, `3xl` → 1.5rem). **Ne jamais dupliquer cette
logique composant par composant** : c'est le token qui bouge, pas la règle.

### 3.2 Graisses et interlignes

`--font-weight-light` 300 → `--font-weight-black` 900. Interlignes : `--line-height-tight`
1.25 (titres), `normal` 1.5, `--line-height-relaxed` 1.75 (**valeur du `body`** — le confort
de lecture prime).

### 3.3 Règles d'écriture typographique

- **Titres** : `--font-weight-bold` minimum, interligne serré. Les grands titres portent un
  `letter-spacing` négatif (−0.02em pour un titre de section, −0.04em pour un titre héros) :
  plus c'est gros, plus c'est serré.
- **Titre héros** : `clamp(3.25rem, 11vw, 7.5rem)`, `font-weight: 900`, `line-height: 0.9`,
  détouré au dégradé. Un seul par site.
- **Fluidité** : `clamp()` pour les tailles héroïques, tokens pour tout le reste.
- Les majuscules forcées (`text-transform: uppercase`) s'accompagnent toujours d'un
  `letter-spacing` positif (0.06em à 0.15em) — sinon les capitales se collent.

---

## 4. Espacement et rythme

Échelle de 4 px (`0.25rem`) : `--space-1` … `--space-20` (0.25 → 5rem), avec les paliers
1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20.

**Aucune valeur d'espacement en dur.** Si un token manque, c'est le besoin qu'il faut
questionner, pas le token qu'il faut contourner.

| Usage | Valeur |
|---|---|
| Respiration verticale d'une section | `--space-20` (`--space-16` sous 768 px) |
| Titre de section → contenu | `--space-12` |
| Gouttière de conteneur | `--space-6` (`--space-4` sous 768 px) |
| Gouttière de grille de cartes | `--space-6` |
| Icône → label | `--space-2` |
| Largeur de contenu | `--container-xl` 1280 px, centré ; `--container-2xl` 1536 px pour la barre de navigation |
| Largeur de lecture | ~820 px pour la prose longue |

---

## 5. Formes, ombres et mouvement

**Rayons** — `--radius-sm` 0.25rem · `md` 0.5 (boutons) · `lg` 0.75 (cartes) · `xl` 1 ·
`2xl` 1.5 · `--radius-full` (pastilles, badges, avatars, sélecteurs).

**Ombres neutres** (`--shadow-xs` → `--shadow-2xl`) : élévation physique, noir translucide.
Elles portent la profondeur au repos.

**Halos néon** (`--glow-sm`, `--glow-md`, `--glow-lg`) : violet/cyan/rose diffus. Ils
portent l'**interaction**. La distinction est structurante :

> Une ombre dit *« cet élément est posé au-dessus »*. Un halo dit *« cet élément te répond »*.
> Au repos une carte a `--shadow-sm` ; au survol elle gagne `--shadow-lg` **et** `--glow-md`.

**Mouvement** — une seule courbe, `--ease: cubic-bezier(0.4, 0, 0.2, 1)`, et trois durées :
`--transition-fast` 150 ms (couleur, opacité), `--transition-base` 250 ms (défaut),
`--transition-slow` 350 ms (déplacements de fond).

Vocabulaire gestuel constant sur tous les sites :

- Survol d'élément interactif : `translateY(-2px)` + halo.
- Appui : `scale(0.98)`.
- Apparition au scroll : `fadeUp`, 0.6 s, décalages de 50 ms entre éléments frères.
- Ambiant (aurora, particules, dégradé animé) : ≥ 7 s, jamais au-dessus du contenu.

**Le respect de `prefers-reduced-motion: reduce` est non négociable** : animations et
transitions ramenées à `0.001ms`, `scroll-behavior: auto`, éléments révélés d'office.

---

## 6. Fonds

Trois couches empilées **sous** le contenu, toujours dans cet ordre :

| Couche | `z-index` | Rôle |
|---|---|---|
| Aurora (`body::before`) | `-3` | Trois nappes radiales cyan/violet/rose à `--aurora-alpha` (0.13), dérive de 24 s. |
| Réseau de particules (`#particleCanvas`) | `-2` | Optionnel, réactif au curseur. |
| Grille (`.grid-background`) | `-1` | Maille de 64 px en `--grid-line`, estompée par un masque radial. |

Tous ces fonds sont `pointer-events: none` et `aria-hidden="true"` : **décoratifs, donc
invisibles pour les technologies d'assistance**.

---

## 7. Composants

### 7.1 Boutons

Base `.btn` : `inline-flex`, `gap: --space-2`, `padding: --space-3 --space-6`, bordure de
2 px, `--radius-md`, graisse 500.

- **`.btn-primary`** — fond `--gradient-brand` en `background-size: 180%`, texte blanc,
  `--glow-sm`. Au survol, le dégradé **glisse** (`background-position: 0% → 100%`) ; la
  couleur ne change pas, elle se déplace. Un seul bouton primaire par vue.
- **`.btn-secondary`** — transparent, bordure violette à 55 %, texte `--color-text`. Au
  survol : voile violet à 10 %, texte et bordure en `--accent-2`.

### 7.2 Cartes

Une base unique, partagée par tous les types de cartes : `--color-surface`, bordure 2 px
`--color-border`, `--radius-lg`, `--shadow-sm`.

Trois effets se composent au survol, et c'est cette combinaison qui fait la carte « maison » :

1. **Halo** : bordure violette à 55 % + `--shadow-lg, --glow-md`.
2. **Spotlight** : lueur violette de 260 px suivant le curseur, via les variables `--mx`/`--my`
   posées en JS et un `--spot` qui passe de 0 à 1. Le fond reste un `radial-gradient` empilé
   au-dessus de `--color-surface` — donc **inactif tant que `--spot` vaut 0**, sans coût.
3. **Liseré** : filet de 3 px en `--gradient-brand` en haut, révélé en opacité.

### 7.3 Barre de navigation

Fixe, fond `--nav-bg` translucide + `backdrop-filter: blur(12px) saturate(180%)`, bordure
basse. À partir de 40 px de défilement (`.scrolled`) : padding réduit et ombre violette diffuse.

Le lien porte un soulignement de 2 px en `--gradient-brand` qui **croît de 0 à 100 %** au
survol comme à l'état actif. Sous 1080 px, bascule en menu burger latéral (`min(80%, 360px)`),
les trois barres du bouton se transformant en croix.

### 7.4 En-tête de section

Signature éditoriale, présente sur chaque section : **`01` — Titre ─────────**

Index en mono violet (`letter-spacing: 0.15em`), titre en graisse 900, puis un filet dégradé
violet → transparent qui occupe l'espace restant.

### 7.5 Badges et pastilles

`--radius-full`, fond `--gradient-brand-soft` sur `--color-surface`, bordure violette à 35 %,
`--glow-sm`. La pastille d'état (8 px) prend une couleur **sémantique** (`--color-success`
pour « disponible ») et pulse en 2 s via une onde de `box-shadow`.

---

## 8. Thème sombre

L'architecture est prête — `--color-text`, `--color-surface`, `--nav-bg`, `--aurora-alpha`
sont conçus pour être réassignés en bloc — mais **l'implémentation est aujourd'hui absente**
(voir §12). Pour tout nouveau site, la marche à suivre est :

```css
body.dark-theme {
    --color-background: var(--color-black);
    --color-surface: var(--color-black-soft);
    --color-surface-alt: var(--color-gray-900);
    --color-surface-sunken: var(--color-black);
    --color-border: var(--color-gray-800);
    --color-border-hover: var(--color-gray-600);
    --color-text: var(--color-white);
    --color-text-secondary: var(--color-gray-400);
    --color-text-muted: var(--color-gray-500);
    --color-text-inverse: var(--color-black);
    --nav-bg: rgba(10, 10, 10, 0.72);
    --grid-line: rgba(139, 92, 246, 0.10);
    --aurora-alpha: 0.18;
}
```

Trois règles : **aucun composant n'est modifié** (seuls les tokens bougent) ; les accents
néon **ne changent pas** (ils sont pensés pour les deux fonds) ; l'aurora monte légèrement
en intensité sur fond sombre, où elle est plus lisible.

---

## 9. Fondations d'une page

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="…">   <!-- ~155 caractères, unique par page -->
    <title>…</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/portfolio.css">
    <meta name="theme-color" content="#0A0A0A">
    <!-- Open Graph + Twitter Card : titre, description, image -->
    <script>document.documentElement.classList.add('js');</script>
</head>
```

Éléments obligatoires, sans exception :

- `lang` sur `<html>`, adapté à la langue réellement servie.
- Un `.skip-link` en **premier élément focalisable** du `<body>`.
- `:focus-visible` — contour de 2 px `--color-text`, `outline-offset: 3px`. **Jamais
  `outline: none` sans remplacement.**
- `.sr-only` pour le texte réservé aux lecteurs d'écran.
- La classe `js` posée avant le rendu, pour que les animations de révélation ne masquent
  jamais le contenu si le JS échoue.

**Icônes** : Font Awesome 6, dans un `<i>` systématiquement `aria-hidden="true"` — une icône
ne porte jamais l'information seule.

---

## 10. Sémantique — la règle

> **Zéro `<div>`, zéro `<span>`.** C'est une contrainte de conception, au même titre que la
> palette. Objectif atteint et vérifié sur `index.html` et les cinq pages projets.

Ce n'est pas du purisme. Une balise juste produit un **arbre d'accessibilité** juste, des
**landmarks** navigables au lecteur d'écran, un balisage exploitable par les moteurs, et un
code où la structure se lit sans ouvrir le CSS.

**Chaque balise doit pouvoir être justifiée par le sens du contenu, pas par son apparence.**
Si aucune balise sémantique valide ne convient, on **restructure** — on n'invente pas une
fausse `<section>`. Corollaire déjà appliqué : jamais de `<section>` directement dans une
`<section>`, jamais un `<p>` détourné en conteneur.

Détail complet et catalogue exhaustif : [`semantique-html.md`](semantique-html.md).

### 10.1 Remplacer `<div>` (bloc)

| Intention | Balise |
|---|---|
| Région thématique avec un titre | `<section>` |
| Contenu autonome, redistribuable (carte projet, avis, entrée de CV) | `<article>` |
| En-tête d'une page, section ou carte | `<header>` |
| Titre + accroche/sous-titre associés | `<hgroup>` |
| Contenu tangentiel (encart, colonne méta, décor) | `<aside>` |
| Navigation (plusieurs par page → `aria-label` distinct) | `<nav>` |
| Contenu principal unique de la page | `<main>` |
| Pied de page ou de section | `<footer>` |
| Énumération (colonnes de pied de page, listes de cartes) | `<ul>` / `<li>` |
| Illustration + légende | `<figure>` / `<figcaption>` |
| Groupe de contrôles | `<section role="group">` |
| Boîte purement visuelle, vide, décorative | `<i aria-hidden="true">` |

### 10.2 Remplacer `<span>` (en ligne)

| Intention | Balise |
|---|---|
| Icône, pastille, barre, calque décoratif | `<i aria-hidden="true">` |
| Label stylé sans importance accrue (nom de marque, cible `data-i18n`) | `<b>` |
| Chiffre clé, texte à forte importance | `<strong>` |
| Valeur exploitable par la machine (compteur, pourcentage) | `<data value="…">` |
| Date, heure, durée | `<time datetime="…">` |
| Sortie ou invite d'un système (terminal) | `<samp>` |
| Variable, propriété, identifiant | `<var>` |
| Code source | `<code>` |
| Emphase de ton (rare — c'est de l'oral, pas du style) | `<em>` |
| **Aucun attribut à conserver** | *supprimer* — laisser le texte nu |

Cette dernière ligne compte : un `<span>Retour</span>` dans un `.btn` en `inline-flex` avec
`gap` se supprime purement et simplement. Le rendu est identique.

### 10.3 Discipline permanente

- **Un seul `<h1>` par page.** Hiérarchie de titres sans saut (`h2` → `h4` interdit).
- `<header>`, `<nav>`, `<main>`, `<footer>` présents et uniques dans leur rôle.
- `alt` sur chaque `<img>` — **vide** (`alt=""`) si l'image est décorative, jamais absent.
- Tout ce qui est décoratif : `aria-hidden="true"` **et** `pointer-events: none`.
- Un bouton qui agit sur la page est un `<button>` ; ce qui navigue est un `<a>`.

### 10.4 Cohabitation avec le CSS

Passer en full-sémantique introduit des styles par défaut du navigateur qu'un `<div>` ou un
`<span>` n'avait pas. On les neutralise en **un bloc unique de faible spécificité**, juste
après le reset — de sorte que toutes les règles de classe gardent la priorité :

```css
b    { font-weight: inherit; }   /* <b> porteur de label : poids hérité */
i    { font-style: normal; }     /* <i> décoratif : pas d'italique */
var  { font-style: normal; }
samp { font-family: inherit; }
```

Deux réflexes qui vont avec :

- Un `<i>` est **inline** par nature : hors contexte flex, réappliquer `display: block`
  (cas de `.gh-lang-bar`).
- Ne jamais écrire de sélecteur qualifié par balise générique (`.x span`, `.x div`) : il
  casse à la première conversion. Cibler la classe.

---

## 11. Checklist de démarrage

Pour tout nouveau site repartant de cette charte :

1. Copier le bloc `:root` des tokens (§2 à §5) — **sans le modifier**. Un projet ajoute des
   tokens ; il n'en redéfinit pas la valeur.
2. Copier le reset + le bloc de normalisation sémantique (§10.4).
3. Poser les fondations de page (§9) : metas, skip-link, focus-visible, `.sr-only`, classe `js`.
4. Construire avec les composants de §7 avant d'en créer un nouveau.
5. Écrire le HTML **sans jamais taper `<div>` ni `<span>`** (§10).
6. Vérifier avant livraison :
   - `grep -c "<div\|<span" *.html` → **0**
   - un seul `<h1>`, hiérarchie de titres continue
   - navigation complète au clavier, focus toujours visible
   - contrastes AA
   - rendu avec `prefers-reduced-motion: reduce` activé
   - validateur W3C sans erreur

---

## 12. Écarts connus (état au 16 juillet 2026)

Constats relevés dans le portfolio en rédigeant cette charte. Ils ne remettent pas en cause
les règles ci-dessus — ce sont des dettes à résorber.

- **Le thème sombre ne fonctionne pas.** `ThemeToggle` pose bien `.dark-theme` sur le
  `<body>` ([ThemeToggle.js:41](../assets/js/modules/ThemeToggle.js#L41)), mais **aucune règle
  CSS ne définit `.dark-theme`** dans `assets/css/` : le bouton bascule l'icône sans rien
  changer d'autre. Les tokens marqués « dépendant du thème » ne sont jamais réassignés. Le
  bloc du §8 corrige le manque.
- **Régression sémantique sur les landing pages.** `alternance.html` (24 `<div>`, 48 `<span>`)
  et `fivem.html` (22 `<div>`, 18 `<span>`) n'ont pas été passées en full-sémantique, et
  `index.html` a récupéré un `<div class="lp-switch">` avec un `<span>` au passage. Les cinq
  pages `projects/` restent à 0. Les tables §10.1 et §10.2 donnent les conversions.
- **Sauts de titres** (`h2` → `h4`) subsistant dans certaines sections de pages projets,
  signalés dans [`semantique-html.md`](semantique-html.md#173-dette-restante) et non corrigés car
  la correction déplacerait le rendu.
- **Pas de `<main>`** sur les pages existantes, écart documenté à l'époque de la refonte.
  À poser d'office sur tout nouveau site (§10.3).