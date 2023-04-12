#!/bin/sh
output=$(/cli/bin/run $*); status=$?;

EOF=$(dd if=/dev/urandom bs=15 count=1 status=none | base64)
echo "response<<$EOF" >> $GITHUB_OUTPUT
echo $output >> $GITHUB_OUTPUT
echo "$EOF" >> $GITHUB_OUTPUT

exit $status
