#!/usr/bin/env bash

SCRIPTPATH="$(
    cd "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"

TMT_BACKEND_VERSION="5c8168a"

COURSIER="$(command -v cs)" || COURSIER="$SCRIPTPATH/coursier"

APPS_PATH="https://raw.githubusercontent.com/tmtsoftware/apps/master/apps.json"

APP_NAME="$1"

# Pass rest of the arguments after first argument to the corresponding app
"$COURSIER" launch --channel $APPS_PATH "$APP_NAME":$TMT_BACKEND_VERSION -- "${@:2}"