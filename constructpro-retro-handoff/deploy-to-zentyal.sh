#!/bin/bash

# ConstructPro Retro - Zentyal Server Deployment Script
# This script handles deployment with NVM on Zentyal server

set -e  # Exit on error

# Configuration
SERVER_USER="traxx"
SERVER_HOST="192.168.68.67"
SERVER_PATH="/var/www/constructpro-retro"
NODE_VERSION="20.19.3"
PM2_APP_NAME="constructpro-retro"
PORT="3010"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ConstructPro Retro - Zentyal Deployment Script                  ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"

# Function to run commands on server
run_on_server() {
    ssh ${SERVER_USER}@${SERVER_HOST} "$1"
}

# Function to run commands with NVM on server
run_with_nvm() {
    ssh ${SERVER_USER}@${SERVER_HOST} "source ~/.nvm/nvm.sh && nvm use ${NODE_VERSION} && $1"
}

# Step 1: Check connection
echo -e "\n${YELLOW}[1/10] Checking server connection...${NC}"
if ! ssh -q ${SERVER_USER}@${SERVER_HOST} exit; then
    echo -e "${RED}Cannot connect to server. Please check SSH configuration.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Server connection successful${NC}"

# Step 2: Check NVM installation
echo -e "\n${YELLOW}[2/10] Checking NVM installation...${NC}"
if ! run_on_server "[ -s ~/.nvm/nvm.sh ]"; then
    echo -e "${RED}NVM not found. Installing NVM...${NC}"
    run_on_server "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
fi
echo -e "${GREEN}✓ NVM is installed${NC}"

# Step 3: Install/check Node version
echo -e "\n${YELLOW}[3/10] Checking Node.js ${NODE_VERSION}...${NC}"
if ! run_on_server "source ~/.nvm/nvm.sh && nvm ls ${NODE_VERSION} > /dev/null 2>&1"; then
    echo -e "${YELLOW}Installing Node.js ${NODE_VERSION}...${NC}"
    run_on_server "source ~/.nvm/nvm.sh && nvm install ${NODE_VERSION}"
fi
run_on_server "source ~/.nvm/nvm.sh && nvm use ${NODE_VERSION}"
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} is active${NC}"

# Step 4: Create app directory
echo -e "\n${YELLOW}[4/10] Setting up app directory...${NC}"
run_on_server "sudo mkdir -p ${SERVER_PATH}"
run_on_server "sudo chown ${SERVER_USER}:${SERVER_USER} ${SERVER_PATH}"
echo -e "${GREEN}✓ Directory created${NC}"

# Step 5: Sync files (excluding node_modules and builds)
echo -e "\n${YELLOW}[5/10] Syncing project files...${NC}"
rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='builds' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.expo' \
    --exclude='dist' \
    --exclude='android' \
    --exclude='ios' \
    ./ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

echo -e "${GREEN}✓ Files synced${NC}"

# Step 6: Install dependencies
echo -e "\n${YELLOW}[6/10] Installing dependencies...${NC}"
run_with_nvm "cd ${SERVER_PATH} && npm install --production"
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 7: Install PM2 if needed
echo -e "\n${YELLOW}[7/10] Checking PM2...${NC}"
if ! run_with_nvm "pm2 --version > /dev/null 2>&1"; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    run_with_nvm "npm install -g pm2"
fi
echo -e "${GREEN}✓ PM2 is available${NC}"

# Step 8: Create PM2 ecosystem file
echo -e "\n${YELLOW}[8/10] Creating PM2 configuration...${NC}"
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${PM2_APP_NAME}',
    script: 'node_modules/expo/bin/cli.js',
    args: 'start --web --port ${PORT}',
    cwd: '${SERVER_PATH}',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    time: true,
    max_memory_restart: '1G',
    instances: 1,
    exec_mode: 'fork'
  }]
};
EOF

# Copy ecosystem file to server
scp ecosystem.config.js ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/
rm ecosystem.config.js
echo -e "${GREEN}✓ PM2 configuration created${NC}"

# Step 9: Start/Restart application
echo -e "\n${YELLOW}[9/10] Starting application with PM2...${NC}"
run_with_nvm "cd ${SERVER_PATH} && pm2 stop ${PM2_APP_NAME} || true"
run_with_nvm "cd ${SERVER_PATH} && pm2 delete ${PM2_APP_NAME} || true"
run_with_nvm "cd ${SERVER_PATH} && pm2 start ecosystem.config.js"
run_with_nvm "pm2 save"
echo -e "${GREEN}✓ Application started${NC}"

# Step 10: Configure Apache (if not already done)
echo -e "\n${YELLOW}[10/10] Checking Apache configuration...${NC}"
APACHE_CONFIG="/etc/apache2/sites-available/constructpro-retro.conf"
if ! run_on_server "[ -f ${APACHE_CONFIG} ]"; then
    echo -e "${YELLOW}Creating Apache configuration...${NC}"
    
    # Create Apache config
    TEMP_CONFIG=$(mktemp)
    cat > ${TEMP_CONFIG} << 'EOF'
<VirtualHost *:80>
    ServerName constructpro.local
    ServerAlias constructpro

    # Proxy to Expo web server
    ProxyPreserveHost On
    ProxyPass / http://localhost:3010/
    ProxyPassReverse / http://localhost:3010/

    # WebSocket support
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3010/$1" [P,L]

    # Headers
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"

    ErrorLog ${APACHE_LOG_DIR}/constructpro-error.log
    CustomLog ${APACHE_LOG_DIR}/constructpro-access.log combined
</VirtualHost>
EOF
    
    # Copy to server and enable
    scp ${TEMP_CONFIG} ${SERVER_USER}@${SERVER_HOST}:/tmp/constructpro-retro.conf
    rm ${TEMP_CONFIG}
    
    run_on_server "sudo mv /tmp/constructpro-retro.conf ${APACHE_CONFIG}"
    run_on_server "sudo a2enmod proxy proxy_http proxy_wstunnel rewrite headers"
    run_on_server "sudo a2ensite constructpro-retro"
    run_on_server "sudo systemctl reload apache2"
    
    echo -e "${GREEN}✓ Apache configured${NC}"
else
    echo -e "${GREEN}✓ Apache already configured${NC}"
fi

# Final status check
echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"

# Show PM2 status
echo -e "\n${YELLOW}Application Status:${NC}"
run_with_nvm "pm2 status ${PM2_APP_NAME}"

echo -e "\n${YELLOW}Access Points:${NC}"
echo -e "  Local: ${GREEN}http://${SERVER_HOST}:${PORT}${NC}"
echo -e "  Via Apache: ${GREEN}http://constructpro.local${NC}"
echo -e "  Server IP: ${GREEN}http://${SERVER_HOST}${NC}"

echo -e "\n${YELLOW}Useful Commands:${NC}"
echo -e "  View logs: ${GREEN}ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && pm2 logs'${NC}"
echo -e "  Restart: ${GREEN}ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && pm2 restart ${PM2_APP_NAME}'${NC}"
echo -e "  Monitor: ${GREEN}ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 monit'${NC}"

echo -e "\n${GREEN}✅ ConstructPro Retro is now running on your Zentyal server!${NC}"