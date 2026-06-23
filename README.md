# CI/CD DevOps - Projet Final

Application React + FastAPI + MySQL avec pipeline CI/CD et deploiement automatise sur AWS.

## Architecture Finale

```
                         ┌──────────────────────┐
                         │   GitHub Actions      │
                         │   (deploy.yml)        │
                         │   workflow_dispatch   │
                         └──────┬───────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
     Build & Push        Terraform         Validation
     (Registry Prive)    (Infra EC2)       (curl)
                         │
                         ▼
                    Ansible (Config + Deploy)

┌─────────────────────────┐    ┌─────────────────────────┐
│  EC2 Registry           │    │  EC2 Applicative        │
│  (t3.micro, eu-west-3)  │    │  (t3.micro, eu-west-3)  │
│                         │    │                         │
│  nginx (HTTPS :443)     │    │  nginx (HTTP :80)       │
│  ├── /v2/ → registry    │    │  ├── React Frontend     │
│  └── /    → ui          │    │  └── Build-time auth    │
│  registry:2             │    │  FastAPI (:8000)        │
│  registry-ui            │    │  MySQL (interne)        │
│  SSL auto-signe         │    │  Adminer (:8080)        │
└─────────────────────────┘    └─────────────────────────┘
```

## Structure du Projet

```
.
├── .github/workflows/
│   ├── build_test_deploy_react.yml   # CI existante (GitHub Pages, Vercel, Docker Hub)
│   └── deploy.yml                    # Deploiement AWS (workflow_dispatch)
├── registry/                         # Terraform + Ansible pour le Registry Docker prive
│   ├── main.tf                       # Provisionne EC2, SG (22, 80, 443), cle SSH
│   ├── playbook.yml                  # Installe Docker, SSL, Nginx, Registry
│   ├── nginx.conf.j2                 # Template Nginx (HTTPS, routage /v2/ et /)
│   ├── docker-compose.yml.j2         # Template Docker Compose (registry + ui + nginx)
│   └── inventory.ini                 # Inventaire Ansible (genere dynamiquement par CI)
├── infra/                            # Terraform pour l'EC2 Applicative
│   └── main.tf                       # Provisionne EC2, SG (22, 80, 8000), cle SSH
├── ansible/                          # Ansible pour le deploiement applicatif
│   ├── playbook.yml                  # Installe Docker, login registry, deploy stack
│   └── docker-compose.yml.j2         # Template Docker Compose prod (images du registry)
├── Dockerfile.backend                # Image Python FastAPI
├── Dockerfile.frontend               # Image React (build) + Nginx (runtime)
├── docker-compose.yml                # Stack de developpement local
├── server.py                         # Backend FastAPI (CRUD users)
├── src/                              # Frontend React + Vite
├── database/                         # Scripts SQL d'initialisation
├── rendu.txt                         # Lien repo + IPs publiques
├── .env.sample                       # Variables d'environnement et secrets a configurer
└── README.md
```

## Deploiement

### Pre-requis

1. Configurer les secrets GitHub (voir `.env.sample`)
2. Avoir un Registry Docker prive deja deploye sur AWS (via `registry/`)

### Lancer le deploiement

1. Aller dans l'onglet **Actions** du repository GitHub
2. Selectionner le workflow **Deploy**
3. Cliquer sur **Run workflow**

### Etapes du pipeline

| Etape | Description |
|---|---|
| **Build & Publish** | Construction des images Docker (frontend + backend) et push vers le registry prive |
| **Terraform** | Provisionnement d'une EC2 t3.micro Ubuntu 24.04 avec Security Group (22, 80, 8000) |
| **Bridge** | Generation de l'inventaire Ansible a partir des outputs Terraform (IP, cle SSH) |
| **Ansible** | Installation Docker, authentification registry, deploiement de la stack applicative |
| **Validation** | Tests HTTP (curl) sur le frontend et l'API backend |

## Developpement Local

```bash
# Installer les dependances
npm ci

# Lancer le frontend en dev
npm run dev

# Lancer la stack complete (Docker)
docker compose up --build

# Tests
npm test
npm run cypress
```
