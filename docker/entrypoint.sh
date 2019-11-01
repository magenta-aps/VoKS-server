#!/bin/bash

# Copy default configuration if configuration not already mounted
[ -d configs/default ] && cp -n configs/default/* configs/

if [ ! -z "$WAIT_FOR_SHELTER" ]; then
    echo "Sleeping for ${WAIT_FOR_SHELTER} seconds"
    sleep "${WAIT_FOR_SHELTER}"s
fi

exec "$@"
