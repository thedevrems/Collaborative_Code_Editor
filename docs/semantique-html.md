# La sémantique HTML — Guide complet et application au site

> Objectif : comprendre comment fonctionne la sémantique en HTML, connaître le rôle de **chaque balise**, et apprendre à écrire une structure **parfaitement sémantique sans aucun `<div>` ni `<span>`**.

Ce document réunit deux volets, autrefois séparés :

- **Partie I — Le guide (§1 à §12)** : la référence intemporelle. Théorie, catalogue exhaustif des balises, tables de correspondance. C'est ce qu'on consulte pour savoir *quelle balise choisir*.
- **Partie II — L'application au site (§13 à §17)** : le compte rendu de la refonte full-sémantique du 26 juin 2026, les conversions réellement appliquées, et l'**état actuel** du site. C'est ce qu'on consulte pour savoir *où on en est*.

La direction artistique (couleurs, typographie, composants) fait l'objet d'un document distinct : [`charte-graphique.md`](charte-graphique.md), dont le volet sémantique renvoie ici.

---

# Partie I — Le guide

## 1. Qu'est-ce que la sémantique HTML ?

Le HTML **sémantique** consiste à choisir ses balises en fonction du **sens** (le rôle) du contenu, et non de son apparence.

- Une balise sémantique **décrit ce qu'est le contenu** : « ceci est un titre », « ceci est une navigation », « ceci est un article autonome ».
- Une balise non-sémantique (`<div>`, `<span>`) **ne décrit rien** : c'est une boîte vide de sens, un simple conteneur générique.

Comparaison directe :

```html
<!-- Non sémantique : que représente cette boîte ? Impossible à savoir -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- Sémantique : le sens est porté par la balise elle-même -->
<header>
  <nav>...</nav>
</header>
```

Le second exemple est compréhensible **sans regarder le CSS ni les classes**. C'est tout l'enjeu.

---

## 2. Comment ça fonctionne (sous le capot) ?

La sémantique n'est pas qu'une question de lisibilité du code. Elle a des effets techniques concrets.

### 2.1 L'arbre d'accessibilité (accessibility tree)

