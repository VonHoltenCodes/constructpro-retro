# ConstructPro Retro - Server Handshake Document

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🤝 ZENTYAL SERVER DEPLOYMENT WITH CLAUDE CODE 🤝                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 📋 Server Requirements & Environment

### Server Details
- **OS**: Zentyal (Ubuntu-based)
- **Claude Code**: Already installed on server
- **NVM**: Required for Node.js version management
- **Server IP**: 192.168.68.67 (Starbase1)
- **Web Root**: `/var/www/`
- **Process Manager**: PM2 (via NVM)

### Required Software Versions
- **Node.js**: v20.19.3+ (via NVM)
- **npm**: 10.8.2+
- **PM2**: Latest version
- **Apache**: For reverse proxy

## 🚀 Deployment Steps

### 1. Connect to Server
```bash
ssh traxx@192.168.68.67
# or use your configured SSH alias
```

### 2. Setup NVM Environment
```bash
# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use correct Node version
nvm use 20.19.3
# or install if not available
nvm install 20.19.3
nvm use 20.19.3
```

### 3. Create App Directory
```bash
# Create directory for ConstructPro Retro
sudo mkdir -p /var/www/constructpro-retro
sudo chown $USER:$USER /var/www/constructpro-retro
cd /var/www/constructpro-retro
```

### 4. Clone Repository
```bash
# Clone from your GitHub repo (when ready)
git clone https://github.com/VonHoltenCodes/constructpro-retro.git .

# Or transfer files directly
# From local machine:
rsync -avz --exclude='node_modules' --exclude='builds' \
  ~/repos/projects/constructpro-retro/ \
  traxx@192.168.68.67:/var/www/constructpro-retro/
```

### 5. Install Dependencies with NVM
```bash
# Ensure NVM is loaded
nvm use 20.19.3

# Install dependencies
npm install

# Install PM2 globally if not already
npm install -g pm2
```

### 6. Build for Production
```bash
# Build the Expo web version for server hosting
npm run build:web

# This creates a web-build directory
```

### 7. Create PM2 Start Script
```bash
cat > /var/www/constructpro-retro/start-constructpro.sh << 'EOF'
#!/bin/bash
cd /var/www/constructpro-retro

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20.19.3

# Export environment
export NODE_ENV=production
export PORT=3010

# Stop existing if running
pm2 stop constructpro-retro 2>/dev/null
pm2 delete constructpro-retro 2>/dev/null

# Start with PM2
pm2 start npm --name constructpro-retro -- start

# Save PM2 config
pm2 save
pm2 startup

echo "ConstructPro Retro started on port $PORT"
EOF

chmod +x start-constructpro.sh
```

### 8. Configure Apache Reverse Proxy
```bash
# Create Apache config
sudo tee /etc/apache2/sites-available/constructpro-retro.conf << 'EOF'
<VirtualHost *:80>
    ServerName constructpro.local
    ServerAlias constructpro

    # Proxy to Expo web server
    ProxyPreserveHost On
    ProxyPass / http://localhost:3010/
    ProxyPassReverse / http://localhost:3010/

    # WebSocket support for hot reload (dev only)
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3010/$1" [P,L]

    ErrorLog ${APACHE_LOG_DIR}/constructpro-error.log
    CustomLog ${APACHE_LOG_DIR}/constructpro-access.log combined
</VirtualHost>
EOF

# Enable site and required modules
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite
sudo a2ensite constructpro-retro
sudo systemctl reload apache2
```

### 9. Start the Application
```bash
# Run the start script
./start-constructpro.sh

# Check PM2 status
pm2 status
pm2 logs constructpro-retro
```

## 🌐 Build Server for Mobile Apps

Since React Native apps need to be built into APK/IPA files, we'll set up a build process:

### 1. Install EAS CLI
```bash
# With NVM loaded
npm install -g eas-cli
```

### 2. Configure EAS Build
```bash
cd /var/www/constructpro-retro

# Login to Expo account (create free account if needed)
eas login

# Configure project
eas build:configure
```

### 3. Build APK/IPA on Server
```bash
# Build Android APK
eas build --platform android --profile preview --local

# Build iOS (requires Mac)
# eas build --platform ios --profile preview --local
```

## 📱 Distribution Server Setup

### 1. Create Distribution Directory
```bash
sudo mkdir -p /var/www/constructpro-builds
sudo chown $USER:$USER /var/www/constructpro-builds
```

### 2. Apache Config for Downloads
```bash
sudo tee /etc/apache2/sites-available/constructpro-builds.conf << 'EOF'
<VirtualHost *:80>
    ServerName builds.constructpro.local
    DocumentRoot /var/www/constructpro-builds

    <Directory /var/www/constructpro-builds>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
        
        # Enable directory listing
        Options +Indexes
        IndexOptions FancyIndexing HTMLTable
    </Directory>

    # Security headers
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
</VirtualHost>
EOF

sudo a2ensite constructpro-builds
sudo systemctl reload apache2
```

### 3. Copy Builds to Distribution
```bash
# After building APK
cp builds/*.apk /var/www/constructpro-builds/
cp builds/*.ipa /var/www/constructpro-builds/

# Create README for users
cat > /var/www/constructpro-builds/README.txt << 'EOF'
ConstructPro Retro - Installation Files

Android: Download the .apk file
iOS: Download the .ipa file

See installation guides for detailed instructions.
EOF
```

## 🔧 Claude Code Integration

When Claude Code is running on the server, it can help with:

### 1. Automated Builds
```bash
# Use Claude Code to build new versions
claude "Build new APK for ConstructPro Retro with latest changes"
```

### 2. Deployment Updates
```bash
# Update and restart app
claude "Pull latest ConstructPro changes and restart PM2 service"
```

### 3. Log Monitoring
```bash
# Check app health
claude "Show PM2 logs for constructpro-retro and check for errors"
```

## 🚨 Troubleshooting

### NVM Not Found
```bash
# Add to ~/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/constructpro-retro
```

### PM2 Not Starting
```bash
# Check with explicit NVM
/home/traxx/.nvm/versions/node/v20.19.3/bin/pm2 status
```

### Port Conflicts
```bash
# Check what's using port
sudo lsof -i :3010

# Kill if needed
sudo kill -9 $(sudo lsof -t -i:3010)
```

## 📊 Monitoring

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# Web dashboard (optional)
pm2 install pm2-web
```

### Logs Location
- PM2 logs: `~/.pm2/logs/`
- Apache logs: `/var/log/apache2/constructpro-*.log`
- App logs: Check PM2 logs

## 🔄 Update Procedure

```bash
# 1. Connect to server
ssh traxx@192.168.68.67

# 2. Navigate to app
cd /var/www/constructpro-retro

# 3. Load NVM
nvm use 20.19.3

# 4. Pull updates
git pull origin main

# 5. Install new dependencies
npm install

# 6. Build if needed
npm run build:web

# 7. Restart PM2
pm2 restart constructpro-retro
```

## 📝 Notes for Zentyal Compatibility

- Zentyal uses Apache, not Nginx
- Firewall rules may need adjustment for ports
- Use Apache's mod_proxy instead of Nginx config
- NVM is crucial for Node version management
- PM2 should be installed per-user, not system-wide

---

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ✅ Server is ready for ConstructPro Retro deployment!                   ║
║  📱 Build server can generate APK/IPA files                              ║
║  🌐 Distribution server can host installation files                      ║
║  🤖 Claude Code can manage the deployment process                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
```