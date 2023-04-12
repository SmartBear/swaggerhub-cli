#!/bin/sh
output=$(/cli/bin/run $*); status=$?;

delimiter="$(openssl rand -hex 8)"
echo "response<<${delimiter}" >> "${GITHUB_OUTPUT}"
echo "${output}" >> "${GITHUB_OUTPUT}"
echo "${delimiter}" >> "${GITHUB_OUTPUT}"

exit $status
