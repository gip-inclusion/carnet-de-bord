#!/bin/bash

startInWindow() {
	tmux \
		new-window "docker compose up ; read" \; \
		rename-window "App" \; \
		split-window "make start-app ; read" \; \
		split-window "echo 'Waiting for docker' ; sleep 10 ; make hasura-console ; read" \; \
		split-window "make start-backend"\; \
		select-layout tiled \;
}

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
BOLD=$(tput bold)
NORMAL=$(tput sgr0)

if ! type "tmux" >/dev/null; then
	echo -e "${RED}${BOLD}-- ÉCHEC --${NORMAL}${NC}"
	echo -e "${RED}Le démarrage automatique nécessite la présence de tmux.${NC}"
	echo -e "${RED}https://github.com/tmux/tmux/wiki/Installing${NC}"
	exit 1
fi

if [[ -z $TMUX ]]; then
	# We are not in a tmux session so create one
	# start the session in detached mode
	tmux new-session -d -s CDB
	startInWindow
	# kill the default window (created as an artifact)
	tmux \
		last-window \; \
		kill-window \;
	tmux attach-session -d -t CDB
else
	# We are in a tmux session, create a new window
	startInWindow
	tmux select-window -l
	echo -e "${GREEN}${BOLD}-- OK --${NORMAL}${NC}"
	echo -e "J'ai créé une nouvelle fenêtre 'App', utilisez <CTRL-B> + l pour l'atteindre"
fi
