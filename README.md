# CI/CD DevOps - Projet Final

Application React + FastAPI + MySQL avec pipeline CI/CD et deploiement automatise sur AWS.

## Architecture AWS

Le dossier `aws/` est separe en deux composants:

- `aws/registry`: heberge le registry Docker prive. Il sert a stocker les images `backend:latest` et `frontend:latest` construites par GitHub Actions.
- `aws/app`: heberge l'application. L'EC2 applicative installe Docker, se connecte au registry prive, pull les images, puis lance la stack applicative.

Flux de deploiement AWS:

```txt
GitHub Actions deploy-aws
  -> build backend/frontend
  -> push images vers le registry Docker prive
  -> Terraform cree/remplace l'EC2 applicative
  -> Ansible configure l'EC2 applicative
  -> docker compose up -d sur l'EC2 applicative
  -> curl valide le frontend et l'API
```

Le registry est une dependance d'infrastructure: il doit etre deploye avant le workflow `Deploy AWS` et rester disponible pendant les builds/pulls Docker.

## Structure du Projet

```txt
.
|-- .github/workflows/
|   |-- build-test-deploy.yml      # CI/release hors AWS
|   `-- deploy-aws.yml             # Build images + provisionnement/deploiement AWS
|-- aws/
|   |-- app/
|   |   |-- terraform/
|   |   |   `-- main.tf             # EC2 applicative, security group, cle SSH
|   |   `-- ansible/
|   |       |-- playbook.yml        # Docker login registry + deploiement applicatif
|   |       `-- docker-compose.yml.j2
|   `-- registry/
|       |-- terraform/
|       |   |-- main.tf             # EC2 registry, security group, cle SSH
|       |   `-- .terraform.lock.hcl
|       `-- ansible/
|           |-- playbook.yml        # Registry Docker prive + Nginx HTTPS + UI
|           |-- docker-compose.yml.j2
|           |-- nginx.conf.j2
|           `-- inventory.example.ini
|-- docker-compose.yml              # Stack locale / tests Docker
|-- Dockerfile.backend
|-- Dockerfile.frontend
|-- database/                       # Scripts SQL d'initialisation MySQL
|-- server.py                       # API FastAPI
`-- src/                            # Frontend React + Vite
```

## Deploiement AWS

### Registry Docker prive

Le registry est gere par `aws/registry`:

```bash
cd aws/registry/terraform
terraform init
terraform apply
```

Puis renseigner l'inventaire Ansible depuis `aws/registry/ansible/inventory.example.ini` et lancer:

```bash
cd ../ansible
ansible-playbook -i inventory.ini playbook.yml
```

### Application

Le workflow GitHub Actions `Deploy AWS` utilise `aws/app`:

- Terraform cree l'EC2 applicative.
- Le workflow genere `aws/app/ansible/inventory.ini`.
- Ansible copie les scripts SQL, genere le `.env` distant et lance Docker Compose.

Secrets principaux attendus:

```txt
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
REGISTRY_URL
REGISTRY_USER
REGISTRY_PASSWORD
MYSQL_PASSWORD
MYSQL_DATABASE
MYSQL_USER
MYSQL_HOST
AUTH_USERNAME
AUTH_PASSWORD
```

Pour la DB Docker interne a l'EC2 applicative, utiliser typiquement:

```txt
MYSQL_HOST=db
MYSQL_DATABASE=ynov_ci
MYSQL_USER=root
```

## Developpement Local

```bash
npm ci
npm run dev
npm test
docker compose up --build
```