# Development and Production Deployment Workflow

## Current Setup
- Direct merges to `main` branch trigger deployments to production
- No staging/development environment
- Basic Vercel configuration with GitHub integration enabled

## Proposed Changes

### 1. Branch Structure
- `main` branch: Production environment
- `development` branch: Staging/testing environment
- Feature branches: Created from `development` for new features

### 2. GitHub Workflow
```
feature-branch -> development -> main
```

1. Create feature branches from `development`
2. Make changes and test in feature branch
3. Create PR to merge into `development`
4. Test changes in staging environment
5. When ready for production, create PR from `development` to `main`

### 3. Vercel Configuration Steps

1. Create Development Environment:
   - Go to Vercel project settings
   - Under "Git" section, add a new production branch called `development`
   - Configure environment variables separately for development/production

2. Update Deployment Settings:
   - Production deployment: Triggered by changes to `main` branch
   - Preview deployment: Triggered by changes to `development` branch
   - Set up branch protection rules

### 4. Implementation Steps

1. Create Development Branch:
   ```bash
   git checkout -b development main
   git push -u origin development
   ```

2. Configure Vercel Project:
   - Connect repository if not already connected
   - Set up branch deployments
   - Configure environment variables for both environments

3. Set Up Branch Protection:
   - Protect `main` branch
   - Require PR reviews before merging
   - Require status checks to pass
   - Optional: Protect `development` branch

4. Update Local Workflow:
   - Update team documentation
   - Train team on new git workflow
   - Set up automated testing in CI/CD pipeline

### 5. Environment Variables
- Create `.env.development` for staging
- Create `.env.production` for production
- Configure in Vercel dashboard for each environment

### 6. Deployment URLs
- Production (main): `https://sliding-puzzle.vercel.app`
- Development: `https://dev.sliding-puzzle.vercel.app`

## Maintaining the Workflow

1. Regular Process:
   - Create feature branch from `development`
   - Develop and test locally
   - Push to GitHub and create PR to `development`
   - Review and merge to `development`
   - Test in staging environment
   - Create PR from `development` to `main`
   - Review and merge to production

2. Hotfixes:
   - For urgent fixes, can create hotfix branch from `main`
   - After testing, merge to both `main` and `development`

3. Best Practices:
   - Always merge `main` into `development` after hotfixes
   - Keep `development` up to date with `main`
   - Use meaningful commit messages and PR descriptions
   - Regular testing in staging environment

## Benefits
- Safer deployment process
- Better testing capabilities
- Clear separation between staging and production
- Easier rollback if needed
- Better collaboration through PR reviews