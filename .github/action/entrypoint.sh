#!/bin/sh
output=$(/cli/bin/run $*); status=$?;

delimiter="$(uuidgen)"
echo "response<<${delimiter}" >> "${GITHUB_OUTPUT}"
echo "${output}" >> "${GITHUB_OUTPUT}"
echo "${delimiter}" >> "${GITHUB_OUTPUT}"

exit $status
