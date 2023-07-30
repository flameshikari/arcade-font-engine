const endpoint = '/api.php'

const fonts = {
  "1943": {
    name: "1943 (Capcom)",
    variants: 10,
  },
  "acro": {
    name: "Acrobat Mission (UPL)",
    variants: 1,
  },
  "aerof": {
    name: "Aero Fighters (Kaneko)",
    variants: 8,
  },
  "aftb": {
    name: "Afterburner (Sega)",
    variants: 9,
  },
  "aof2": {
    name: "Art of Fighting 2 (SNK)",
    variants: 5,
  },
  "arab": {
    name: "Arabian Magic (Capcom)",
    variants: 4,
  },
  "arcade": {
    name: "Arcade Classic",
    variants: 8,
  },
  "arka": {
    name: "ArkArea (UPL)",
    variants: 5,
  },
  "armo": {
    name: "ArmoredWarriors (Capcom)",
    variants: 5,
  },
  "ass": {
    name: "Assault (Namco)",
    variants: 8,
  },
  "astx": {
    name: "Asterix (Konami)",
    variants: 9,
  },
  "atascii": {
    name: "ATASCII",
    variants: 4,
  },
  "aura": {
    name: "Aurail (Sega)",
    variants: 19,
  },
  "avng": {
    name: "Avengers (Capcom)",
    variants: 10,
  },
  "bakr": {
    name: "Battle Bakraid (Eighting)",
    variants: 7,
  },
  "baku": {
    name: "Bakuretsu Breaker (Kaneko)",
    variants: 4,
  },
  "bats": {
    name: "Batsugun (Toaplan)",
    variants: 10,
  },
  "bayr": {
    name: "Bay Route (Sega)",
    variants: 3,
  },
  "bcir": {
    name: "BattleCircuit (Capcom)",
    variants: 18,
  },
  "bdash": {
    name: "Boulder Dash (Data East)",
    variants: 8,
  },
  "bios": {
    name: "BioShipPaladin (UPL)",
    variants: 6,
  },
  "blaz": {
    name: "Blazing Star (Yumekobo)",
    variants: 8,
  },
  "blkt": {
    name: "Black Tiger (Capcom)",
    variants: 8,
  },
  "blwa": {
    name: "Blood Warrior (Kaneko)",
    variants: 8,
  },
  "bonz": {
    name: "Bonanza Bros (Sega)",
    variants: 7,
  },
  "boog": {
    name: "Boogie Wings (Data East)",
    variants: 5,
  },
  "bubma": {
    name: "Bubble Memories Alien (Taito)",
    variants: 4,
  },
  "bubs": {
    name: "Bubble Symphony (Taito)",
    variants: 9,
  },
  "caml": {
    name: "Cameltry (Taito)",
    variants: 9,
  },
  "chiki": {
    name: "Chiki Chiki Boys (Capcom)",
    variants: 5,
  },
  "cliff": {
    name: " Edward Randy (DataEast)",
    variants: 5,
  },
  "cmnds": {
    name: "Special (Capcom)",
    variants: 10,
  },
  "cotn": {
    name: "Cotton (Sega + Success)",
    variants: 16,
  },
  "cshk": {
    name: "Captain Sky Hawk (RARE)",
    variants: 4,
  },
  "cyba": {
    name: "Cybattler (Jaleco)",
    variants: 6,
  },
  "ddcrew": {
    name: "D D Crew (Sega)",
    variants: 4,
  },
  "dddon": {
    name: "Don Doko Don (Taito)",
    variants: 7,
  },
  "ddp": {
    name: "DoDonPachi (Cave)",
    variants: 12,
  },
  "ddr": {
    name: "Dance Dance Revolution (Konami)",
    variants: 10,
  },
  "ddux": {
    name: "Dynamite Dux (Sega)",
    variants: 9,
  },
  "deta": {
    name: "Detana Twinbee (Konami)",
    variants: 8,
  },
  "dima": {
    name: "Dimahoo (Raizing)",
    variants: 9,
  },
  "drbr": {
    name: "Dragon Breed (Irem)",
    variants: 3,
  },
  "dsab": {
    name: "Dragon Saber (Namco)",
    variants: 8,
  },
  "dspir": {
    name: "Dragon Spirit (Namco)",
    variants: 10,
  },
  "f1dr": {
    name: "F1 Dream (Capcom)",
    variants: 6,
  },
  "flak": {
    name: "Flak Attack (Konami)",
    variants: 7,
  },
  "flys": {
    name: "Flying Shark (Taito)",
    variants: 16,
  },
  "fstarf": {
    name: "Final Star Force (Tecmo)",
    variants: 7,
  },
  "fz": {
    name: "Fantasy Zone (Sega)",
    variants: 5,
  },
  "gaia": {
    name: "Gaiapolis (Konami)",
    variants: 11,
  },
  "gain": {
    name: "Gain Ground (Sega)",
    variants: 7,
  },
  "garou": {
    name: "Garou Densetsu (SNK)",
    variants: 4,
  },
  "gng1": {
    name: "Ghosts n Goblins (Capcom)",
    variants: 11,
  },
  "gng2": {
    name: "Ghouls n Ghosts (Capcom)",
    variants: 10,
  },
  "gond": {
    name: "Gondomania (Data East)",
    variants: 6,
  },
  "gradius2": {
    name: "Gradius 2 (Konami)",
    variants: 8,
  },
  "gradius3": {
    name: "Gradius 3 (Konami)",
    variants: 3,
  },
  "gradius4": {
    name: "Gradius 4 (Konami)",
    variants: 7,
  },
  "gradius": {
    name: "Gradius",
    variants: 3,
  },
  "guar": {
    name: "Guardians (Banpresto)",
    variants: 9,
  },
  "gunb": {
    name: "GunBuster (Taito)",
    variants: 11,
  },
  "gunn": {
    name: "GunNail (NMK)",
    variants: 11,
  },
  "guns": {
    name: "Gun.Smoke (Capcom)",
    variants: 4,
  },
  "gyrs": {
    name: "Gyruss (Konami)",
    variants: 7,
  },
  "hach": {
    name: "Hacha Mecha Fighter (NMK)",
    variants: 5,
  },
  "hatt": {
    name: "Hat Trick Hero 95 (Taito)",
    variants: 13,
  },
  "imgf": {
    name: "Image Fight (IREM)",
    variants: 6,
  },
  "kais": {
    name: "Kaiser Knuckle (Taito)",
    variants: 8,
  },
  "ketsui": {
    name: "Ketsui (Cave)",
    variants: 10,
  },
  "kiki": {
    name: "Kiki Kaikai (Taito)",
    variants: 4,
  },
  "kira": {
    name: "Kirameki Star Road (Taito)",
    variants: 5,
  },
  "klaxa": {
    name: "Klax Alternate (Atari)",
    variants: 3,
  },
  "klax": {
    name: "Klax (Atari)",
    variants: 3,
  },
  "kof2k1": {
    name: "King of Fighters 2001 (SNK)",
    variants: 9,
  },
  "kof2k2": {
    name: "King of Fighters 2002 (SNK)",
    variants: 7,
  },
  "kof2k3": {
    name: "King of Fighters 2003 (SNK)",
    variants: 4,
  },
  "kof2k": {
    name: "King of Fighters 2000 (SNK)",
    variants: 7,
  },
  "kof97i": {
    name: "King of Fighters 97 Italic (SNK)",
    variants: 12,
  },
  "kof97": {
    name: "King of Fighters 97 (SNK)",
    variants: 12,
  },
  "ladu": {
    name: "Last Duel (Capcom)",
    variants: 5,
  },
  "lastb": {
    name: "Last Blade 2 (SNK)",
    variants: 6,
  },
  "last": {
    name: "Last Resort (SNK)",
    variants: 7,
  },
  "lghost": {
    name: "Laser Ghost (Sega)",
    variants: 4,
  },
  "libr": {
    name: "Light Bringer (Capcom)",
    variants: 4,
  },
  "lwing": {
    name: "Legendary Wings (Capcom)",
    variants: 5,
  },
  "mars": {
    name: "Mars Matrix (Capcom)",
    variants: 12,
  },
  "mgs": {
    name: "Metal Gear Solid (Konami)",
    variants: 4,
  },
  "mjack": {
    name: "Michael Jackson Moonwalker",
    variants: 6,
  },
  "moma": {
    name: "Monster Mauler (Konami)",
    variants: 8,
  },
  "mt": {
    name: "Major Title (IREM)",
    variants: 13,
  },
  "muni": {
    name: "Mutant Night (UPL)",
    variants: 8,
  },
  "mwar": {
    name: "Metal Warriors (Konami)",
    variants: 2,
  },
  "namco2": {
    name: "Namco Classic Gradient",
    variants: 6,
  },
  "nds": {
    name: "Dangerous Seed (Namco)",
    variants: 11,
  },
  "nebu": {
    name: "Nebulas Ray (Namco)",
    variants: 8,
  },
  "niga": {
    name: "Ninja Gaiden (Tecmo)",
    variants: 5,
  },
  "ninjak": {
    name: "Ninja Kids (Taito)",
    variants: 10,
  },
  "ninjas": {
    name: "Ninja Spirit (IREM)",
    variants: 5,
  },
  "ninj": {
    name: "Ninja Masters (ADK)",
    variants: 4,
  },
  "nstrike": {
    name: "Night Striker (Taito)",
    variants: 7,
  },
  "ord": {
    name: "Ordyne (Namco).png",
    variants: 5,
  },
  "outf": {
    name: "Outfoxies (Namco)",
    variants: 7,
  },
  "pabom": {
    name: "Panic Bomber (Hudson)",
    variants: 9,
  },
  "paro": {
    name: "Parodius DA! (Konami)",
    variants: 4,
  },
  "pckf": {
    name: "Pickford Brothers",
    variants: 6,
  },
  "psr2": {
    name: "Pachinko Sexy Reaction 2 (Sammy)",
    variants: 8,
  },
  "pubu": {
    name: "Puzzle Bobble (Taito)",
    variants: 7,
  },
  "puls": {
    name: "Pulstar (Aicom)",
    variants: 7,
  },
  "qtet": {
    name: "Quartet 2 (Sega)",
    variants: 4,
  },
  "quake": {
    name: "Quake (id)",
    variants: 2,
  },
  "raph": {
    name: "Rapid Hero (MTC)",
    variants: 4,
  },
  "rayf": {
    name: "RayForce (Taito)",
    variants: 9,
  },
  "rcop2": {
    name: "Robocop 2 (Data East)",
    variants: 5,
  },
  "rcop": {
    name: "Robocop (Data East)",
    variants: 3,
  },
  "rezon": {
    name: "Rezon (Allumer)",
    variants: 1,
  },
  "rf": {
    name: "Raiden Fighters (Seibu)",
    variants: 10,
  },
  "ridef": {
    name: "Riding Fight (Taito)",
    variants: 8,
  },
  "roadr": {
    name: "Road Riot (Atari)",
    variants: 3,
  },
  "robot": {
    name: "Robotron (Williams)",
    variants: 4,
  },
  "rtl": {
    name: "R Type LEO (Irem)",
    variants: 8,
  },
  "rtype": {
    name: "R Type (Irem)",
    variants: 8,
  },
  "rumba": {
    name: "Rumba Lumber (Taito)",
    variants: 2,
  },
  "sabo": {
    name: "Saboten Bombers (NMK)",
    variants: 1,
  },
  "sala2": {
    name: "Salamander 2 (Konami)",
    variants: 7,
  },
  "samsho2": {
    name: "Samurai Shodown 2 (SNK)",
    variants: 9,
  },
  "samsho3": {
    name: "Samurai Shodown 3 (SNK)",
    variants: 10,
  },
  "sar": {
    name: "Search and Rescue (SNK)",
    variants: 1,
  },
  "sboom": {
    name: "Sonic Boom (Sega)",
    variants: 5,
  },
  "sdi": {
    name: "SDI (Sega)",
    variants: 7,
  },
  "sexy": {
    name: "Parodius (Konami)",
    variants: 8,
  },
  "sf2": {
    name: "Street Fighter II (Capcom)",
    variants: 9,
  },
  "sfz3": {
    name: "Street Fighter Zero 3 (Capcom)",
    variants: 8,
  },
  "shda": {
    name: "ShadowDancer (Sega)",
    variants: 8,
  },
  "shinobi": {
    name: "Shinobi (Sega)",
    variants: 4,
  },
  "simp": {
    name: "The Simpsons (Konami)",
    variants: 5,
  },
  "skyfox": {
    name: "Sky Fox (Nichibutsu)",
    variants: 2,
  },
  "skys": {
    name: "Sky Soldier (SNK)",
    variants: 6,
  },
  "smar": {
    name: "Super Mario Bros 3 (Nintendo)",
    variants: 4,
  },
  "snow": {
    name: "Snow Bros (Toaplan)",
    variants: 7,
  },
  "sold": {
    name: "Soldam (Jaleco)",
    variants: 8,
  },
  "solo": {
    name: "Solomons Key (Tecmo)",
    variants: 6,
  },
  "spdr": {
    name: "Speed Rumbler (Capcom)",
    variants: 9,
  },
  "spin95": {
    name: "Space Invaders 95 (Taito)",
    variants: 7,
  },
  "ssf2": {
    name: "Super Street Fighter 2 (Capcom)",
    variants: 9,
  },
  "strider": {
    name: "Strider Hiryu (Capcom)",
    variants: 11,
  },
  "supgt": {
    name: "Super GT 24 (Jaleco)",
    variants: 4,
  },
  "takeda": {
    name: "Takeda Shingen (Jaleco)",
    variants: 2,
  },
  "tataka": {
    name: "Tatakae Big Fighter (Nichibutsu)",
    variants: 7,
  },
  "terra": {
    name: "Terra Force (Nichibutsu)",
    variants: 8,
  },
  "tetris": {
    name: "Tetris (Sega)",
    variants: 6,
  },
  "thdr": {
    name: "Thunder Dragon (NMK)",
    variants: 4,
  },
  "times": {
    name: "Time Soldiers (ADK)",
    variants: 10,
  },
  "tmek": {
    name: "Mek (Atari)",
    variants: 2,
  },
  "tp84": {
    name: "Time Pilot 84 (Konami)",
    variants: 10,
  },
  "trs": {
    name: "Top Ranking Stars (Taito)",
    variants: 8,
  },
  "trx": {
    name: "Truxton (Toaplan)",
    variants: 22,
  },
  "twin2": {
    name: "Twin Cobra II (Taito)",
    variants: 9,
  },
  "twinB": {
    name: "Twinbee (Konami)",
    variants: 6,
  },
  "twin": {
    name: "Twin Cobra (Toaplan)",
    variants: 9,
  },
  "twq": {
    name: "Twin Qix (Taito)",
    variants: 6,
  },
  "typh": {
    name: "Typhoon (Konami)",
    variants: 7,
  },
  "unsq": {
    name: "UN Squadron (Capcom)",
    variants: 7,
  },
  "vict": {
    name: "Victory Road (SNK)",
    variants: 1,
  },
  "waku": {
    name: "Waku Waku 7 (Sunsoft)",
    variants: 8,
  },
  "wboy": {
    name: "Wonder Boy (Sega)",
    variants: 9,
  },
  "wfang": {
    name: "Wolf Fang (Taito)",
    variants: 3,
  },
  "wildp": {
    name: "Wild Pilot (Jaleco)",
    variants: 4,
  },
  "will": {
    name: "Willow (Capcom)",
    variants: 12,
  },
  "xain": {
    name: "Solar Warrior (Technos)",
    variants: 4,
  },
  "xexex": {
    name: "Xexex (Konami)",
    variants: 11,
  },
  "zwing": {
    name: "Zero Wing (Toaplan)",
    variants: 16,
  },
}