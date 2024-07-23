#!/bin/bash


output=$(mktemp)
endpoint="http://localhost:8080/api"
alphabet=({A..Z})
pairs=(1943:10 acro:1 aerof:8 aftb:9 aof2:5 arab:4 arcade:8 arka:5 armo:5 ass:8 astx:9 atascii:4 aura:20 avng:10 bakr:7 baku:4 bats:10 bayr:3 bcir:18 bdash:8 bios:6 blaz:8 blkt:8 blwa:8 bonz:7 boog:5 bubma:4 bubs:9 caml:9 chiki:5 cliff:5 cmnds:10 cotn:16 cshk:4 cyba:6 ddcrew:4 dddon:7 ddp:12 ddr:10 ddux:9 deta:8 dima:9 drbr:3 dsab:8 dspir:10 f1dr:6 flak:7 flys:16 fstarf:7 fz:5 gaia:11 gain:7 garou:4 gng1:11 gng2:10 gond:6 gradius2:3 gradius3:7 gradius4:3 gradius:8 guar:9 gunb:11 gunn:11 guns:4 gyrs:7 hach:5 hatt:13 imgf:6 kais:8 ketsui:10 kiki:4 kira:5 klaxa:3 klax:3 kof2k1:7 kof2k2:4 kof2k3:7 kof2k:9 kof97i:12 kof97:12 ladu:5 lastb:7 last:6 lghost:4 libr:4 lwing:5 mars:12 mgs:4 mjack:6 moma:8 mt:13 muni:8 mwar:2 namco2:6 nds:11 nebu:8 niga:5 ninjak:5 ninjas:4 ninj:10 nstrike:7 ord:5 outf:7 pabom:9 paro:4 pckf:6 psr2:8 pubu:7 puls:7 qtet:4 quake:2 raph:4 rayf:9 rcop2:3 rcop:5 rezon:1 rf:10 ridef:8 roadr:3 robot:4 rtl:8 rtype:8 rumba:2 sabo:1 sala2:7 samsho2:9 samsho3:10 sar:1 sboom:5 sdi:7 sexy:8 sf2:9 sf3:2 sf33:1 sfz3:8 shda:8 shinobi:4 simp:5 skyfox:2 skys:6 smar:4 snow:7 sold:8 solo:6 spdr:9 spin95:7 ssf2:9 strider:11 supgt:4 takeda:2 tataka:7 terra:8 tetris:6 thdr:4 times:10 tmek:2 tp84:10 trs:8 trx:22 twin2:6 twinB:9 twin:9 twq:6 typh:7 unsq:7 vict:1 waku:8 wboy:9 wfang:3 wildp:4 will:12 xain:4 xexex:11 zwing:16)
strings=(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789!?@$%^'&*~+=-_.,"
    "SAMPLE%20TEXT"
)

urls=()

for pair in "${pairs[@]}"; do
    font=$(echo $pair | cut -d ':' -f 1)
    styles=$(echo $pair | cut -d ':' -f 2)
    for style in $(seq 0 $styles); do
        for string in "${strings[@]}"; do
            url="$endpoint/dbl-3/y-$font/z-$style/x-$string"
            urls+=($url)
        done
        urls+=("$endpoint/dbl-2/y-$font/z-$style/x-${alphabet[$style]}")
        urls+=("$endpoint/dbl-5/y-$font/z-$style/x-ARCADE%20FONT%20ENGINE")
    done
done

for url in "${urls[@]}"; do
    echo "url = \"$url\"" >> $output
done

curl -s --parallel --parallel-immediate --parallel-max 10 --config $output

rm $output
