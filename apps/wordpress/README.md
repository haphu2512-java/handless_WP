# WordPress local project

This workspace now includes a simple Docker-based WordPress setup.

## Start WordPress

From the repository root:

```bash
docker compose up -d
```

Or via npm:

```bash
npm run wp:start
```

## Open the site

- WordPress site: http://localhost:8000
- phpMyAdmin: http://localhost:8080
- MySQL host port: 3307

## First-time setup

1. Open http://localhost:8000
2. Choose your language
3. Enter the site title, username, password, and email
4. Finish the installation

## Stop and reset

```bash
docker compose down
```

To remove the database and uploaded files:

```bash
docker compose down -v
```
