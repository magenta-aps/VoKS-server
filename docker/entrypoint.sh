#!/bin/bash

# Copy default configuration if configuration not already mounted
cp -n configs/default/* configs/

exec "$@"
