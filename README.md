# CivicNet

Social network for people, organizations, government institutes and government agencies.

| Layer    | Tech                                                       |
|----------|------------------------------------------------------------|
| Client   | React Native (Expo) — one codebase for Android, iOS, web   |
| API      | Java 17, Spring Boot 3, Spring Security (JWT), JPA         |
| Database | MariaDB (Amazon RDS for MariaDB in production)             |
| Hosting  | AWS: App Runner or ECS Fargate (API), S3 + CloudFront (web)|

Screens: **Sign in → Create account → Home with the network feed** (post, like, filter by account type, infinite scroll, pull to refresh).

## Run locally

```bash
# 1. API + MariaDB
cd backend && docker compose up --build      # API on http://localhost:8080

# 2. App
cd mobile && cp .env.example .env && npm install
npm run web        # browser
npm run android    # emulator: set EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
npm run ios        # simulator
```

## API

| Method | Path                     | Auth | Purpose                                   |
|--------|--------------------------|------|-------------------------------------------|
| POST   | /api/auth/register       | no   | Create account (`accountType` required)   |
| POST   | /api/auth/login          | no   | Returns `{ token, user }`                 |
| GET    | /api/me                  | yes  | Current user                              |
| GET    | /api/feed?page&size&type | yes  | Network feed, newest first                |
| POST   | /api/posts               | yes  | Publish a post                            |
| POST   | /api/posts/{id}/like     | yes  | Toggle like                               |
| GET    | /actuator/health         | no   | Load balancer / App Runner health check   |

## Deploy to AWS

**Architecture:** Mobile/Web → CloudFront (web only) → App Runner or ALB + ECS Fargate (API container from ECR) → RDS MariaDB in private subnets. Secrets in Secrets Manager.

1. **Database.** Create an RDS for MariaDB 10.11+ instance (Multi-AZ for production) in private subnets, no public access. Create database `civicnet` and a dedicated user. Store `DB_PASSWORD` and `JWT_SECRET` (32+ random bytes) in AWS Secrets Manager.
2. **API image.** `infra/deploy-aws.sh` builds `backend/Dockerfile` and pushes it to ECR.
3. **API service.** Choose one:
   - *App Runner* (simplest): source = the ECR image, port 8080, health check `/actuator/health`, add a **VPC connector** to the RDS subnets, allow the connector's security group on the RDS port 3306.
   - *ECS Fargate + ALB*: for more control (autoscaling, WAF, private networking).
   Environment: `DB_URL=jdbc:mariadb://<rds-endpoint>:3306/civicnet`, `DB_USER`, `DB_PASSWORD` and `JWT_SECRET` from Secrets Manager, `CORS_ORIGINS=https://app.example.com`, `DDL_AUTO=validate` once the schema exists.
4. **HTTPS and domain.** Use ACM certificates and Route 53 (`api.example.com`). Mobile apps need HTTPS in production.
5. **Web app.** Set `EXPO_PUBLIC_API_URL=https://api.example.com`, run `npx expo export --platform web`, upload `mobile/dist` to a private S3 bucket served by CloudFront (Origin Access Control; custom error response 403/404 → `/index.html`).
6. **Android and iOS.** Use EAS Build (`npx eas build -p android` / `-p ios`) with `EXPO_PUBLIC_API_URL` set, then submit to Google Play and the App Store.

## Before going live

- **Verification.** New accounts start with `verified = false`. Verify government and organization accounts by setting `users.verified = 1` after checking credentials, or build an admin tool.
- **Schema.** `ddl-auto=update` is for development. Add Flyway migrations and use `validate` in production.
- **Hardening.** Add rate limiting on `/api/auth/**` (AWS WAF), email verification and password reset (Amazon SES), content moderation and reporting, and structured logging to CloudWatch.
- **Scale.** Likes are stored in `post_likes`; for large volumes, add a counter column and cursor-based pagination.
