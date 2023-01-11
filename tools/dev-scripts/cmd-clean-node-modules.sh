#!/bin/bash

cleanNodeModules() {
  find . -name "node_modules" -type d -prune -print | xargs du -chs
  find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;
  # For windows it should be a different command, check the OS before running the command
  # FOR /d /r . %d in (node_modules) DO @IF EXIST "%d" echo %d"
  # FOR /d /r . %d in (node_modules) DO @IF EXIST "%d" rm -rf "%d"
}

cleanNodeModules
