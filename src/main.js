import Vue from 'vue'
import App from './App.vue'

import VueMeta from 'vue-meta'
Vue.use(VueMeta)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
#!/bin/bash

# Assign variables from command-line arguments
MD5SUM=$1
WARFILENAME=$2

# Print the received variables
echo "MD5SUM: $MD5SUM"
echo "WARFILENAME: $WARFILENAME"

# Switch to root user (Not recommended in a script; best to execute with sudo)
sudo su - <<EOF

# Define backup folder with timestamp
BACKUP_FOLDER="/app/temp/${WARFILENAME}_$(date +%F).bak"

# Create the backup folder
mkdir -p "$BACKUP_FOLDER"
echo "Backup folder created: $BACKUP_FOLDER"

# Copy WAR file to backup folder
cp "/app/tc-8443/catalina/webapp/$WARFILENAME" "$BACKUP_FOLDER/"
echo "WAR file backed up successfully."

# Verify MD5 checksum of the original and backup file
ORIGINAL_MD5=$(md5sum "/app/tc-8443/catalina/webapp/$WARFILENAME" | awk '{print $1}')
BACKUP_MD5=$(md5sum "$BACKUP_FOLDER/$WARFILENAME" | awk '{print $1}')

echo "Original WAR MD5: $ORIGINAL_MD5"
echo "Backup WAR MD5: $BACKUP_MD5"

if [[ "$ORIGINAL_MD5" == "$BACKUP_MD5" ]]; then
    echo "✅ MD5 Checksum verification passed!"
else
    echo "❌ MD5 Checksum mismatch! Backup failed."
    exit 1
fi

# Remove the original WAR file
rm -rf "/app/tc-8443/catalina/webapp/$WARFILENAME"
echo "Removed original WAR file: $WARFILENAME"

# Stop the application
sh app-stop.sh
echo "Application stopped."

# Start the application
sh app-start.sh
echo "Application started."

EOF