En plus du DOM, le navigateur construit un **arbre d'accessibilité** : une représentation simplifiée de la page destinée aux technologies d'assistance (lecteurs d'écran comme NVDA, VoiceOver, JAWS).

Chaque balise sémantique possède un **rôle ARIA implicite** :

| Balise      | Rôle implicite | Conséquence |
|-------------|----------------|-------------|
| `<nav>`     | `navigation`   | Repère navigable au clavier/lecteur d'écran |
| `<main>`    | `main`         | Le lecteur d'écran peut « sauter au contenu » |
| `<button>`  | `button`       | Cliquable, focusable, activable au clavier |
| `<header>`  | `banner`       | Repère d'en-tête de page |
| `<div>`     | *(aucun)*      | Invisible pour la navigation par repères |

Un `<div onclick>` n'est **ni focusable ni activable au clavier** ; un `<button>` l'est nativement. C'est la différence entre « ça marche à la souris » et « ça marche pour tout le monde ».

### 2.2 Les landmarks (repères)

Les balises de sectionnement créent des **landmarks** : des points de repère qui permettent à un utilisateur de lecteur d'écran de sauter directement à la navigation, au contenu principal, au pied de page, etc. Sans elles, la page est un bloc indistinct.

### 2.3 Le référencement (SEO)

Les moteurs de recherche utilisent la structure sémantique pour comprendre la hiérarchie de l'information : `<article>`, `<h1>`, `<time>`, les données structurées… Une page bien balisée est mieux indexée et mieux comprise.

### 2.4 La maintenabilité

Un code sémantique se lit comme un plan. Six mois plus tard (ou pour un collègue), `<aside>` est immédiatement compris, là où `<div class="sidebar-2-new">` demande une enquête.

---

## 3. La philosophie « zéro `<div>`, zéro `<span>` »

`<div>` et `<span>` sont les **seules** balises HTML totalement dépourvues de sens :

- `<div>` = conteneur **générique de type bloc** (sans signification) ;
- `<span>` = conteneur **générique en ligne** (sans signification).

### 3.1 La règle absolue

> **Une sémantique *parfaite* ne contient strictement aucun `<div>` et aucun `<span>` — pas un seul.**

Ce n'est pas une simple formule : c'est la **définition même** de la perfection sémantique. Dès qu'un `<div>` ou un `<span>` apparaît dans le document, c'est qu'au moins un fragment de la page n'exprime **pas** ce qu'il est. La sémantique cesse alors d'être parfaite.

Pourquoi est-ce réellement atteignable ? Parce que le HTML moderne fournit une balise **porteuse de sens pour tous les besoins de contenu** : sectionnement, regroupement, texte en ligne, formulaires, média… Il n'existe **aucun cas de *contenu*** pour lequel `<div>` ou `<span>` serait la seule réponse possible. La règle de conversion est donc systématique :

- Un bloc qui regroupe une thématique ? → `<section>`
- Une zone d'en-tête ? → `<header>`
- Un regroupement d'éléments listés ? → `<ul>` / `<ol>` + `<li>`
- Un mot important ? → `<strong>`
- Une date ? → `<time>`
- Un terme technique ? → `<dfn>` ou `<code>`

Les tableaux des sections 7 et 8 donnent la correspondance complète : pour **chaque** usage courant de `<div>` ou de `<span>`, la balise sémantique qui le remplace.

### 3.2 Chaque balise doit pouvoir être justifiée

Corollaire direct de la règle absolue : **toute balise présente dans le document doit avoir une justification concrète et immédiate.** Le test est simple :

> Pour chaque balise, demandez-vous : *« Pourquoi celle-ci, et pas une autre ? »* Si la réponse est *« pour faire une boîte »* ou *« pour styler »*, la balise n'est **pas** justifiée — il en existe une qui dit *ce que c'est*.

Une balise est justifiée quand elle répond à la question **« qu'est-ce que ce contenu représente ? »**, et non à la question « à quoi ça ressemble ? ».

Exemples de justification concrète :

| Code | Justification | Verdict |
|------|---------------|---------|
| `<nav>` autour du menu | « C'est la navigation principale du site. » | ✅ Justifié |
| `<time datetime="2026-06-25">` | « C'est une date, exploitable par la machine. » | ✅ Justifié |
| `<article>` autour d'un billet | « Ce contenu est autonome et redistribuable. » | ✅ Justifié |
| `<strong>` sur un avertissement | « Ce passage a une forte importance. » | ✅ Justifié |
| `<div class="menu">` | « C'est… une boîte pour le menu. » | ❌ Non justifié → `<nav>` |
| `<span class="date">` | « C'est… du texte que je veux styler. » | ❌ Non justifié → `<time>` |
| `<div class="row">` | « C'est pour aligner en flexbox. » | ❌ Mise en page, pas du sens → voir §11 |

Si vous ne savez pas justifier une balise par son **sens**, c'est presque toujours le signe qu'une balise plus précise existe.

---

## 4. Catalogue des balises de structure et de bloc

### 4.1 Squelette du document

| Balise   | Description |
|----------|-------------|
| `<html>` | Racine du document. Porte l'attribut `lang` (ex. `lang="fr"`) essentiel à l'accessibilité et au SEO. |
| `<head>` | Contient les **métadonnées** (non affichées) : titre, encodage, liens CSS, etc. |
| `<body>` | Contient tout le **contenu visible** de la page. |

### 4.2 Sections et repères (landmarks)

| Balise      | Rôle | Description |
|-------------|------|-------------|
| `<header>`  | `banner` | En-tête : logo, titre, navigation principale. Peut aussi servir d'en-tête local à un `<article>` ou une `<section>`. |
| `<nav>`     | `navigation` | Bloc de **liens de navigation** majeurs (menu principal, fil d'Ariane, pagination). |
| `<main>`    | `main` | Le **contenu principal et unique** de la page. **Un seul par page.** |
| `<article>` | `article` | Contenu **autonome et redistribuable** : article de blog, commentaire, fiche produit, carte… Doit garder son sens sorti de son contexte. |
| `<section>` | `region`* | Regroupement **thématique** de contenu, normalement introduit par un titre (`<h1>`–`<h6>`). |
| `<aside>`   | `complementary` | Contenu **tangentiellement lié** : encart, barre latérale, note, publicité. |
| `<footer>`  | `contentinfo` | Pied de page : copyright, mentions légales, liens secondaires. Local possible à un `<article>`/`<section>`. |
| `<address>` | — | Coordonnées de contact de l'auteur de l'article ou de la page (e-mail, adresse). Pas pour une adresse postale quelconque. |
| `<search>`  | `search` | Regroupe les éléments d'une **fonction de recherche** (champ + bouton). Balise récente. |

\* `<section>` n'obtient le rôle `region` que si elle possède un nom accessible (via `aria-label` ou un titre).

### 4.3 Titres

| Balise        | Description |
|---------------|-------------|
| `<h1>`–`<h6>` | Titres hiérarchiques, de `<h1>` (le plus important) à `<h6>`. **Ne pas sauter de niveaux** (h1 → h3) : la hiérarchie construit le plan du document. |
| `<hgroup>`    | Regroupe un titre principal avec un ou plusieurs paragraphes secondaires (sous-titre, accroche) liés à ce titre. |

### 4.4 Regroupement de contenu (niveau bloc)

| Balise         | Description |
|----------------|-------------|
| `<p>`          | Paragraphe de texte. |
| `<ul>`         | Liste **non ordonnée** (l'ordre n'a pas d'importance). |
| `<ol>`         | Liste **ordonnée** (l'ordre compte : étapes, classement). |
| `<li>`         | Élément d'une liste `<ul>` ou `<ol>`. |
| `<dl>`         | Liste de **descriptions** (paires terme/définition, ou clé/valeur). |
| `<dt>`         | Terme décrit dans une `<dl>`. |
| `<dd>`         | Description/valeur associée au `<dt>`. |
| `<figure>`     | Contenu **autonome référencé** (image, schéma, extrait de code, tableau) avec sa légende. |
| `<figcaption>` | Légende d'un `<figure>`. |
| `<blockquote>` | **Citation longue** en bloc. Attribut `cite` pour l'URL source. |
| `<pre>`        | Texte **préformaté** : les espaces et retours à la ligne sont conservés (idéal pour le code). |
| `<hr>`         | Rupture **thématique** entre deux paragraphes (changement de sujet), pas une simple ligne décorative. |
| `<menu>`       | Liste sémantique de commandes/actions (variante de `<ul>` orientée interactions). |

### 4.5 Les conteneurs génériques — `<div>` et `<span>` (à proscrire)

Par souci d'exhaustivité, voici les deux balises que ce guide vise à **bannir** du HTML sémantique parfait. Elles existent, il faut donc savoir les reconnaître — mais une sémantique parfaite n'en contient **aucune**.

| Balise   | Description |
|----------|-------------|
| `<div>`  | Conteneur **générique de type bloc**, **sans aucune signification** : ce n'est qu'une boîte. Aucun rôle d'accessibilité, invisible pour la navigation par repères. À remplacer systématiquement par une balise sémantique (voir §7). |
| `<span>` | Conteneur **générique en ligne**, **sans aucune signification** : sert uniquement à cibler un fragment de texte. Aucun apport sémantique. À remplacer systématiquement par une balise de texte en ligne (voir §8). |

---

## 5. Catalogue des balises de texte en ligne — *le vrai remplacement de `<span>`*

C'est ici que se joue l'essentiel du « zéro span ». À chaque fois qu'on voudrait colorer ou marquer un bout de texte, une balise sémantique existe.

### 5.1 Importance, emphase et mise en relief

| Balise     | Description |
|------------|-------------|
| `<strong>` | **Forte importance**, gravité, urgence. Sémantique (≠ simplement « en gras »). |
| `<em>`     | **Emphase** (insistance qui change le sens de la phrase). Sémantique (≠ simplement « en italique »). |
| `<b>`      | Texte **stylistiquement distinct** sans importance accrue : mots-clés, nom de produit. À utiliser en dernier recours. |
| `<i>`      | **Voix ou ton alternatif** : terme étranger, nom scientifique, pensée, terme technique isolé. |
| `<mark>`   | Texte **surligné / mis en évidence** par pertinence dans le contexte courant (ex. résultats d'une recherche). |
| `<small>`  | Commentaire secondaire, mentions légales, « petits caractères ». |
| `<u>`      | Annotation **non textuelle** (ex. souligner une faute d'orthographe). Usage rare et prudent. |

### 5.2 Citations, termes et définitions

| Balise   | Description |
|----------|-------------|
| `<a>`     | **Lien hypertexte** (ancre). Attribut `href`. La balise interactive fondamentale. |
| `<q>`     | **Citation courte** en ligne (le navigateur ajoute les guillemets). |
| `<cite>`  | **Titre d'une œuvre** (livre, film, article, logiciel). Selon la spec, pas le nom de l'auteur. |
| `<abbr>`  | **Abréviation / sigle**. L'attribut `title` donne la forme développée (ex. `<abbr title="HyperText Markup Language">HTML</abbr>`). |
| `<dfn>`   | **Instance de définition** d'un terme (la première fois qu'on le définit). |

### 5.3 Code et informatique

| Balise   | Description |
|----------|-------------|
| `<code>` | Fragment de **code** ou nom de variable/fonction en ligne. |
| `<kbd>`  | **Saisie clavier** de l'utilisateur (ex. `<kbd>Ctrl</kbd>+<kbd>C</kbd>`). |
| `<samp>` | **Sortie** d'un programme ou d'un système. |
| `<var>`  | **Variable** (mathématique ou de programmation). |

### 5.4 Données machine et temps

| Balise   | Description |
|----------|-------------|
| `<time>` | Date/heure **lisible par la machine** via `datetime` (ex. `<time datetime="2026-06-25">25 juin</time>`). Excellent pour le SEO. |
| `<data>` | Associe un contenu affiché à une **valeur machine** via `value` (ex. un identifiant produit). |

### 5.5 Édition et révisions

| Balise  | Description |
|---------|-------------|
| `<ins>` | Texte **inséré** lors d'une révision (souligné par défaut). Attributs `cite`, `datetime`. |
| `<del>` | Texte **supprimé** lors d'une révision (barré par défaut). |
| `<s>`   | Contenu **qui n'est plus exact ou pertinent** (ex. ancien prix barré). À distinguer de `<del>` (édition). |

### 5.6 Position, direction et césure

| Balise   | Description |
|----------|-------------|
| `<sub>`  | **Indice** (ex. H<sub>2</sub>O). |
| `<sup>`  | **Exposant** (ex. m<sup>2</sup>, 1<sup>er</sup>). |
| `<br>`   | **Retour à la ligne** forcé (à n'utiliser que là où le saut de ligne fait partie du contenu : adresse, poème). |
| `<wbr>`  | Indique une **opportunité de césure** dans un mot très long. |
| `<bdi>`  | Isole un texte dont la **direction** (gauche↔droite) peut différer (ex. nom en arabe dans une phrase française). |
| `<bdo>`  | **Force** la direction du texte via `dir`. |

### 5.7 Annotations est-asiatiques (ruby)

| Balise   | Description |
|----------|-------------|
| `<ruby>` | Conteneur d'**annotation ruby** (prononciation au-dessus des caractères, ex. furigana). |
| `<rt>`   | Le texte d'annotation (la prononciation). |
| `<rp>`   | Parenthèses de **repli** pour les navigateurs ne supportant pas ruby. |

---

## 6. Catalogue : tableaux, formulaires et média

### 6.1 Tableaux de données

| Balise       | Description |
|--------------|-------------|
| `<table>`    | Tableau de **données** (jamais pour la mise en page !). |
| `<caption>`  | Titre/légende du tableau. |
| `<thead>`    | Groupe d'en-tête du tableau. |
| `<tbody>`    | Corps du tableau (données). |
| `<tfoot>`    | Pied du tableau (totaux). |
| `<tr>`       | Ligne du tableau. |
| `<th>`       | Cellule **d'en-tête** (attribut `scope="col"`/`"row"`). |
| `<td>`       | Cellule de **donnée**. |
| `<colgroup>` | Groupe de colonnes. |
| `<col>`      | Définition d'une colonne (pour le style/portée). |

### 6.2 Formulaires

| Balise       | Description |
|--------------|-------------|
| `<form>`     | Formulaire (groupe de contrôles à soumettre). |
| `<label>`    | **Étiquette** liée à un champ via `for` (ou en l'englobant). Indispensable à l'accessibilité. |
| `<input>`    | Champ de saisie polyvalent (`type="text/email/checkbox/radio/date/…"`). |
| `<textarea>` | Zone de texte **multiligne**. |
| `<button>`   | **Bouton** (`type="submit/reset/button"`). |
| `<select>`   | Liste déroulante. |
| `<option>`   | Option d'un `<select>` (ou `<datalist>`). |
| `<optgroup>` | Groupe d'options. |
| `<datalist>` | Liste de **suggestions** d'autocomplétion pour un `<input>`. |
| `<fieldset>` | **Regroupe** des contrôles liés (remplace avantageusement un `<div>` de groupe). |
| `<legend>`   | Titre d'un `<fieldset>`. |
| `<output>`   | Résultat d'un **calcul** ou d'une action utilisateur. |
| `<progress>` | Barre de **progression** d'une tâche (`value`, `max`). |
| `<meter>`    | **Mesure scalaire** dans un intervalle connu (ex. niveau de batterie, score). |

### 6.3 Média et contenu embarqué

| Balise      | Description |
|-------------|-------------|
| `<img>`     | Image. L'attribut `alt` (texte alternatif) est **obligatoire** pour l'accessibilité. |
| `<picture>` | Conteneur d'images **responsives** (choisit la source selon l'écran). |
| `<source>`  | Source alternative pour `<picture>`, `<audio>`, `<video>`. |
| `<audio>`   | Lecteur audio. |
| `<video>`   | Lecteur vidéo. |
| `<track>`   | Pistes de **sous-titres**/légendes pour `<audio>`/`<video>`. |
| `<canvas>`  | Zone de **dessin 2D/3D** scriptée (jeux, visualisations). Pertinent pour le dev de jeux. |
| `<svg>`     | Graphisme **vectoriel** intégré (icônes, schémas, diagrammes). |
| `<iframe>`  | Document **embarqué** (carte, vidéo externe). |
| `<embed>`   | Ressource externe/plugin. |
| `<object>`  | Ressource externe (PDF, média) avec contenu de repli. |
| `<map>` / `<area>` | Carte d'image cliquable (zones réactives sur une image). |

### 6.4 Interactif natif

| Balise        | Description |
|---------------|-------------|
| `<details>`   | Bloc **dépliable/repliable** natif (accordéon sans JavaScript). |
| `<summary>`   | En-tête cliquable d'un `<details>`. |
| `<dialog>`    | **Boîte de dialogue** / modale native (`showModal()`). |

### 6.5 Métadonnées (`<head>`)

| Balise        | Description |
|---------------|-------------|
| `<title>`     | Titre de l'onglet/de la page (crucial pour le SEO et les favoris). |
| `<meta>`      | Métadonnée : encodage (`charset`), viewport, description, Open Graph… |
| `<link>`      | Lien vers une ressource externe (feuille CSS, favicon, police). |
| `<style>`     | CSS intégré. |
| `<script>`    | Code JavaScript (interne ou externe via `src`). |
| `<noscript>`  | Contenu de repli si JavaScript est désactivé. |
| `<base>`      | URL de base pour tous les liens relatifs de la page. |
| `<template>`  | Fragment HTML **inerte**, cloné par JavaScript à la demande. |

### 6.6 Composants Web et contenu étranger

| Balise     | Description |
|------------|-------------|
| `<slot>`   | Emplacement nommé dans un **composant Web** (Shadow DOM) où vient s'insérer le contenu fourni par l'utilisateur du composant. |
| `<math>`   | Racine d'une formule **MathML** (mathématiques) intégrée au HTML. |

> Note : `<svg>` (vu en 6.3) et `<math>` sont des **contenus étrangers** : à l'intérieur, ils suivent leur propre vocabulaire de balises (ex. `<circle>`, `<path>` pour SVG ; `<mi>`, `<mrow>` pour MathML).

---

## 7. Remplacer `<div>` : table de correspondance

| Au lieu de `<div>` pour…           | Utilisez            |
|------------------------------------|---------------------|
| L'en-tête de la page               | `<header>`          |
| Le menu de navigation              | `<nav>`             |
| Le contenu principal               | `<main>`            |
| Un article/billet/carte autonome   | `<article>`         |
| Un regroupement thématique         | `<section>`         |
| Une barre latérale / un encart     | `<aside>`           |
| Le pied de page                    | `<footer>`          |
| Une zone de recherche              | `<search>`          |
| Une image + sa légende             | `<figure>` + `<figcaption>` |
| Un groupe de champs de formulaire  | `<fieldset>` + `<legend>` |
| Une liste d'éléments               | `<ul>` / `<ol>` + `<li>` |
| Un accordéon / bloc dépliable      | `<details>` + `<summary>` |
| Une modale                         | `<dialog>`          |
| Les coordonnées de contact         | `<address>`         |

---

## 8. Remplacer `<span>` : table de correspondance

| Au lieu de `<span>` pour…              | Utilisez   |
|----------------------------------------|------------|
| Un mot important                       | `<strong>` |
| Une insistance qui change le sens      | `<em>`     |
| Un mot-clé / nom de produit (stylé)    | `<b>`      |
| Un terme étranger / pensée / nom latin | `<i>`      |
| Du texte surligné par pertinence       | `<mark>`   |
| Une date ou une heure                  | `<time>`   |
| Un sigle/une abréviation               | `<abbr>`   |
| Le titre d'une œuvre                   | `<cite>`   |
| Une définition de terme                | `<dfn>`    |
| Du code en ligne                       | `<code>`   |
| Une touche clavier                     | `<kbd>`    |
| Une valeur machine                     | `<data>`   |
| Un texte supprimé / inséré             | `<del>` / `<ins>` |
| Un indice / exposant                   | `<sub>` / `<sup>` |
| Une mention légale, petits caractères  | `<small>`  |

---

## 9. Exemple complet : une page **sans aucun `<div>` ni `<span>`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — Le HTML sémantique</title>
</head>
<body>

  <header>
    <h1>Mon blog technique</h1>
    <nav aria-label="Navigation principale">
      <ul>
        <li><a href="/">Accueil</a></li>
        <li><a href="/articles">Articles</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Pourquoi abandonner les <code>&lt;div&gt;</code></h2>
        <p>Publié le
          <time datetime="2026-06-25">25 juin 2026</time>
          par <a href="/auteur/rems" rel="author">Rems</a>.
        </p>
      </header>

      <p>
        Le <abbr title="HyperText Markup Language">HTML</abbr> sémantique
        rend une page <strong>compréhensible par les machines</strong>
        autant que par les humains.
      </p>

      <section>
        <h3>Définition</h3>
        <p>
          La <dfn>sémantique</dfn> est l'art de choisir une balise
          pour son <em>sens</em>, pas pour son apparence.
        </p>
        <blockquote cite="https://html.spec.whatwg.org/">
          <p>Use the element that best represents the meaning of the content.</p>
        </blockquote>
      </section>

      <figure>
        <img src="schema.svg" alt="Schéma de l'arbre d'accessibilité">
        <figcaption>L'arbre d'accessibilité construit à partir du DOM sémantique.</figcaption>
      </figure>

      <footer>
        <p><small>Article publié sous licence libre.</small></p>
      </footer>
    </article>

    <aside aria-label="Articles liés">
      <h2>À lire aussi</h2>
      <ul>
        <li><a href="/aria">Introduction à ARIA</a></li>
        <li><a href="/a11y">Bases de l'accessibilité</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <address>
      Me contacter : <a href="mailto:contact@exemple.fr">contact@exemple.fr</a>
    </address>
    <p><small>&copy; 2026 — Tous droits réservés.</small></p>
  </footer>

</body>
</html>
```

Cette page est **100 % sémantique** : chaque balise porte un sens, la navigation au lecteur d'écran fonctionne (repères `banner`, `navigation`, `main`, `complementary`, `contentinfo`), et le SEO dispose de toutes les informations structurées.

---

## 10. Bonnes pratiques et pièges fréquents

- **Un seul `<h1>` et un seul `<main>`** par page.
- **Ne jamais sauter de niveau de titre** (`<h1>` → `<h3>`) : la hiérarchie est un plan.
- `<section>` n'est pas un `<div>` : elle doit représenter une **thématique** et porter (idéalement) un titre.
- `<article>` doit garder son sens **sorti de la page** (test : « est-ce que ça aurait du sens dans un flux RSS ? »).
- **`alt` obligatoire** sur les `<img>` (vide `alt=""` si l'image est purement décorative).
- **`<label>` lié à chaque champ** de formulaire.
- `<b>`/`<i>` sont des **derniers recours** : préférez `<strong>`/`<em>` quand il y a un sens, ou une balise plus précise (`<dfn>`, `<cite>`, `<code>`…).
- N'utilisez **jamais** un `<table>` pour la mise en page.

---

## 11. La sémantique « parfaite » face à la réalité des frameworks

Reprenons la règle absolue de la section 3 : **une sémantique parfaite ne contient aucun `<div>` ni `<span>`.** C'est l'objectif à viser, et il est entièrement atteignable pour tout ce qui relève du **contenu** — comme le prouve l'exemple complet de la section 9, qui n'en utilise pas un seul.

Il faut toutefois être honnête sur un point : en production, avec des frameworks comme **Angular** ou **React**, on voit parfois réapparaître `<div>` et `<span>` comme **purs crochets de mise en page** (un conteneur flex/grid qui ne porte aucun sens propre). Il est important de bien **nommer** ce qui se passe alors :

> Dès qu'un `<div>` ou un `<span>` apparaît, **on n'est plus dans une sémantique parfaite** — on fait un **compromis** entre pureté sémantique et contraintes de layout. Ce compromis peut être raisonnable, mais ce n'en est pas moins un écart par rapport à l'idéal.

Et même dans ce compromis, une seule chose est **strictement interdite** :

> Ne **jamais** utiliser `<div>` ou `<span>` pour **transporter du sens**. S'il reste un usage tolérable, c'est uniquement le **regroupement purement visuel**, là où aucune balise sémantique ne s'applique — et idéalement complété par un `role`/`aria-*`.

La hiérarchie de décision, du plus pur au compromis :

1. Existe-t-il une balise **sémantique** adaptée ? → l'utiliser. *(sémantique parfaite)*
2. Le besoin est-il **purement visuel**, sans aucune balise sémantique possible ? → `<div>`/`<span>` **sans rôle sémantique**. *(compromis assumé)*
3. Ce conteneur joue malgré tout un rôle d'interface ? → ajouter `role` + `aria-label` pour réparer le sens manquant.

En appliquant d'abord l'étape 1 partout où c'est possible, la quasi-totalité de vos `<div>` disparaissent — et vous vous rapprochez au plus près de l'idéal : **zéro `<div>`, zéro `<span>`**.

---

## 12. Annexe du guide — Balises obsolètes ou dépréciées (à ne pas utiliser)

Pour que ce guide couvre **toutes** les balises qui existent, voici les éléments encore reconnus par les navigateurs mais **officiellement obsolètes ou dépréciés**. Ils n'ont **aucune** place dans du HTML moderne — ils sont listés ici uniquement pour que vous sachiez les identifier (par exemple dans du vieux code) et les remplacer.

| Balise (obsolète) | Ce qu'elle faisait | Remplacement moderne |
|-------------------|--------------------|----------------------|
| `<acronym>`   | Acronyme | `<abbr>` |
| `<applet>`    | Applet Java embarquée | `<object>` / supprimé |
| `<bgsound>`   | Son de fond (Internet Explorer) | `<audio>` |
| `<big>`       | Texte plus grand | CSS (`font-size`) |
| `<blink>`     | Texte clignotant | Supprimé |
| `<center>`    | Centrage du contenu | CSS (`text-align`, `margin`) |
| `<content>`   | Insertion Shadow DOM v0 | `<slot>` |
| `<dir>`       | Liste de répertoires | `<ul>` |
| `<font>`      | Police, taille, couleur | CSS |
| `<frame>`     | Cadre d'un frameset | `<iframe>` / mise en page CSS |
| `<frameset>`  | Conteneur de cadres | Mise en page CSS moderne |
| `<image>`     | Variante erronée de `<img>` | `<img>` |
| `<keygen>`    | Génération de clé dans un formulaire | Supprimé (Web Crypto API) |
| `<marquee>`   | Texte défilant | CSS (animations / `@keyframes`) |
| `<menuitem>`  | Élément de menu contextuel | Supprimé |
| `<nobr>`      | Empêcher le retour à la ligne | CSS (`white-space: nowrap`) |
| `<noembed>`   | Repli pour `<embed>` | `<object>` + contenu de repli |
| `<noframes>`  | Repli pour un frameset | Supprimé |
| `<param>`     | Paramètre pour `<object>` | **Déprécié** — attributs sur `<object>` |
| `<plaintext>` | Texte brut (jusqu'à la fin) | `<pre>` + échappement |
| `<rb>`        | Base d'une annotation ruby | Implicite dans `<ruby>` |
| `<rtc>`       | Conteneur de texte ruby | `<rt>` |
| `<shadow>`    | Racine d'ombre v0 | `<slot>` / Shadow DOM moderne |
| `<spacer>`    | Espacement (Netscape) | CSS (`margin`, `padding`) |
| `<strike>`    | Texte barré | `<del>` (édition) ou `<s>` (obsolète) |
| `<tt>`        | Police à chasse fixe | `<code>`, `<kbd>`, `<samp>` ou CSS |
| `<xmp>`       | Texte préformaté brut | `<pre>` + échappement |

> ⚠️ Aucune de ces balises ne doit apparaître dans un nouveau document. Si vous en croisez une, c'est une **dette technique** à corriger.

---

# Partie II — L'application au site

> La partie I dit *quelle balise choisir*. La partie II raconte ce qui a été fait ici, comment, et ce qu'il reste à faire.

## 13. La refonte du 26 juin 2026

Conversion de l'intégralité du site d'alors en HTML **parfaitement sémantique** selon la partie I,
**sans modification du rendu visuel** (contrainte prioritaire).

### 13.1 Résultat de l'opération

| Fichier | `<div>` avant | `<span>` avant | `<div>` après | `<span>` après |
|---|---|---|---|---|
| `index.html` | 11 | 128 | **0** | **0** |
| `projects/blood-street.html` | 0 | 27 | **0** | **0** |
| `projects/websites.html` | 0 | 20 | **0** | **0** |
| `projects/android-apps.html` | 0 | 20 | **0** | **0** |
| `projects/fivem-scripts.html` | 0 | 16 | **0** | **0** |
| `projects/stage-mgen.html` | 12 | 33 | **0** | **0** |
| Modules JS (markup généré) | ~9 | ~11 | **0** | **0** |

**À l'issue de la refonte : 0 `<div>` et 0 `<span>`** sur l'ensemble du site (HTML statique + DOM
généré par JS). Aucune exception conservée — objectif §3 atteint à 100 %.

> ⚠️ Ce tableau est un **instantané daté**. Il ne décrit plus l'état du site : voir §17.

### 13.2 Deux décisions structurantes (validées avec l'utilisateur)

1. **Zéro absolu** : même les éléments purement décoratifs et vides sont convertis
   (décoratifs → `<i>` ; jetons de code → `<b>`/`<var>`/`<samp>`/`<data>`), avec
   neutralisation CSS ciblée (§15).
2. **Sémantique valide avant tout** : aucune `<section>` directement dans une `<section>`,
   aucun `<p>` détourné en conteneur. Les rares boîtes de mise en page sans équivalent
   sémantique valide ont été **restructurées** (pas remplacées par une fausse section).

## 14. Conversions appliquées

Les tables §7 et §8 donnent la règle générale. Voici comment elle s'est traduite, cas par cas,
sur ce site — utile comme jurisprudence quand un cas similaire se représente.

### 14.1 `<div>` → balise de bloc

| Élément (classe) | Page(s) | Balise choisie | Justification |
|---|---|---|---|
| `.lang-toggle` | index | `<section role="group">` | Groupe de contrôles (sélecteur de langue), `role`/`aria` conservés. |
| `.hero-badges` | index | `<section>` | Regroupement thématique de badges de statut (dans un `<article>`). |
| `.about-bento` | index | `<section>` | Région thématique « À propos » regroupant des cartes `<article>`. |
| `.bento-ai-body` | index | `<section>` | Région de contenu de la carte IA (dans l'`<article>` de la carte). |
| `.bento-ai-text` | index | `<header>` | En-tête de la carte (titre + description). |
| `#skillsContainer` | index | `<section>` | Région regroupant les catégories de compétences (cible JS). |
| `.cv-content` | index | `<section>` | Région présentant le CV (visionneuse + actions). |
| `.contact-statement` | index | `<hgroup>` | Titre + accroche associés (h3 + paragraphe d'intro). |
| `.footer-grid` | index | `<ul>` + `<li>` | Liste des colonnes de pied de page (`<header>`/`<section>` interdits dans `<footer>`). |
| `.footer-brand` | index | `<li>` | Colonne « marque » du pied de page (élément de la liste ci-dessus). |
| `.footer-bottom` | index | `<section>` | Bandeau bas du pied de page (dans `<footer>`, pas de section imbriquée). |
| `.report-status` (interne) | stage-mgen | `<hgroup>` | Titre + phrase d'accroche du bandeau « en préparation ». |
| `.company-card` | stage-mgen | `<header>` | En-tête de présentation de l'entreprise (logo + identité). |
| `.company-head` | stage-mgen | `<hgroup>` | Nom + signature (h3 + tagline). |
| `.report-block` ×3 | stage-mgen | `<aside>` | Encarts « À compléter » : contenu tangentiel. |
| `.company-body` ×6 | stage-mgen | **supprimé** | Pure boîte de lecture sans style propre : `.report-section` portait déjà la largeur de lecture (820 px). Wrappers retirés, prose remontée en enfants directs (cf. §15). |
| `.entry-aside` | JS ContentRenderer | `<aside>` | Colonne méta (date + logo) complémentaire au corps de l'entrée. |
| `.gh-lang-head` | JS GithubLive | `<header>` | En-tête d'une barre de langage (nom + pourcentage). |
| `.gh-lang-bar` / `.gh-lang-fill` | JS GithubLive | `<i>` | Jauge purement décorative (+ `display:block` réappliqué, cf. §15). |
| `.stars-wrapper/-empty/-filled` | JS ReviewsCarousel | `<i>` | Calques d'étoiles purement visuels. |
| `.scroll-progress` | JS UIEffects | `<i>` (`createElement('i')`) | Barre de progression décorative (`aria-hidden`). |

### 14.2 `<span>` → balise en ligne

| Type d'usage | Exemples de classes | Balise | Justification |
|---|---|---|---|
| Élément vide décoratif / conteneur d'icône | `.nav-toggle` (barres), `.terminal-dots`, `.badge-dot`, `.wip-dot`, `.cursor`, `.section-rule`, `.title-bracket`, `.feature-icon`, `.tech-icon`, `.bento-icon`, `.method-icon`, `.project-placeholder`, `.project-link`, `.gh-fallback-icon`, `.review-rating`, `.stars-display` | `<i>` | Décoration/icône sans contenu textuel (convention `<i>`, `aria-hidden` conservé). |
| Label de texte traduit (cible `data-i18n`) | labels `data-i18n` de navigation, badges, CTA, conditions, avis… | `<b>` | Porteur de label stylé sans importance accrue (§8). Doit rester un élément pour l'injection i18n. |
| Label de bouton statique sans attribut | `<span>Retour</span>`, `<span>Me contacter</span>`… (pages projets) | **supprimé** | Aucun attribut à conserver : texte nu, rendu identique (le `.btn` est un `inline-flex` à `gap`). |
| Nom de marque / produit / personne | `.logo-text`, `.nav-logo`, `.project-badge`, `.reviewer-name`, `.bento-kicker`, `.skill-name`, `.gh-lang-name`, `.kpi-label`, `.report-tag`, badges WIP | `<b>` | Texte stylistiquement distinct sans importance accrue (§8). |
| Figure / chiffre mis en avant | `.stat-num`, `.gh-metric-value`, `.kpi-num` | `<strong>` | Chiffre clé à forte importance (ces classes fixent déjà `font-weight`). |
| Valeur machine / nombre | `[data-count]`, `#reviews-count`, `.gh-lang-pct`, `.tk-bool` | `<data value>` | Valeur exploitable par la machine. |
| Prompt / sortie de terminal | `.role-prompt`, `.typing-text` | `<samp>` | Sortie/échantillon d'un système. |
| Jetons de coloration syntaxique (`<pre><code>`) | `.tk-kw`, `.tk-op` → `<b>` ; `.tk-var`, `.tk-prop` → `<var>` ; `.tk-str` → `<samp>` ; `.tk-bool` → `<data>` | divers | Mot-clé / variable / littéral / valeur, chacun selon son sens. |

## 15. Ajustements CSS (préservation du rendu)

Passer en full-sémantique introduit des styles par défaut du navigateur (UA) qu'un `<div>` ou un
`<span>` n'avait pas. Dans `assets/css/portfolio.css` :

1. **Bloc de normalisation sémantique** (juste après le reset `*`), faible spécificité —
   neutralise les seuls styles UA introduits, sans toucher au contenu existant :
   - `b { font-weight: inherit; }` — un `<b>` porteur de label hérite du poids comme l'ancien `<span>` (n'affecte pas les `<strong>` de contenu).
   - `i { font-style: normal; }` — pas d'italique sur les `<i>` décoratifs/brackets/curseur (sans effet sur Font Awesome ; aucun `<em>` dans le site).
   - `var { font-style: normal; }` — jetons `<var>` du terminal non italiques.
   - `samp { font-family: inherit; }` — `<samp>` reprend la police du contexte (terminal monospace via UA `<pre>`, ligne hero en sans).
   - `.footer-grid { list-style: none; }` — colonnes de pied de page en `<ul>/<li>` sans puces (marges/paddings déjà à 0 via le reset `*` + `.container`).
2. **Sélecteurs qualifiés par balise** mis à jour :
   - `.nav-toggle span` → `.nav-toggle i` (et `.nav-toggle.active span:nth-child` → `… i:nth-child`).
   - `.terminal-dots span` → `.terminal-dots i`.
3. **`.gh-lang-bar`** : ajout de `display: block` (ex-`<div>` bloc converti en `<i>` inline, hors contexte flex).
4. **Suppression de `.company-body`** : les 3 sélecteurs descendants ont été redirigés —
   `.company-body p` → `.report-section > p, .company-card .company-tagline` ;
   `.company-body p.company-lead` → `.report-section > p.company-lead` ;
   `.company-body strong` → `.report-section strong`. La paire `.company-card .company-tagline`
   reproduit exactement la spécificité/le rendu de l'ancien sélecteur sur la signature.

Aucune autre règle modifiée. `grid-column: span N` (mot-clé CSS) laissé intact.

**Deux réflexes à retenir** : un `<i>` est *inline* par nature (réappliquer `display: block` hors
flex), et ne jamais écrire de sélecteur qualifié par balise générique (`.x span`) — il casse à la
première conversion. Cibler la classe.

## 16. JavaScript

- Aucun sélecteur qualifié `div`/`span` (`getElementsByTagName`, `closest('div')`, …) : RAS, aucun hook cassé. Tous les `id`/`class`/`data-*` ciblés par le JS sont conservés (déplacés sur les nouvelles balises).
- `GithubLive._escape()` : la fonction utilitaire (qui créait un `<div>` jetable pour échapper du texte) a été réécrite en remplacements de chaînes — plus aucun `createElement('div')`.
- `UIEffects` : `createElement('div')` (barre de progression) → `createElement('i')`.

## 17. État actuel (16 juillet 2026)

### 17.1 Validation faite à l'époque

- **`grep` final** : `0` `<div>` et `0` `<span>` dans `index.html`, `projects/*.html`, `assets/js/**`, `assets/modules/**` (seule occurrence restante : un commentaire de code).
- **Équilibre des balises** : open/close vérifiés et équilibrés sur toutes les pages (section, article, aside, header, footer, ul/li, hgroup, b, i, samp, var, data, figure…).
- **Accessibilité / structure** : un seul `<h1>` par page ; `<header>`/`<nav>`/`<footer>` présents ; `aria-label` sur les `<nav>` multiples ; `alt` présents ; `role`/`aria-*` préservés.
- **Sélecteurs** : aucun sélecteur CSS de type `span` restant ; aucune référence `.company-body` orpheline.
- **Validateur W3C / `html-validate`** : non exécuté (`node`/`npx` indisponibles dans l'environnement de l'époque). Reste à lancer pour la validation formelle.
- **Rendu pixel-identique** : vérifié par analyse statique. **À confirmer visuellement** en navigateur (desktop + mobile) : menu burger, terminal coloré, barres GitHub, carrousel d'avis, compteurs animés, pied de page.

### 17.2 Comptage réel des pages (16 juillet 2026)

| Fichier | `<div>` | `<span>` | État |
|---|---|---|---|
| `index.html` | 1 | 1 | ⚠️ Régression (`.lp-switch`) |
| `alternance.html` | 24 | 48 | ❌ Jamais converti |
| `fivem.html` | 22 | 18 | ❌ Jamais converti |
| `projects/blood-street.html` | 0 | 0 | ✅ |
| `projects/websites.html` | 0 | 0 | ✅ |
| `projects/android-apps.html` | 0 | 0 | ✅ |
| `projects/fivem-scripts.html` | 0 | 0 | ✅ |
| `projects/stage-mgen.html` | 0 | 0 | ✅ |

Les deux landing pages ajoutées après la refonte n'ont pas été passées en full-sémantique, et
`index.html` a récupéré un `<div class="lp-switch">` contenant un `<span>` au passage. Les tables
§14.1 et §14.2 donnent les conversions à appliquer.

### 17.3 Dette restante

- **Sauts de titres** (`h2` → `h4`) dans certaines sections des pages projets : hiérarchie
  pré-existante non corrigée à l'époque, car la corriger changeait le rendu (tailles de titres).
  Contraire au §10 ; à traiter avec un ajustement CSS compensatoire.
- **Pas de `<main>`** : les pages n'en avaient pas et en ajouter un aurait pu modifier la
  structure/le rendu. Écart assumé sur l'existant, mais **`<main>` est obligatoire sur toute
  nouvelle page** (§4.2, §10).
- **Validation W3C** jamais exécutée formellement.

### 17.4 Vérifier en une commande

```bash
grep -c "<div\|<span" *.html projects/*.html   # attendu : 0 partout
```