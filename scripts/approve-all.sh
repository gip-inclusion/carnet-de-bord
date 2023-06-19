#!/bin/bash

for f in $(find . -type f -name "*.received.*"); do
	mv "$f" "$(echo $f | sed s/.received./.approved./)"
done
