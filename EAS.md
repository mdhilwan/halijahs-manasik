# Publish via EAS (Expo App Service)

Update the `dev` channel in EAS
```bash
eas update --channel development --message "Hello World"
```

Build for all platform
```bash
npx eas-cli@latest build --platform all
```