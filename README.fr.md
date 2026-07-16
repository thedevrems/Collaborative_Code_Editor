# Éditeur de code collaboratif

🇬🇧 [English version](README.md)

Un éditeur de code collaboratif et léger, en temps réel, inspiré de CodeSandbox.
Créez une room, partagez le lien et éditez du code à plusieurs avec des curseurs
en direct, un chat intégré et l'exécution de code en bac à sable dans neuf
langages.

## Fonctionnalités

**Principales**

- Rooms partageables créées depuis un simple lien
- Édition collaborative en temps réel avec fusion sans conflit (CRDT via Yjs)
- Curseurs multi-utilisateurs nommés et colorés, avec liste de présence
- Exécution en bac à sable de neuf langages dans des conteneurs Docker éphémères
- Chat texte par room

**Avancées**

- Annulation / rétablissement collaboratifs
- Relecture de session rejouant l'historique d'édition d'une room
- Quotas CPU et mémoire configurables par exécution
- Détection heuristique de code suspect avant exécution

## Stack technique

| Couche              | Technologie                          |
| ------------------- | ------------------------------------ |
| Front-end           | React, Monaco Editor, Vite           |
| Temps réel          | Socket.io                            |
| CRDT                | Yjs avec un provider Socket.io custom |
| État volatile       | Redis                                |
| Persistance         | PostgreSQL                           |
| Exécution de code   | Docker (conteneurs éphémères)        |
| Runtime back-end    | Node.js, Express                     |

## Architecture

Flux de collaboration :

```mermaid
flowchart LR
  A[Client A : Monaco + Yjs] -- mise a jour --> S[Serveur Socket.io]
  B[Client B : Monaco + Yjs] -- mise a jour --> S
  S -- relais --> A
  S -- relais --> B
  S --> D[(Y.Doc par room)]
  D --> R[(Redis : presence)]
  D --> P[(PostgreSQL : snapshots)]
```

Flux d'exécution :

```mermaid
flowchart LR
  U[Clic sur Run] --> SV[Service d execution]
  SV --> M{Code suspect ?}
  M -- oui --> X[Resultat bloque]
  M -- non --> C[Conteneur Docker ephemere : sans reseau, quotas, timeout]
  C --> O[stdout / stderr]
  O --> RM[Diffusion a la room]
```

## Structure du projet

```
client/   Front-end React (Monaco, provider Yjs, hooks, composants)
server/   Back-end Node.js (rooms, temps réel, CRDT, exécution, persistance)
docker/   Docker Compose pour Redis et PostgreSQL en local
docs/     Documentation complémentaire
```

## Prérequis

- Node.js 20 ou plus récent
- Docker (nécessaire pour les services locaux et l'exécution de code)

## Démarrage

1. Démarrez les services locaux (Redis et PostgreSQL) :

   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```

2. Configurez les variables d'environnement :

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. Installez les dépendances depuis la racine du dépôt :

   ```bash
   npm install
   ```

4. Lancez le serveur et le client en mode développement :

   ```bash
   npm run dev
   ```

Le client tourne sur `http://localhost:5173` et le serveur sur
`http://localhost:4000`.

## Langages pris en charge

Chaque langage exécute le code partagé de la room dans son propre conteneur
éphémère. Les langages interprétés exécutent le fichier directement ; les
langages compilés compilent vers un chemin temporaire inscriptible puis lancent
l'artefact.

| Langage           | Image Docker                    | Remarques                                          |
| ----------------- | ------------------------------- | -------------------------------------------------- |
| JavaScript (Node) | `node:20-alpine`                | —                                                  |
| TypeScript        | `oven/bun:alpine`               | Exécuté nativement par Bun (APIs compatibles Node) |
| Python            | `python:3.12-alpine`            | —                                                  |
| Lua               | `nickblah/lua:5.4-alpine`       | Image communautaire                                |
| Go                | `golang:1.23-alpine`            | `go run` (fichier `package main` unique)           |
| C++               | `gcc:14`                        | Compilé avec `g++ -std=gnu++20`                    |
| Java              | `eclipse-temurin:21-jdk-alpine` | La classe d'entrée **doit s'appeler `Main`**       |
| Kotlin            | `zenika/kotlin:1.9-jdk17`       | Image communautaire ; compilation à froid lente    |
| C#                | `mcr.microsoft.com/dotnet/sdk:8.0` | Instructions top-level OK ; build à froid lent   |

Les langages compilés (Go, C++, Java, Kotlin, C#) reçoivent automatiquement des
quotas CPU, mémoire et timeout plus larges que les valeurs globales par défaut,
afin que leurs chaînes d'outils puissent compiler dans le bac à sable.

La première exécution d'un langage télécharge son image. Les grosses images
(`gcc`, le JDK, Kotlin, le SDK .NET) peuvent dépasser le timeout d'exécution lors
du tout premier téléchargement ; pré-téléchargez-les une fois pour éviter un
premier lancement en échec :

```bash
docker pull gcc:14
docker pull eclipse-temurin:21-jdk-alpine
docker pull mcr.microsoft.com/dotnet/sdk:8.0
docker pull zenika/kotlin:1.9-jdk17
```

> Kotlin et C# sont lourds : leurs images sont volumineuses et chaque exécution
> est un conteneur neuf sans cache de build chaud, donc les compilations à froid
> sont lentes. Lua et Kotlin utilisent des images communautaires (il n'en existe
> pas d'officielles).

## Variables d'environnement

Serveur (`server/.env`) :

| Variable          | Description                           | Défaut                                        |
| ----------------- | ------------------------------------- | --------------------------------------------- |
| `PORT`            | Port HTTP et WebSocket                | `4000`                                        |
| `CLIENT_ORIGIN`   | Origine front-end autorisée           | `http://localhost:5173`                       |
| `REDIS_URL`       | URL de connexion Redis                | `redis://localhost:6379`                      |
| `DATABASE_URL`    | URL de connexion PostgreSQL           | `postgres://editor:editor@localhost:5432/editor` |
| `EXEC_CPUS`       | Quota CPU par exécution               | `0.5`                                         |
| `EXEC_MEMORY`     | Quota mémoire par exécution           | `128m`                                        |
| `EXEC_PIDS`       | Limite de processus par exécution     | `64`                                          |
| `EXEC_TIMEOUT_MS` | Délai maximal d'exécution             | `5000`                                        |

Client (`client/.env`) :

| Variable          | Description            | Défaut                  |
| ----------------- | ---------------------- | ----------------------- |
| `VITE_SERVER_URL` | URL de base du back-end | `http://localhost:4000` |

## Sécurité de l'exécution

Chaque exécution se déroule dans un conteneur Docker neuf, sans accès réseau,
avec des capacités Linux supprimées, un espace de travail monté en lecture seule,
une limite de processus, des quotas CPU et mémoire et un délai strict. Une
vérification heuristique rejette le code manifestement suspect avant même de
démarrer un conteneur.

## Licence

MIT
