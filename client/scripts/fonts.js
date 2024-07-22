import aura from '../images/notes/aura.png';
import ddp from '../images/notes/ddp.png';
import mgs from '../images/notes/mgs.png';
import outf0 from '../images/notes/outf-0.png';
import outf1 from '../images/notes/outf-1.png';
import outf2 from '../images/notes/outf-2.png';
import outf3 from '../images/notes/outf-3.png';
import outf4 from '../images/notes/outf-4.png';
import outf5 from '../images/notes/outf-5.png';
import outf6 from '../images/notes/outf-6.png';
import rayf from '../images/notes/rayf.gif';
import rtype from '../images/notes/rtype.gif';
import shda from '../images/notes/shda.png';
import shinobi from '../images/notes/shinobi.png';
import tp84 from '../images/notes/tp84.png';
import wfang from '../images/notes/wfang.png';


const fonts = {
    '1943': {
        index: 1,
        name: '1943',
        company: 'Capcom',
        styles: 10,
        notes: ''
    },
    acro: {
        index: 2,
        name: 'Acrobat Mission',
        company: 'UPL',
        styles: 1,
        notes: ''
    },
    aerof: {
        index: 3,
        name: 'Aero Fighters',
        company: 'Kaneko',
        styles: 8,
        notes: 'This good looking fat font is nearly identical to one used by Sammy years later in their Pachinko Sexy Reaction 2 game.<br><br>The original was monochrome, I have added my own gradients to some of these.'
    },
    aftb: {
        index: 4,
        name: 'Afterburner',
        company: 'Sega',
        styles: 9,
        notes: "Sega threw out the rulebook with this one. Every character is as thick as possible without making it totally unreadable. Wherever convenient they'd make one that would be next to unreadable out of context - a triangle for an A, a strange spiral for a Q."
    },
    aof2: {
        index: 5,
        name: 'Art of Fighting 2',
        company: 'SNK',
        styles: 5,
        notes: ''
    },
    arab: {
        index: 6,
        name: 'Arabian Magic',
        company: 'Capcom',
        styles: 4,
        notes: "This semi-cursive serif font is a very impressive work. Most companies won't dare try to pack this much style into 8x8 pixels, but Capcom, a font favourite of mine, knows no limits."
    },
    arcade: {
        index: 7,
        name: 'Arcade Classic',
        company: '',
        styles: 8,
        notes: "This is <i>the</i> classic arcade font. First used in Atari's Quiz Show, you can find it in the same or slightly modified form in games from just about every game manufacturer, from the early eighties until well into the nineties. Taito and Namco were especially enamoured with it."
    },
    arka: {
        index: 8,
        name: 'ArkArea',
        company: 'UPL',
        styles: 5,
        notes: "I love UPL games, but most of their arcade releases don't really impress font-wise. This one's a very lovely exception. Unusually for an 8x8 font Ark Area offers a pseudo-3D look which works really well for what is, under the shine, a fat font. It even has drop-shadow!"
    },
    armo: {
        index: 9,
        name: 'ArmoredWarriors',
        company: 'Capcom',
        styles: 5,
        notes: 'Capcom really likes their thin fonts, and one very much like this was used in most of their CPS2 releases. This one is a more modern release, and impressively they managed anti-alias the letters. A very impressive feat in an 8x8 space!'
    },
    ass: {
        index: 10,
        name: 'Assault',
        company: 'Namco',
        styles: 8,
        notes: "This is an unusual font for Namco. Normally they stick to the Classic font, but for this twin-stick tank shooter they used a fairly typical fat-font with a futuristic cut on the top-right. It's very similar to other fat fonts, but has a curious kinship with the Aero Fighters font, which has a cut on the top left.<br><br>Once again the gradients are my own addition, they're not from the game."
    },
    astx: {
        index: 11,
        name: 'Asterix',
        company: 'Konami',
        styles: 9,
        notes: ''
    },
    atascii: {
        index: 12,
        name: 'ATASCII',
        company: '',
        styles: 4,
        notes: ''
    },
    aura: {
        index: 13,
        name: 'Aurail',
        company: 'Sega',
        styles: 20,
        notes: `Aurail's one of my favourite games, and it's got a great font. It also has a little bit of extra-large font for the copyright notice:<br><br><center><img src="${aura}"></center><br>It still fits within the 8x8 boundary, but has no outline and takes up an extra pixel or two compared to the regular font.`
    },
    avng: {
        index: 14,
        name: 'Avengers',
        company: 'Capcom',
        styles: 10,
        notes: 'This one is kind of unusual. It has three colours, and depending on the palette used, can appear to be either pseudo-3D, or with a secondary drop shadow, or with some fairly effective but rudimentary anti-aliasing.'
    },
    bakr: {
        index: 15,
        name: 'Battle Bakraid',
        company: 'Eighting',
        styles: 7,
        notes: ''
    },
    baku: {
        index: 16,
        name: 'Bakuretsu Breaker',
        company: 'Kaneko',
        styles: 4,
        notes: "I almost didn't include this one because, while it looks decent enough in-game, it looks fairly rough up close.<br><br>I'd wager that the font was created from a higher res source, downsized via algorithm. What appears to be a small font with a two-colour shadow is actually an automatically-aliased downsampling, resulting in misshapen characters and odd pixel placements."
    },
    bats: {
        index: 17,
        name: 'Batsugun',
        company: 'Toaplan',
        styles: 10,
        notes: 'This font is kind of a failure, IMO. With only eight pixels to work with, clarity is vital, and a stencil font already pushes hard against the limits. Adding a complicated 5-colour diagonal gradient and a matching two-colour drop-shadow makes this font very hard to read. Some combinations work, but most are really just cluttered. Much like the game itself, in fact, Toaplan seems to have tried too hard to pack too much into a container that could not carry it all.'
    },
    bayr: {
        index: 18,
        name: 'Bay Route',
        company: 'Sega',
        styles: 3,
        notes: ''
    },
    bcir: {
        index: 19,
        name: 'BattleCircuit',
        company: 'Capcom',
        styles: 18,
        notes: 'This is a very pretty font, with thick verticals and all other lines thin. It also features some pretty shading, with some very nice palette choices.'
    },
    bdash: {
        index: 20,
        name: 'Boulder Dash',
        company: 'Data East',
        styles: 8,
        notes: "I'm not entirely sure what's up with this font. It's not completely ugly, but it's not really polished either. What's with the chunky S, and the H with one side serif and one side sans? Why is there a stroke through the upper-case D?? It's just bizarre, overall."
    },
    bios: {
        index: 21,
        name: 'BioShipPaladin',
        company: 'UPL',
        styles: 6,
        notes: "This one's hard to love. It seems like a prototype version of UPL's other great 3D fat-font from Ark Area, but it has some unique features of its own. It uses its three colours very well, to present a thin font with a deep 3D appearance, and looks great at large sizes. Sadly though it looks quite pathetic when rendered at 1x or 2x size."
    },
    blaz: {
        index: 22,
        name: 'Blazing Star',
        company: 'Yumekobo',
        styles: 8,
        notes: `This is a nicely updated version of <img src="/api.php/y-puls/z-1/x-PULSTAR'S"> futuristic font. Many letters were updated to look more consistently spacey, instead of like the standard Namco font with a few futuristic bits n bobs.`
    },
    blkt: {
        index: 23,
        name: 'Black Tiger',
        company: 'Capcom',
        styles: 8,
        notes: 'This Capcom font is used in many of their games, including Street Fighter 2 which used a basically identical font with a colourful gradient.'
    },
    blwa: {
        index: 24,
        name: 'Blood Warrior',
        company: 'Kaneko',
        styles: 8,
        notes: "This gorgeously colourful font almost looks like a computer font (Dangerous Seed, the bottom of a cheque) but it's more like a thick-font, with a skinny left vertical... Mostly I just like the colours, it's so Atari-8-bit."
    },
    bonz: {
        index: 25,
        name: 'Bonanza Bros',
        company: 'Sega',
        styles: 7,
        notes: "It's not really a radical font, but it's nice and clear and has a certain character of its own."
    },
    boog: {
        index: 26,
        name: 'Boogie Wings',
        company: 'Data East',
        styles: 5,
        notes: "This shades-of-orange thin font looks an awful lot like Capcom's CPS2 fonts, minus the anti-aliasing. It's not otherwise particularly noteworthy."
    },
    bubma: {
        index: 27,
        name: 'Bubble Memories Alien',
        company: 'Taito',
        styles: 4,
        notes: "This crazy little font comes from Taito's <i>Bubble Memories</i> game. Interestingly it's almost readable, as each letter has a basis in the original Roman alphabet."
    },
    bubs: {
        index: 28,
        name: 'Bubble Symphony',
        company: 'Taito',
        styles: 9,
        notes: 'This is a cute little bubble font. Strangely Taito made it smaller than the 8 pixels would have allowed, leading to some legibility problems.'
    },
    caml: {
        index: 29,
        name: 'Cameltry',
        company: 'Taito',
        styles: 9,
        notes: "This is a gorgeous font. Taito didn't stray far from the standard often - like Namco, they stuck with the Classic font more often than not. When they deviated though... Well, the results are in front of you. Cameltry's square fat font is gorgeous to look at, in part because of the colours, but also the shading. No gradient here, just an outline and a simple second colour, which makes some letters look 3D."
    },
    chiki: {
        index: 30,
        name: 'Chiki Chiki Boys',
        company: 'Capcom',
        styles: 5,
        notes: 'I really like what Capcom did with this font. It has very readable quality, and the lower case is exceptionally clear while fitting with the upper-case style. Not many fonts pull that off, but Capcom are masters of the 8x8 font.<br><br>Not entirely sold on the lower-case Z tho, it looks a little too much like a three.'
    },
    cliff: {
        index: 31,
        name: 'Edward Randy',
        company: 'DataEast',
        styles: 5,
        notes: 'A solid if unremarkable italic font from Data East. Sadly all the colours are quite dark.'
    },
    cmnds: {
        index: 32,
        name: 'Special',
        company: 'Capcom',
        styles: 10,
        notes: "This one's not really a font designed for regular use. When entering your initials on the high-score screen, the upper and lower case letters of this font would appar to spin, flickered in quick succession with the regular font."
    },
    cotn: {
        index: 33,
        name: 'Cotton',
        company: 'Sega + Success',
        styles: 16,
        notes: 'I love this balloon-like, asymmetrical, rounded fat font. I love the colours too. Sega/Success really made something unique here.'
    },
    cshk: {
        index: 34,
        name: 'Captain Sky Hawk',
        company: 'RARE',
        styles: 4,
        notes: ''
    },
    cyba: {
        index: 35,
        name: 'Cybattler',
        company: 'Jaleco',
        styles: 6,
        notes: 'Just a bog-standard computer-style font with a beautiful, colourful gradient and a hint of anti-aliasing.'
    },
    ddcrew: {
        index: 36,
        name: 'D D Crew',
        company: 'Sega',
        styles: 4,
        notes: ''
    },
    dddon: {
        index: 37,
        name: 'Don Doko Don',
        company: 'Taito',
        styles: 7,
        notes: "Taito, like Namco, rarely strayed from the Classic font, but they did for Don Doko Don. What's really strange is that the font seems futuristic, but the game is a forest & elves platformer. It's definitely out of place, but it's a cool font.<br><br>Seems to be the same as Liquid Kids."
    },
    ddp: {
        index: 38,
        name: 'DoDonPachi',
        company: 'Cave',
        styles: 12,
        notes: `This font is fairly interesting: if you look closely, the same gradient pattern is used in every letter, a diagonal dark-to-light with most of the top-left corner being the lightest colour. In the sprite data I found an 8x8 tile that is the <i>fill pattern</i> for this font. It could have been used as a fill, or guide, or even an overlay, filling any space with the gradient pattern used for these fonts.<br><br><center><img src="${ddp}"></center><br>This sort of fill is not as common as you might think. Many fonts use a pattern that's customized, to some extent, to each letter. Seibu's <i>Raiden Fighters</i>, for example, with its highlight always at the brightest point for every letter, no matter where it is.`
    },
    ddr: {
        index: 39,
        name: 'Dance Dance Revolution',
        company: 'Konami',
        styles: 10,
        notes: ''
    },
    ddux: {
        index: 40,
        name: 'Dynamite Dux',
        company: 'Sega',
        styles: 9,
        notes: "This one's a nice variation on the standard fat-font, with some interesting colour choices for a beat-em-up. It's very similar to a font used in several of Sega's other games, like Afterburner."
    },
    deta: {
        index: 41,
        name: 'Detana Twinbee',
        company: 'Konami',
        styles: 8,
        notes: ''
    },
    dima: {
        index: 42,
        name: 'Dimahoo',
        company: 'Raizing',
        styles: 9,
        notes: "I'm not entirely convinced that this font is unique, but it looks good and has a few nice gradients, so here you go."
    },
    drbr: {
        index: 43,
        name: 'Dragon Breed',
        company: 'Irem',
        styles: 3,
        notes: "I'm not sure if I like this font. It seems lumpy, but it has beautiful gradients."
    },
    dsab: {
        index: 44,
        name: 'Dragon Saber',
        company: 'Namco',
        styles: 8,
        notes: 'Another rare instance where Namco strays from their standard font path. This one has a certain medieval charm, which I guess is appropriate for a game about dragons. The gradients are not from the game.'
    },
    dspir: {
        index: 45,
        name: 'Dragon Spirit',
        company: 'Namco',
        styles: 10,
        notes: "This is a nicely refined descendant of Namco's standard font, with just enough tweaks to make it different without being hard to read. The gradients in these were included in the game sprites, but were not actually used in the game itself - not for fonts, anyway. So they're sort of but not quite authentic."
    },
    f1dr: {
        index: 46,
        name: 'F1 Dream',
        company: 'Capcom',
        styles: 6,
        notes: ''
    },
    flak: {
        index: 47,
        name: 'Flak Attack',
        company: 'Konami',
        styles: 7,
        notes: 'An unusual, segmented font, mimicking those 8-segment LED displays with surprising effectiveness for an 8x8 space.'
    },
    flys: {
        index: 48,
        name: 'Flying Shark',
        company: 'Taito',
        styles: 16,
        notes: 'Toaplan really liked to mess about with their fonts. Using only four colours this very readable font conjures up immediate happiness when you see it in the game.'
    },
    fstarf: {
        index: 49,
        name: 'Final Star Force',
        company: 'Tecmo',
        styles: 7,
        notes: "Tecmo's Final Star Force is one of a very few games that manages to squeeze a serif font into the 8x8 pixel cage, and it manages to do a decent job of it too. Of course, it's easier when you don't have to worry about lower-case. =)"
    },
    fz: {
        index: 50,
        name: 'Fantasy Zone',
        company: 'Sega',
        styles: 5,
        notes: 'This little font is a very reusable thing. With its black outline it rarely clashes with any background, and remains very readable at all sizes.'
    },
    gaia: {
        index: 51,
        name: 'Gaiapolis',
        company: 'Konami',
        styles: 11,
        notes: "This one's a good looking font, but the drop shadow on most letters is missing from the left-most side. This makes the letters look really strange when they're not adjacent to each other."
    },
    gain: {
        index: 52,
        name: 'Gain Ground',
        company: 'Sega',
        styles: 7,
        notes: 'Gain Ground is a strange game. It involved time travelling warriors, and the font seems to capture that spirit well, being neither futuristic or medieval, but rather a unique fusion of both.'
    },
    garou: {
        index: 53,
        name: 'Garou Densetsu',
        company: 'SNK',
        styles: 4,
        notes: ''
    },
    gng1: {
        index: 54,
        name: 'Ghosts n Goblins',
        company: 'Capcom',
        styles: 11,
        notes: 'A classy font for a classic game. Easy to read, with a charmingly medieval feel.'
    },
    gng2: {
        index: 55,
        name: 'Ghouls n Ghosts',
        company: 'Capcom',
        styles: 10,
        notes: "Like Sega's Shadow Dancer, Capcom's new hardware allowed them to take a good looking font and drive it to the brink of disaster with the greater palette allowed by more powerful hardware. Capcom managed to make it work some of the time, but there are certain colour combinations that take a beautiful character set and muck it all up. Any of these colour variations with a drop-shadow lighter than the font itself tends to look awful. To their credit, it seems that these were never actually used in-game... But still."
    },
    gond: {
        index: 56,
        name: 'Gondomania',
        company: 'Data East',
        styles: 6,
        notes: "Italic fonts are not common in the arcade, as it can be quite hard to get them to look good. Sometimes you can pull it off with a single colour (See Konami's Time Pilot) but - with the luxury of <i>two colours</i> you can make them look very good indeed."
    },
    gradius2: {
        index: 57,
        name: 'Gradius 2',
        company: 'Konami',
        styles: 3,
        notes: ''
    },
    gradius3: {
        index: 58,
        name: 'Gradius 3',
        company: 'Konami',
        styles: 7,
        notes: 'This is a lovely remake of the Gradius font, with rounded corners and, overall, a cleaner look.'
    },
    gradius4: {
        index: 59,
        name: 'Gradius 4',
        company: 'Konami',
        styles: 3,
        notes: "Interestingly Konami abandoned the rounded Gradius 3 font in favour of this Gradius 1 lookalike. A couple of rounded corners carried over from Gradius 3 and an all-new gradient, but it's otherwise Gradius 1 again."
    },
    gradius: {
        index: 60,
        name: 'Gradius',
        company: '',
        styles: 8,
        notes: "This gorgeous font lacks almost all punctuation, if you really want it, you can try Xexex or Gradius II or Gradius III, all of which have additional characters. This one's basically here for the sake of completing the Gradius series."
    },
    guar: {
        index: 61,
        name: 'Guardians',
        company: 'Banpresto',
        styles: 9,
        notes: "This schizophrenic little beauty can't decide if it's serif or sans-serif."
    },
    gunb: {
        index: 62,
        name: 'GunBuster',
        company: 'Taito',
        styles: 11,
        notes: 'This is a brilliant font. Totally readable at any size, great colours, and a subtle but appealing gradient. Also, in the actual game, a fading laser effect makes it look 200x more awesome than it does here.<br><br>Trivia: the dropshadow on this also has a great looking gradient, but it was a lot of extra work to rip, as it matched the background perfectly.'
    },
    gunn: {
        index: 63,
        name: 'GunNail',
        company: 'NMK',
        styles: 11,
        notes: "This is basically the Classic font with a sexy gradient. There are a few unique characters, but otherwise there's nothing to see here but purty colours."
    },
    guns: {
        index: 64,
        name: 'Gun.Smoke',
        company: 'Capcom',
        styles: 4,
        notes: "Thie one's the same as Side Arms, and it strikes me as odd that a military-looking stencil font was used for both an olde west and sci-fi shooter."
    },
    gyrs: {
        index: 65,
        name: 'Gyruss',
        company: 'Konami',
        styles: 7,
        notes: "This is one of my favourites. Individually they might not look like much, but when they're on the screen as you pop a quarter into the machine and the music starts to play, they're made of magic. Interesting gradient on this one too, hand-pixeled, with an almost metallic look."
    },
    hach: {
        index: 66,
        name: 'Hacha Mecha Fighter',
        company: 'NMK',
        styles: 5,
        notes: "NMK's Hacha Mecha Fighter is batshit insane, but it's visually amazing, right down to the font. 8 x 8 pixels, full upper and lower case, all the punctuation, <i>in italics!</i> and for good measure there's some Japanese katakana in there as well. Except for the lack of colour options, it's one of the best fonts I've ever seen."
    },
    hatt: {
        index: 67,
        name: 'Hat Trick Hero 95',
        company: 'Taito',
        styles: 13,
        notes: "This is a surprisingly nice computer font that's totally inappropriate for use in a soccer game (Taito's Hat Trick Hero '95). Unusually, it has a full lower-case set. The smaller letters aren't always awesome (What's with the R?) and the M and N have strange tails on the top-left, but in all other respects this is one of my favourites."
    },
    imgf: {
        index: 68,
        name: 'Image Fight',
        company: 'IREM',
        styles: 6,
        notes: "This font is very, very similar to a handful of other fonts, with its futuristic top-right cut across many letters. It's different from the others, as it also has a stencil appearance, and thinner lines than many others (For example, Aero Fighters).<br><br>The lower-case letters are pretty ugly..."
    },
    kais: {
        index: 69,
        name: 'Kaiser Knuckle',
        company: 'Taito',
        styles: 8,
        notes: "I like this font. It's blunt, forceful and attractive at the same time. No effort wasted on ill-fitting, unnecessary diagonal lines, just in-your-face clarity. And hey, check out those colours!"
    },
    ketsui: {
        index: 70,
        name: 'Ketsui',
        company: 'Cave',
        styles: 10,
        notes: "Cave really lost the plot with their last releases. Ketsui was a great game saddled with ugly pre-rendered graphics and a font that is a testament to style before coherence.<br><br>Lower case letters with descenders, like p, q and g are very tall, which isn't uncommon, but why are the lower case a and s so tall?<br><br>The upper case set is much better overall, and the colours are excellent."
    },
    kiki: {
        index: 71,
        name: 'Kiki Kaikai',
        company: 'Taito',
        styles: 4,
        notes: "This is a very unusual font, with a distinct brush-stroke style. The closest match might be Sega's Shinobi, but they don't really look alike."
    },
    kira: {
        index: 72,
        name: 'Kirameki Star Road',
        company: 'Taito',
        styles: 5,
        notes: 'A very beautiful font that makes solid use of its 8x8 confines.'
    },
    klaxa: {
        index: 73,
        name: 'Klax Alternate',
        company: 'Atari',
        styles: 3,
        notes: "Atari rarely strayed from the tried-and-true Classic font, but for Klax they went all out with 3-colour anti-aliased characters. It's perhaps unique in its inclusion of <b>bold</b> and <i>italic</i> fonts in addition to the upper and lower case characters. All three faces are included here (Klax and Klax Alternate) though the italic and bold faces are not available in lower case.<br><br>Despite its variety, the font is not a total success: The italics are shoddy and uneven, with some characters leaning 2 pixels horizontally, and some leaning three (compare the H and I characters, for example). The italic D is really quite unattractive, though this is less likely a fault of the designer than the 8-pixel limitations."
    },
    klax: {
        index: 74,
        name: 'Klax',
        company: 'Atari',
        styles: 3,
        notes: "Atari rarely strayed from the tried-and-true Classic font, but for Klax they went all out with 3-colour anti-aliased characters. It's perhaps unique in its inclusion of <b>bold</b> and <i>italic</i> fonts in addition to the upper and lower case characters. All three faces are included here (Klax and Klax Alternate) though the italic and bold faces are not available in lower case.<br><br>Despite its variety, the font is not a total success: The italics are shoddy and uneven, with some characters leaning 2 pixels horizontally, and some leaning three (compare the H and I characters, for example). The italic D is really quite unattractive, though this is less likely a fault of the designer than the 8-pixel limitations."
    },
    kof2k1: {
        index: 75,
        name: 'King of Fighters 2001',
        company: 'SNK',
        styles: 7,
        notes: 'This is an excellent font, and quite unusual in its excellent use of a very small space. It is, in effect, a 6x5 font. It uses all eight pixels horizontally, two for the surrounding outline, but only seven pixels vertically, preserving an empty pixel for a gap between lines of text.<br><br>Small fonts are rare, and even more rarely done this well.'
    },
    kof2k2: {
        index: 76,
        name: 'King of Fighters 2002',
        company: 'SNK',
        styles: 4,
        notes: "The King of Fighters series always went for a thick slab font, until 2002. This thin little number is quite appealing for its clarity, but doesn't really do anything special."
    },
    kof2k3: {
        index: 77,
        name: 'King of Fighters 2003',
        company: 'SNK',
        styles: 7,
        notes: 'This is a competent but unambitious little font, with a clear square-cut appearance. Somewhat unusually it has a futuristic secondary style where the lower case letters would normally be.'
    },
    kof2k: {
        index: 78,
        name: 'King of Fighters 2000',
        company: 'SNK',
        styles: 9,
        notes: 'Except for some unusual colours, the only thing distinguishing the KoF 2000 font from the rest of the series is a smaller character set where the lower case letters would usually be.<br><br>I think the lower case letters actually look better than the standard characters.'
    },
    kof97i: {
        index: 79,
        name: 'King of Fighters 97 Italic',
        company: 'SNK',
        styles: 12,
        notes: ''
    },
    kof97: {
        index: 80,
        name: 'King of Fighters 97',
        company: 'SNK',
        styles: 12,
        notes: "This great looking font shows off SNK at the peak of their game. It looks great, and has a unique fill pattern, with a slightly different colour on the vertical edges.<br><br>There's also an Italic version."
    },
    ladu: {
        index: 81,
        name: 'Last Duel',
        company: 'Capcom',
        styles: 5,
        notes: "It's very unusual for any arcade font to have a break in it, moreso when it impacts legibility as it does here. The cut, and the dark line, make this font very hard to read on most backgrounds. Still, Last Duel is a great game, and this font looks just fine while playing. And, as a futuristic fat font and a rare failure (sorta) from Capcom, it's worth checking out here.<br><br>Would probably be cooler with some better colours..."
    },
    lastb: {
        index: 82,
        name: 'Last Blade 2',
        company: 'SNK',
        styles: 7,
        notes: "This font is quite restrained, with each letter being much narrower than it needs to be. Very few characters take the full eight horizontal pixesl they're allowed."
    },
    last: {
        index: 83,
        name: 'Last Resort',
        company: 'SNK',
        styles: 6,
        notes: "Last Resort was an RType-alike from SNK, with much of the design by the guys at IREM. Including, it seems, the font. This pretty thing features a rare horizontal gradient, (designed to cycle through the colours) that is nigh identical to Irem's RType LEO and Gallop."
    },
    lghost: {
        index: 84,
        name: 'Laser Ghost',
        company: 'Sega',
        styles: 4,
        notes: ''
    },
    libr: {
        index: 85,
        name: 'Light Bringer',
        company: 'Capcom',
        styles: 4,
        notes: ''
    },
    lwing: {
        index: 86,
        name: 'Legendary Wings',
        company: 'Capcom',
        styles: 5,
        notes: "This is a lovely little font that does its job well, and doesn't make too much of a mess of things."
    },
    mars: {
        index: 87,
        name: 'Mars Matrix',
        company: 'Capcom',
        styles: 12,
        notes: "Computer-looking fonts like this one are quite common, but it's <i>very</i> unusual for them to have lower case. In fact, I haven't seen another that does.<br><br>This is also fairly unusual with its brighter-than-the-font drop-shadow. Looks great though."
    },
    mgs: {
        index: 88,
        name: 'Metal Gear Solid',
        company: 'Konami',
        styles: 4,
        notes: `This isn't an arcade font, obviously, but it's a really good looking 8x6 font that looks great in-game.<br><br>The game treats the font as a proportionate one, adding a space between letters and reducing the spacing where appropriate (for example, the capital I).<br><br>In addition, in many places, the game creates a shadow which looks excellent, probably by simply slamming down two layers of text with a 1 pixel offset.<br><br><center><img src="${mgs}"></center>`
    },
    mjack: {
        index: 89,
        name: 'Michael Jackson Moonwalker',
        company: '',
        styles: 6,
        notes: 'As is normal for Sega, the whole set of capital letters look great, a bit stylish with a missing pixel on the top left corner.<br><br>As is normal for 8x8 fonts, the lower case letters are a mixed bag.'
    },
    moma: {
        index: 90,
        name: 'Monster Mauler',
        company: 'Konami',
        styles: 8,
        notes: "This font appears to be like many others at first, but then you notice that it's got a really unusual horizontal gradiant."
    },
    mt: {
        index: 91,
        name: 'Major Title',
        company: 'IREM',
        styles: 13,
        notes: "This one isn't really any different from the Classic, but I like the choice of colours in some of the gradients. Plus, I like Irem. =)"
    },
    muni: {
        index: 92,
        name: 'Mutant Night',
        company: 'UPL',
        styles: 8,
        notes: "This simple but clear font probably wouldn't merit inclusion if it wasn't from a game I really love, UPL's 1997 Mutant Night.<br><br>The same font, or one exactly like it, was used in most of UPL's games."
    },
    mwar: {
        index: 93,
        name: 'Metal Warriors',
        company: 'Konami',
        styles: 2,
        notes: "This is a strange font that shows signs of being a careless or rushed addition to the spectacular SNES game <i>Metal Warriors</i>. It's 8x7 in an 8x8 grid, and while most characters were drawn to fit, the question mark was simply cut off at the top. Some letters seem out of place, like the letter O which is oddly thick compared to the similarly shaped Q. The shadows are inconsistent, sometimes diagonal, sometimes horizontal or vertical, and sometimes missing or doubled up. Every letter with a TL:BR diagonal has a double shadow which is, frankly, bizarre.<br><br>Still, it's one of the best SNES games, and so here it is."
    },
    namco2: {
        index: 94,
        name: 'Namco Classic Gradient',
        company: '',
        styles: 6,
        notes: "This is just the Classic font with some gorgeous gradients from Namco's Burning Force."
    },
    nds: {
        index: 95,
        name: 'Dangerous Seed',
        company: 'Namco',
        styles: 11,
        notes: 'Another unusual Namco variation, this time a computer-looking font. The complete lack of diagonal lines make this one exceptionally easy to read, on any background.'
    },
    nebu: {
        index: 96,
        name: 'Nebulas Ray',
        company: 'Namco',
        styles: 8,
        notes: 'This font us unusually clean and legible despite using only six vertical pixels, including the shadow.<br><br>It is also quite unusual with the shadow - there are three colours, lending a very pleasing bit of transparent-seeming sophistication, to the single-colour characters.'
    },
    niga: {
        index: 97,
        name: 'Ninja Gaiden',
        company: 'Tecmo',
        styles: 5,
        notes: 'This is just the classic font with some great colours and drop-shadow.'
    },
    ninjak: {
        index: 98,
        name: 'Ninja Kids',
        company: 'Taito',
        styles: 5,
        notes: "This is a terrible font. It seems to have been created by someone who was uninterested in the whole process. The whole game is a sort of slap-dash effort, so in that respect the font is perfectly suited.<br><br>The more I look at it, the more I don't understand it. The shadow is terribly inconsistent. The capitals K, M and N have missing shadows for, I guess, reasons?<br><br>The lower case letters have a higher base than the upper case, and some letters like g and j use this for their descenders, but the lower case p does not. It seems as if the creator gave up halfway. It's not the worst font, but it's close."
    },
    ninjas: {
        index: 99,
        name: 'Ninja Spirit',
        company: 'IREM',
        styles: 4,
        notes: 'This is a very clean and simple font, I just love it. Not really fond of any of the colour variants tho - only the first one has any appeal.'
    },
    ninj: {
        index: 100,
        name: 'Ninja Masters',
        company: 'ADK',
        styles: 10,
        notes: "I don't know how I missed this one for so long. It's a really great italic brush-type font from the otherwise incapable pixel artists at ADK. At first I thought they must have ripped it off some other game... It reminds me a bit of Samurai Showdown 3, but it's actually unique."
    },
    nstrike: {
        index: 101,
        name: 'Night Striker',
        company: 'Taito',
        styles: 7,
        notes: 'This is a very competent thin font that adheres to its style effectively. It is unusual with its all-sides outline, which it shares with a very similar font in Top Ranking Stars, also from Taito, released four years after this game.'
    },
    ord: {
        index: 102,
        name: 'Ordyne',
        company: 'Namco.png',
        styles: 5,
        notes: ''
    },
    outf: {
        index: 103,
        name: 'Outfoxies',
        company: 'Namco',
        styles: 7,
        notes: `At some point you have to wonder if a developer is just showing off. Outfoxies by Namco is one such point. There are no fewer than seven distinct 8x8 fonts here, including:<br><br><img src="${outf0}"/><br><img src="${outf1}"/><br><img src="${outf2}"><br><img src="${outf3}"/><br><img src="${outf4}"/><br><img src="${outf5}"/><br><img src="${outf6}"/><br><br>I didn't bother adding colour variations, I leave that as an exercise for you, dear user.`
    },
    pabom: {
        index: 104,
        name: 'Panic Bomber',
        company: 'Hudson',
        styles: 9,
        notes: "Hudson's Panic Bomber was a decidedly average game with astonishing levels of polish. The music, the graphics, and even the font: this 8x8 font is brilliant. It's clear, a bit quirky and a whole lotta colourful."
    },
    paro: {
        index: 105,
        name: 'Parodius DA!',
        company: 'Konami',
        styles: 4,
        notes: ''
    },
    pckf: {
        index: 106,
        name: 'Pickford Brothers',
        company: '',
        styles: 6,
        notes: 'The Pickford Bros have been making games since before the NES days. These fonts are from some of their games. In order:<br><br>- Equinox<br>- Feud<br>- Plok<br>- Maximum Carnage<br>- Solar Jetman'
    },
    psr2: {
        index: 107,
        name: 'Pachinko Sexy Reaction 2',
        company: 'Sammy',
        styles: 8,
        notes: ''
    },
    pubu: {
        index: 108,
        name: 'Puzzle Bobble',
        company: 'Taito',
        styles: 7,
        notes: 'This fantastic thin font is simplicity itself. Each letter is a textbook example of a Roman character in 64 pixels, with just a hint of anti-aliasing to polish it all off.'
    },
    puls: {
        index: 109,
        name: 'Pulstar',
        company: 'Aicom',
        styles: 7,
        notes: "This is a great looking font, but it's even better in Blazing Star, a lesser sequel with a better font."
    },
    qtet: {
        index: 110,
        name: 'Quartet 2',
        company: 'Sega',
        styles: 4,
        notes: "This cute li'l font is a puffy single colour bit of Sega excellence, with an outline.<br><br>Not much to say really. It's competent and I like it.<br><br>Quartet and Quartet 2 use the same font."
    },
    quake: {
        index: 111,
        name: 'Quake',
        company: 'id',
        styles: 2,
        notes: ''
    },
    raph: {
        index: 112,
        name: 'Rapid Hero',
        company: 'MTC',
        styles: 4,
        notes: "This curious font reminds me of <strike>the inter...</strike> a series of tubes. Just about every segment (at least in the upper case letters) has a shadow, giving it a 3D tubular look. Sadly it doesn't carry through to every character, and some - especially the lower case - just look unfinished.<br><br>In a very strange move, they raised the lower case letters up one line to allow letters with a descender (g, j, q etc) to actually drop lower than other letters. Unfortunately, while this works well for lower-case words and phrases, it makes the letters look completely broken when mixed with capital letters."
    },
    rayf: {
        index: 113,
        name: 'RayForce',
        company: 'Taito',
        styles: 9,
        notes: `This is a gorgeous font, absolutely one of the very best. It's made even more impressive by its size - a full outline and only seven vertical pixels used. And I looove the colours! Still, the ones above cannot compare to the actual game where, using rapid palette switching, the fonts appear to shimmer with a faux-interlace effect. Like so:<br><br><center><img src="${rayf}"/></center><br><br>This one's vibrating at 1/50th of a second per frame, which isn't far off what the actual game does (1/60). It looks way, way better on a CRT at native speed. I love the effect.`
    },
    rcop2: {
        index: 114,
        name: 'Robocop 2',
        company: 'Data East',
        styles: 3,
        notes: "This is the same font as the first Robocop, with a nice new gradient and reduced emphasis on the anti-aliasing. Instead, letters are cut and appear more rounded, especially the lower case characters. The upper case letters aren't as uniformaly square-shaped as in the first game.<br><br>But what is with the extra pixel on the upper case J?"
    },
    rcop: {
        index: 115,
        name: 'Robocop',
        company: 'Data East',
        styles: 5,
        notes: "This is a clean little font with a single darker colour for rudimentary anti-aliasing. The lower case letters are a mixed bag overall, but the upper case set is really great in their own context.<br><br>Nearly every letter fills the entire 8x8 grid, and where they don't some steps are taken to ensure they do: the upper case J has a shadow that's two pixels thick, and the lower case k is, frankly, weird."
    },
    rezon: {
        index: 116,
        name: 'Rezon',
        company: 'Allumer',
        styles: 1,
        notes: "Rezon uses an 8x8 font stored in a 16x16 grid, which made its extraction fairly tedious.<br><br>There's only one colour variation, but it's a good looking thin font that makes every attempt to fill the space to every edge."
    },
    rf: {
        index: 117,
        name: 'Raiden Fighters',
        company: 'Seibu',
        styles: 10,
        notes: "I have a soft spot for <i>Raiden</i>. Seibu's shooter raised the bar in the genre, setting new standards and conventions for other games to try and follow. Perhaps it's no coincidence that I love this font then. It's strong, with a unique diagonal gradient: every letter is hand-shaded, so that there's a highlight in the right place and all five gradient colours are used, no matter the size, shape or orientation. Many other fonts, with a flat horizontal gradient or plain fill (like Cave's <i>DoDonPachi</i>) just don't look as nice."
    },
    ridef: {
        index: 118,
        name: 'Riding Fight',
        company: 'Taito',
        styles: 8,
        notes: "Riding Fight is a game that would look at home on the Super NES, and be criticized for a total lack of depth. In keeping with that damning assesment, the font is awful too.<br><br>Italic letters are always tricky in an 8x8 grid, and the designer of this font seemed to give up every time it got messy. Messy is, in fact, how I'd describe it. The lower case i isn't italic at all.<br><br>Really just bad, overall."
    },
    roadr: {
        index: 119,
        name: 'Road Riot',
        company: 'Atari',
        styles: 3,
        notes: "I have a soft spot for Atari, but I have to admit their game art is average much of the time. This font confounds me, I just don't know what they were trying to achieve.<br><br>The weird horizontal gradient almost suggests an attempt to create depth, but it's dark on the left and right sides and the result is more of a horizontal shimmer.<br><br>It makes my eyes hurt when I look at it for too long."
    },
    robot: {
        index: 120,
        name: 'Robotron',
        company: 'Williams',
        styles: 4,
        notes: `There are two fonts in Williams' Robotron, and this is unusual for a bunch of reasons. It's very odd for such an early game - this one released in 1982 - to include more than one font, and it might be the first to include proportional fonts, where thinner characters take less space on the screen. (For the purposes of this font engine however the proportional feature is ignored. Sorry.)<br><br>This font includes the computer-style upper case characters, and the smaller high-score characters in the lower-case set.<br><br>The lower case set may be the smallest possible legible font, occupying a miniscule 3x5 grid.<br><br>Also, Robotron is the best game ever made.<br><br><a href="http://nfgworld.com/?p=1419">Sprites</a> and <a href="http://nfgworld.com/?p=1369">Robotron board repair, tech info and etc.</a>`
    },
    rtl: {
        index: 121,
        name: 'R Type LEO',
        company: 'Irem',
        styles: 8,
        notes: 'This is a lovely, colourful and very readable font.'
    },
    rtype: {
        index: 122,
        name: 'R Type',
        company: 'Irem',
        styles: 8,
        notes: `The problem with the R-Type font is that, outside of the game, the colours don't pulse. Without that sexy liquid colour action it's just an awkward thin font. In action, though, it makes the classic game even classic-er.<br><br><center><img src="${rtype}"></center>`
    },
    rumba: {
        index: 123,
        name: 'Rumba Lumber',
        company: 'Taito',
        styles: 2,
        notes: ''
    },
    sabo: {
        index: 124,
        name: 'Saboten Bombers',
        company: 'NMK',
        styles: 1,
        notes: ''
    },
    sala2: {
        index: 125,
        name: 'Salamander 2',
        company: 'Konami',
        styles: 7,
        notes: "Konami does love their italicized fonts, and this font's proof that their love pays off. It's a fantastic looking font that stands above most arcade fonts as a clear and uncompromising typeface."
    },
    samsho2: {
        index: 126,
        name: 'Samurai Shodown 2',
        company: 'SNK',
        styles: 9,
        notes: "This isn't really an appropriate font for a samurai fighting game, but it looks good and is easy to read."
    },
    samsho3: {
        index: 127,
        name: 'Samurai Shodown 3',
        company: 'SNK',
        styles: 10,
        notes: 'SNK worked wonders on this font. A mere 8x8 pixels is all it takes to evoke real samurai style!'
    },
    sar: {
        index: 128,
        name: 'Search and Rescue',
        company: 'SNK',
        styles: 1,
        notes: ''
    },
    sboom: {
        index: 129,
        name: 'Sonic Boom',
        company: 'Sega',
        styles: 5,
        notes: ''
    },
    sdi: {
        index: 130,
        name: 'SDI',
        company: 'Sega',
        styles: 7,
        notes: "This one's just weird. What does a western-looking font have to do with SDI's space battles? How the hell does that make sense, Sega? HOW?"
    },
    sexy: {
        index: 131,
        name: 'Parodius',
        company: 'Konami',
        styles: 8,
        notes: ''
    },
    sf2: {
        index: 132,
        name: 'Street Fighter II',
        company: 'Capcom',
        styles: 9,
        notes: "Just looking at this font gives me a solid Capcom vibe. There's something about the colours and the way they've drawn the letters that just screams <i>Capcom was here!</i>"
    },
    sf3: {
        index: 133,
        name: 'Street Fighter III',
        company: 'Capcom',
        styles: 2,
        notes: "Capcom didn't bother to do nice pixels for the first two Street Fighter III games. The fonts are unattractive, poorly down-scaled from some larger source.<br><br>They fixed this for 3rd Strike."
    },
    sf33: {
        index: 134,
        name: 'Street Fighter III 3rd Strike',
        company: 'Capcom',
        styles: 1,
        notes: 'It seems like Capcom had some extra time, money or staff, when they were making 3rd Strike. This font is a lovely, hand crafted return to form, a real improvement over the first two SF III games.'
    },
    sfz3: {
        index: 135,
        name: 'Street Fighter Zero 3',
        company: 'Capcom',
        styles: 8,
        notes: "Capcom didn't deviate much from the tried and true Namco font, but with this one they modernized it and made it like 42% <i>awesomer</i>."
    },
    shda: {
        index: 136,
        name: 'ShadowDancer',
        company: 'Sega',
        styles: 8,
        notes: `This is a sequel to Sega's earlier Shinobi. Interestingly the new hardware didn't result in a better font: Shadow Dancer's letters are thicker, have a gradient and a 3D look, but the details are compressed and the result, especially at small sizes, seems smudged. Shinobi's font seems to be a little less attractive, but is much more readable for it. When enlarged however the reverse is true: <img src="${shda}"> plain pixels are harsh to the eyes.`
    },
    shinobi: {
        index: 137,
        name: 'Shinobi',
        company: 'Sega',
        styles: 4,
        notes: `This font is almost too fancy for a single colour, the curves seem to demand some anti-aliasing, or at least a drop-shadow. Sega did upgrade the font when they released <img src="${shinobi}">, but for some applications this plain-coloured font is more readable, especially at smaller resolutions.`
    },
    simp: {
        index: 138,
        name: 'The Simpsons',
        company: 'Konami',
        styles: 5,
        notes: 'A very solid cartoon-like font. You can download a very excellent (and more complete) OpenType font from <a href="http://www.gebsite.org/font/yellows.html">Gebsite</a>.'
    },
    skyfox: {
        index: 139,
        name: 'Sky Fox',
        company: 'Nichibutsu',
        styles: 2,
        notes: "I can't quite get my head around this incredibly ambitious and totally unsuitable font. What does a weird pseudo-3D <i>shooting bikini-babes on snakes in space</i> game need with a scripted font this ornate!? It's utterly bizarre, but totally fascinating for its uncaring audaciousness.<br><br>Insanity!<br><br>The lower case font is a secondary serif face but no one cares."
    },
    skys: {
        index: 140,
        name: 'Sky Soldier',
        company: 'SNK',
        styles: 6,
        notes: "I really like this old shooter - not because it's particularly good, but 'cause I played it a lot when I was a kid. The font, though, is cool. It's thin, and only six pixels tall, including the dropshadow (so the font itself is only 5). And the zero has a dot inside - how awesome is that?<br><br>This same font is used in Sky Adventure, released a year later."
    },
    smar: {
        index: 141,
        name: 'Super Mario Bros 3',
        company: 'Nintendo',
        styles: 4,
        notes: ''
    },
    snow: {
        index: 142,
        name: 'Snow Bros',
        company: 'Toaplan',
        styles: 7,
        notes: ''
    },
    sold: {
        index: 143,
        name: 'Soldam',
        company: 'Jaleco',
        styles: 8,
        notes: 'Two things warrant the inclusion of this font:<br>1. It has an interesting gradient<br>2. It is just too cute for words<br><br>Too bad the game it came from is rubbish.'
    },
    solo: {
        index: 144,
        name: 'Solomons Key',
        company: 'Tecmo',
        styles: 6,
        notes: 'This is a beautiful font that gives no reason to criticize. The capitals are uniform in appearance, and their reduced height means lower case letters with descenders (p, q, g etc) look awesome as well, lacking the compromises many fonts face.<br><br>This is one of the best looking 8x8 fonts.'
    },
    spdr: {
        index: 145,
        name: 'Speed Rumbler',
        company: 'Capcom',
        styles: 9,
        notes: "This is a fairly unusual combination: an italic thick font. One or the other isn't too uncommon, but in only 8 pixels you've gotta be confident to do both. To Capcom's credit, it totally works for me."
    },
    spin95: {
        index: 146,
        name: 'Space Invaders 95',
        company: 'Taito',
        styles: 7,
        notes: "This is a pretty font. I can't place it, but it's very similar to something else, with a lovely gradient."
    },
    ssf2: {
        index: 147,
        name: 'Super Street Fighter 2',
        company: 'Capcom',
        styles: 9,
        notes: 'As an early CPS2 game, Super Street Fighter 2 had a font that was very much a precursor to later games like Alien vs Predator and Varth. Note the lack of anti-aliasing in the zig-zag letters like V and W, and also the simpler vertical gradient, compared to the combination gradient used in later games.'
    },
    strider: {
        index: 148,
        name: 'Strider Hiryu',
        company: 'Capcom',
        styles: 11,
        notes: "This is a super clean font without any lower case to compromise the aesthetic. It has a sneaky bit of anti-aliasing on some letters with curves, like C, G and Q, but also V. Overall it's gorgeous and clean.<br><br>It seems like this was an ancestor to the 'standard' Capcom font used in many games, like Armoured Warriors."
    },
    supgt: {
        index: 149,
        name: 'Super GT 24',
        company: 'Jaleco',
        styles: 4,
        notes: "This isn't a really remarkable font design, but I like the shadow shading which gives it a very cool embossed effect. It looks better when the letters are on a background of a similar colour: blue on blue, red on red etc."
    },
    takeda: {
        index: 150,
        name: 'Takeda Shingen',
        company: 'Jaleco',
        styles: 2,
        notes: "This is a very interesting font, not for the letter forms themselves, but the really excellent shadow. It features a horizontal gradient which is very unusual, but is also two lines deep at the top of the letters, and one line at the bottom.<br><br>It seems to be a reasonably successful attempt to make the letters appear 3D, but why they'd do this for a historic fighting game like this I cannot imagine.<br><br>It also features a set of <i>italic numbers</i> which is very weird. Since there's no lower case set I put the numbers there for the second colour variant, along with some of the other data in the game. Enjoy. =)"
    },
    tataka: {
        index: 151,
        name: 'Tatakae Big Fighter',
        company: 'Nichibutsu',
        styles: 7,
        notes: 'This is a simple and competent little font, with a weird, coarse gradient that always uses white for the brightest parts, no matter the rest of the colours used.'
    },
    terra: {
        index: 152,
        name: 'Terra Force',
        company: 'Nichibutsu',
        styles: 8,
        notes: "Now this is a fantastic font. Excellent choice of colours, and a totally unique style. This is fairly unusual for Nichibutsu, a company that was sadly never more than an also-ran, despite some games that - with the hindsight of history - weren't that bad."
    },
    tetris: {
        index: 153,
        name: 'Tetris',
        company: 'Sega',
        styles: 6,
        notes: "This fat round font is not really different from a lot of similar ones, but it's Tetris, right? Sega Tetris, that is - the Atari version had the same ol' Classic font we've come to know and love. Only the first two gradients here are legit - the rest I added myself."
    },
    thdr: {
        index: 154,
        name: 'Thunder Dragon',
        company: 'NMK',
        styles: 4,
        notes: "This is a rare instance where I figured I knew better than the original designers. The numbers in this font used to be out of place and ugly, with a two-colour fill that didn't match the alphabet. So I 'fixed' it. Forgive me, I like it purty more than I like it authentic."
    },
    times: {
        index: 155,
        name: 'Time Soldiers',
        company: 'ADK',
        styles: 10,
        notes: 'This clean, simple font is a fine member of the ADK/SNK family. Its offspring, the Sky Soldiers font, shows many of the same attributes, but is smaller, tighter, and more modern.'
    },
    tmek: {
        index: 156,
        name: 'Mek',
        company: 'Atari',
        styles: 2,
        notes: "This is Atari's T-Mek. It's an interesting thin font that fills the grid with most characters, and has no decoration.<br><br>Bizarrely, the lower case letters have a higher base than the upper case, making the result very difficult to read.<br><br>That lower case x tho."
    },
    tp84: {
        index: 157,
        name: 'Time Pilot 84',
        company: 'Konami',
        styles: 10,
        notes: `This is one of the few italic fonts used in arcades. It was a fairly daring decision by Konami, considering the single colour used... Single colour fonts don't generally allow for eye-pleasing diagonal lines, but this font really works for me.<br><br><img src="${tp84}"> is also a bloody great game, BTW.`
    },
    trs: {
        index: 158,
        name: 'Top Ranking Stars',
        company: 'Taito',
        styles: 8,
        notes: "This is a very unusual font for several reasons. It has a complete outline, which is an unusual extravagance in an 8-pixel space. It's a thin font, which is uncommon, and - perhaps most curiously - it's from a boxing game. It doesn't really seem to suit the genre, does it?<br><br>It's very clearly an evolution based in Taito's other game, Night Striker, released four years earlier and a much more suitable game for this sort of style."
    },
    trx: {
        index: 159,
        name: 'Truxton',
        company: 'Toaplan',
        styles: 22,
        notes: "There are some great colours in here, and on-screen these Toaplan fonts look just <i>awesome</i>, but looking at them here, they're not especially remarkable.<br><br>Still, I love Toaplan fonts. =)"
    },
    twin2: {
        index: 160,
        name: 'Twin Cobra II',
        company: 'Taito',
        styles: 6,
        notes: ''
    },
    twinB: {
        index: 161,
        name: 'Twinbee',
        company: 'Konami',
        styles: 9,
        notes: ''
    },
    twin: {
        index: 162,
        name: 'Twin Cobra',
        company: 'Toaplan',
        styles: 9,
        notes: "Never mind that it's a Toaplan font (which automatically makes it great), the Twin Cobra font is very unusual with its two-tone shadow. Sometimes this results in a very convincing 3D effect, but most of the time it's just kind of cool."
    },
    twq: {
        index: 163,
        name: 'Twin Qix',
        company: 'Taito',
        styles: 6,
        notes: "This is a huge departure for Taito. Most of the time they stick to the Classic font, but for this prototype version of Qix, they really kind of let their hair down. It's not really a lovely font, but you have admire its audacity, eh?"
    },
    typh: {
        index: 164,
        name: 'Typhoon',
        company: 'Konami',
        styles: 7,
        notes: "There's nothing really remarkable about this font, it's a lot like several others, but it has very nice colours, don't you think?"
    },
    unsq: {
        index: 165,
        name: 'UN Squadron',
        company: 'Capcom',
        styles: 7,
        notes: "What a great looking stencil font, with its colourful gradient and drop-shadow. Capcom didn't get it wrong very often, and this is no exception. Very readable and in very good taste."
    },
    vict: {
        index: 166,
        name: 'Victory Road',
        company: 'SNK',
        styles: 1,
        notes: 'This is a fabulous looking font which is a bit strange: it has lots of colours, but a very limited character set with many missing symbols (though a complete alphabet and numbers) and it seems somehow out of place in a space-based Ikari Warriors game.<br><br>Also, sadly, it has only one colour.'
    },
    waku: {
        index: 167,
        name: 'Waku Waku 7',
        company: 'Sunsoft',
        styles: 8,
        notes: "I can't shake the feeling I've seen this one before. A sort of vaguely stylish futuristic font that tries to be different and succeeds only at being unremarkable. Sort of like Sunsoft, the publisher that made it.<br><br>What's with the digit 9?"
    },
    wboy: {
        index: 168,
        name: 'Wonder Boy',
        company: 'Sega',
        styles: 9,
        notes: "Wonder Boy's capital letters are vertically condensed on top, and comfortably chunky on the bottom.<br><br>The lower case letters have a uniform height and look equally good - mostly. Maintaining the same bottom-heavy style compromises some of the letters, like p, q and g, but also the letter f which looks shrivelled on top."
    },
    wfang: {
        index: 169,
        name: 'Wolf Fang',
        company: 'Taito',
        styles: 3,
        notes: `This is an unremarkable version of the standard Arcade font, but for two things that merit its inclusion:<br><br>1. The gradients are really well chosen. All three variants work very well.<br>2. There was a pallete error in the red variant that made it look like it had a sassy missing pixel. Sadly it made most of the characters look broken or incomplete, so I fixed it. But it was briefly cool.<br><br><center><img src="${wfang}"/></center>`
    },
    wildp: {
        index: 170,
        name: 'Wild Pilot',
        company: 'Jaleco',
        styles: 4,
        notes: "This is a really good looking thin font, with good colours.<br><br>What I don't understand is why D is so special, with a notch that no other letter has.<br><br>Interestingly, the &lt; and &gt; symbols have been replaced with ON and OFF. That's unusual."
    },
    will: {
        index: 171,
        name: 'Willow',
        company: 'Capcom',
        styles: 12,
        notes: ''
    },
    xain: {
        index: 172,
        name: 'Solar Warrior',
        company: 'Technos',
        styles: 4,
        notes: "It's an unremarkable game with a very strange name - Xain'd Sleena - sensibly renamed Solar Warrior in the West. The font is just about as memorable - it looks pretty good in-game but is basically forgettable."
    },
    xexex: {
        index: 173,
        name: 'Xexex',
        company: 'Konami',
        styles: 11,
        notes: "This font should bring a smile to every Konami fan's face. It's nearly the same as Gradius, a thin font with only three colours that manages to be completely clear and look awesome at the same time. Except the yellow one, which seems to be really thick and awkward."
    },
    zwing: {
        index: 174,
        name: 'Zero Wing',
        company: 'Toaplan',
        styles: 16,
        notes: "Thanks to Dhillon for ripping and sending in this font from Toaplan's Zero Wing!"
    },
};

export default fonts;
