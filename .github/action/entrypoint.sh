#!/bin/sh
output=$(/cli/bin/run $*); status=$?;
echo "::set-output name=response::$output"
exit $status