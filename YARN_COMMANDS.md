# Yarn Commands Reference

This project now uses Yarn as the package manager. Below are the common commands:

## Basic Commands

### Install dependencies
```bash
yarn
# or
yarn install
```

### Add a dependency
```bash
# Add to dependencies
yarn add [package-name]

# Add to devDependencies
yarn add -D [package-name]
# or
yarn add --dev [package-name]

# Add specific version
yarn add [package-name]@[version]
```

### Remove a dependency
```bash
yarn remove [package-name]
```

### Update dependencies
```bash
# Update all dependencies
yarn upgrade

# Update specific package
yarn upgrade [package-name]

# Update to latest version
yarn upgrade [package-name] --latest
```

## Project Scripts

### Development
```bash
yarn dev
# or with Turbopack for faster builds
yarn dev --turbo
```

### Build
```bash
yarn build
```

### Start production server
```bash
yarn start
```

### Linting
```bash
yarn lint
```

### Testing
```bash
# Run tests
yarn test

# Run tests with UI
yarn test:ui

# Run tests once
yarn test:run
```

### Database commands
```bash
# Generate database migrations
yarn db:generate

# Run migrations
yarn db:migrate

# Seed database
yarn db:seed

# Assign tickets
yarn db:assign-tickets

# Assign tickets to Nick
yarn db:assign-nick
```

## Performance Tips

1. **Use Yarn's cache**
   ```bash
   # View cache
   yarn cache list
   
   # Clean cache if needed
   yarn cache clean
   ```

2. **Offline mode** - Install from cache without checking registry
   ```bash
   yarn install --offline
   ```

3. **Frozen lockfile** - Ensure yarn.lock is not updated (good for CI)
   ```bash
   yarn install --frozen-lockfile
   ```

## Comparison with npm

| npm command | yarn command |
|------------|--------------|
| npm install | yarn |
| npm install [package] | yarn add [package] |
| npm install --save-dev [package] | yarn add --dev [package] |
| npm uninstall [package] | yarn remove [package] |
| npm update | yarn upgrade |
| npm run [script] | yarn [script] |
| npm cache clean | yarn cache clean |

## Troubleshooting

If you encounter issues:

1. Clear Yarn cache:
   ```bash
   yarn cache clean
   ```

2. Remove node_modules and reinstall:
   ```bash
   rm -rf node_modules
   yarn install
   ```

3. Ensure you're using the yarn.lock file:
   ```bash
   yarn install --frozen-lockfile
   ```