
#!/bin/bash

# Create grafana directories
sudo mkdir -p /var/lib/grafana/dashboards
sudo mkdir -p /etc/grafana

# Copy configuration
sudo cp grafana/grafana.ini /etc/grafana/
sudo cp grafana/dashboards/monitoring.json /var/lib/grafana/dashboards/

# Set permissions
sudo chown -R grafana:grafana /var/lib/grafana
sudo chown -R grafana:grafana /etc/grafana

# Start Grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

echo "Grafana is starting on port 3000"
echo "Access it at: https://${REPLIT_DEV_DOMAIN}:3000"
echo "Default login: admin / admin123"
