#!/bin/sh
set -eu

# Dependencies are installed while building the image. Empty named volumes are
# initialized from those image directories by Docker on their first mount.
exec "$@"
