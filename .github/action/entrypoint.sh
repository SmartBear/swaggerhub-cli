#!/bin/sh
output=$(/cli/bin/run $*); status=$?;
echo "response=$output" >> $GITHUB_OUTPUT
exit $status
