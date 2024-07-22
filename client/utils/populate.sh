#!/bin/bash

endpoint="https://fonts.hexed.pw/api.php"
alphabet=({A..Z})
fonts=($(cat fonts.json  | jq -r '. | keys[]'))
strings=(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789!?@$%^'&*~+=-_.,"
    "I%20AM%20ERROR"
)

urls=()

for font in "${fonts[@]}"; do
    value=$(($(cat fonts.json | jq -r ".[\"$font\"]") - 1))
    for style in $(seq 0 $value); do
        for string in "${strings[@]}"; do
            url="$endpoint/dbl-3/y-$font/z-$style/x-$string"
            urls+=($url)
        done
        urls+=("$endpoint/dbl-2/y-$font/z-$style/x-${alphabet[$style]}")
        urls+=("$endpoint/dbl-5/y-$font/z-$style/x-ARCADE%20FONT%20ENGINE")
    done
done

echo -n > urls.txt

for url in "${urls[@]}"; do
    echo "url = \"$url\"" >> urls.txt
done

curl -s --parallel --parallel-immediate --parallel-max 10 --config urls.txt

rm urls.txt
