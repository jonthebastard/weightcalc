#!/bin/bash

dec () {
  echo "scale=2; ${1}" | bc
}

goal="${1}"
goal=$(dec "(${goal}-45)/2")
weight_json=$(cat weights.json)
side="0"

weight_collection=()
for item in $(echo $weight_json | jq -c '.set[]' | tail -r) ; do
  i=''
  total=$(echo $item | jq -r '.count')
  while ((i < $total)) ; do
    weight_collection+=($(echo $item | jq -r '.weight'))
    ((i++))
  done
done

echo
echo "input = $(dec ${1})"
echo "per side = $(dec ${goal}):"

while [[ $(awk 'BEGIN {print ('$(dec ${goal})' >= '$(dec ${side})')}') == "1" ]] ; do
  plate="$(dec ${weight_collection})"
  if [[ $(awk 'BEGIN {print ('$(dec ${goal})' >= '$(dec "${side} + ${plate}")')}') == "1" ]] ; then
    side=$(dec "${side} + ${plate}")
    echo "+ ${plate}"
  fi
  weight_collection=("${weight_collection[@]:1}")
  [[ -z ${weight_collection} ]] && break
done

echo
echo "total ($1) : bar (45) + 2 sides @ $(dec ${side}) each"

exit 0
