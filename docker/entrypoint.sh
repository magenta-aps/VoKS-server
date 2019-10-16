#!/bin/bash

DEBUG_MODE=${WS_SERVER_DEBUG:-false}

if $DEBUG_MODE; then
    mv dev-environment/configs/* configs/
    mv dev-environment/certs certs/
else
    rm -rf dev-environment/
fi

node run.js