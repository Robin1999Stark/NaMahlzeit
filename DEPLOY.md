# Deploy & Docker ohne sudo

Kurz: Um `docker` und `docker compose` ohne `sudo` auszuführen, füge deinen Benutzer zur `docker`-Gruppe hinzu und stelle sicher, dass die Docker-Socket-Berechtigungen korrekt sind. Diese Schritte müssen einmal mit Administrator-Rechten durchgeführt werden.

1) Benutzer zur `docker`-Gruppe hinzufügen (einmalig):

```bash
sudo usermod -aG docker $USER
# Danach entweder aus- und einloggen oder sofort aktivieren mit:
newgrp docker
```

2) Socket-Berechtigungen prüfen (falls weiterhin sudo nötig):

```bash
ls -l /var/run/docker.sock
# Sollte root:docker sein und Berechtigung rw-rw---- (660). Falls nicht:
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock
```

3) Testen, dass kein `sudo` nötig ist:

```bash
docker run --rm hello-world
docker compose version
docker compose up -d
```