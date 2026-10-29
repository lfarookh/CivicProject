#!/usr/bin/env bash
# One-time + repeat deploy helper. Review each step and adjust names/regions before running.
# Prereqs: AWS CLI v2 configured, Docker, Node 18+, an existing VPC with 2+ private subnets.
set -euo pipefail

REGION=${REGION:-ap-south-1}
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REPO=civicnet-api
ECR="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$REPO"

echo "==> 1. Build and push API image"
aws ecr describe-repositories --repository-names $REPO --region $REGION >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name $REPO --region $REGION >/dev/null
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin "$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"
docker build -t $ECR:latest ../backend
docker push $ECR:latest

echo "==> 2. Build web bundle (set EXPO_PUBLIC_API_URL to your API's https URL first)"
: "${EXPO_PUBLIC_API_URL:?Set EXPO_PUBLIC_API_URL, e.g. https://api.example.com}"
(cd ../mobile && npm install && npx expo export --platform web)

echo "==> 3. Upload web bundle to S3 (bucket fronted by CloudFront)"
: "${WEB_BUCKET:?Set WEB_BUCKET to your S3 bucket name}"
aws s3 sync ../mobile/dist "s3://$WEB_BUCKET" --delete
[ -n "${CF_DISTRIBUTION_ID:-}" ] && aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*" >/dev/null
echo "Done. Roll out the new API image in App Runner / ECS to pick up $ECR:latest."
