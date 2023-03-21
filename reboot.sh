#!/bin/bash

# Change to the directory where your bot code is located
cd /home/testsnake/github/discordbottest

if ! sudo git stash; then
    echo "Error: failed to stash code." >&2
fi

# Update the code using git
if ! sudo git pull https://github.com/testsnake/discordbottest; then
    echo "Error: failed to update code." >&2

fi

# Update the npm
if ! sudo npm install; then
    echo "Error: failed to update npm." >&2

fi
cd /home/testsnake/github/discordbottest
# Start the bot by running npm
if ! sudo node deploy-commands.js 2> error.log; then
    echo "Error: failed to start commands." >&2

fi

sudo reboot