# Publish via EAS (Expo App Service)

1. Update the `dev` channel in EAS
```bash
eas update --channel development --message "Hello World"
```

2. Build for all platform
```bash
npx eas-cli@latest build --platform all
```