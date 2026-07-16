# Collaborative Code Editor

🇫🇷 [Version française](README.fr.md)

A lightweight, real-time collaborative code editor inspired by CodeSandbox.
Create a room, share the link, and edit code together with live cursors,
in-room chat, and sandboxed code execution across nine languages.

## Features

**Core**

- Shareable rooms created from a single link
- Real-time collaborative editing with conflict-free merging (CRDT via Yjs)
- Named and colored multi-user cursors and presence list
- Sandboxed execution of nine languages in ephemeral Docker containers
- Per-room text chat

**Advanced**

- Collaborative undo / redo
- Session playback that replays the edit history of a room
- Configurable CPU and memory quotas per execution
- Heuristic detection of suspicious code before execution

## Tech stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Front-end        | React, Monaco Editor, Vite          |
| Real-time        | Socket.io                           |
| CRDT             | Yjs with a custom Socket.io provider |
| Volatile state   | Redis                               |
| Persistence      | PostgreSQL                          |
| Code execution   | Docker (ephemeral containers)       |
| Back-end runtime | Node.js, Express                    |

## Architecture

Collaboration flow:

```mermaid
flowchart LR
  A[Client A: Monaco + Yjs] -- update --> S[Socket.io server]
  B[Client B: Monaco + Yjs] -- update --> S
  S -- relay --> A
  S -- relay --> B
  S --> D[(Y.Doc per room)]
  D --> R[(Redis: presence)]
  D --> P[(PostgreSQL: snapshots)]
```

Execution flow:

```mermaid
flowchart LR
  U[User clicks Run] --> SV[Execution service]
  SV --> M{Suspicious code?}
  M -- yes --> X[Blocked result]
  M -- no --> C[Ephemeral Docker container: no network, quotas, timeout]
  C --> O[stdout / stderr]
  O --> RM[Broadcast to room]
```

## Project structure

```
client/   React front-end (Monaco, Yjs provider, hooks, components)
server/   Node.js back-end (rooms, realtime, CRDT, execution, persistence)
docker/   Docker Compose for local Redis and PostgreSQL
docs/     Additional documentation
```

## Prerequisites

- Node.js 20 or newer
- Docker (required for both the local services and code execution)

## Getting started

1. Start the local services (Redis and PostgreSQL):

   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```

2. Configure environment variables:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. Install dependencies from the repository root:

   ```bash
   npm install
   ```

4. Start the server and client in development mode:

   ```bash
   npm run dev
   ```

The client runs on `http://localhost:5173` and the server on
`http://localhost:4000`.

## Supported languages

Each language runs the shared room code in its own ephemeral container.
Interpreted languages run the file directly; compiled languages compile into a
writable temporary path and then run the artifact.

| Language          | Docker image                    | Notes                                             |
| ----------------- | ------------------------------- | ------------------------------------------------- |
| JavaScript (Node) | `node:20-alpine`                | —                                                 |
| TypeScript        | `oven/bun:alpine`               | Run natively by Bun (Node-compatible APIs)        |
| Python            | `python:3.12-alpine`            | —                                                 |
| Lua               | `nickblah/lua:5.4-alpine`       | Community image                                   |
| Go                | `golang:1.23-alpine`            | `go run` (single `package main` file)             |
| C++               | `gcc:14`                        | Compiled with `g++ -std=gnu++20`                  |
| Java              | `eclipse-temurin:21-jdk-alpine` | Entry class **must be named `Main`**              |
| Kotlin            | `zenika/kotlin:1.9-jdk17`       | Community image; slow cold compile                |
| C#                | `mcr.microsoft.com/dotnet/sdk:8.0` | Top-level statements OK; slow cold build       |

Compiled languages (Go, C++, Java, Kotlin, C#) automatically get wider CPU,
memory, and timeout budgets than the global defaults so their toolchains can
compile within the sandbox.

The first run of a language pulls its image. Large images (`gcc`, the JDK,
Kotlin, the .NET SDK) can exceed the execution timeout on the very first pull,
so pre-pull them once to avoid a failed first run:

```bash
docker pull gcc:14
docker pull eclipse-temurin:21-jdk-alpine
docker pull mcr.microsoft.com/dotnet/sdk:8.0
docker pull zenika/kotlin:1.9-jdk17
```

> Kotlin and C# are heavy: their images are large and every run is a fresh
> container with no warm build cache, so cold compiles are slow. Lua and Kotlin
> use community images (no official ones exist).

## Environment variables

Server (`server/.env`):

| Variable          | Description                          | Default                                       |
| ----------------- | ------------------------------------ | --------------------------------------------- |
| `PORT`            | HTTP and WebSocket port              | `4000`                                        |
| `CLIENT_ORIGIN`   | Allowed front-end origin             | `http://localhost:5173`                       |
| `REDIS_URL`       | Redis connection URL                 | `redis://localhost:6379`                      |
| `DATABASE_URL`    | PostgreSQL connection URL            | `postgres://editor:editor@localhost:5432/editor` |
| `EXEC_CPUS`       | CPU quota per execution              | `0.5`                                         |
| `EXEC_MEMORY`     | Memory quota per execution           | `128m`                                        |
| `EXEC_PIDS`       | Process limit per execution          | `64`                                          |
| `EXEC_TIMEOUT_MS` | Hard execution timeout               | `5000`                                        |

Client (`client/.env`):

| Variable          | Description            | Default                 |
| ----------------- | ---------------------- | ----------------------- |
| `VITE_SERVER_URL` | Back-end base URL      | `http://localhost:4000` |

## Execution safety

Each run happens in a fresh Docker container with no network access, dropped
Linux capabilities, a read-only mounted workspace, a process limit, CPU and
memory quotas, and a hard timeout. A heuristic check rejects obviously
suspicious code before a container is even started.

## License

MIT
