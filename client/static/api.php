<?

                // This is the PHP script of DOOM
                // It prolly won't work.

		// Written by NFG ( http://nfgworld.com ) in February 2009.

                // While I take credit for making the thing assemble fonts
                // Which I'm mad proud of, 'cause I don't code...
                // Many kudos to Twyst for helping with some tricky stuff:
		//		PHPBB URLs
		//		maintenance-friendly filenames.
		//		colour shifting


/* ------------------------------------------------ */
/*                      License                     */
/* ------------------------------------------------ */

/*		This script is released under a Creative Commons Zero license.
		This means it's free of just about all encumbrances.
		Do what you want with it.
		A tip of the hat for ol' NFG would be nice, but not required.  =)

		http://creativecommons.org/licenses/zero/1.0/

/* ------------------------------------------------ */
/*                  Version History                 */
/* ------------------------------------------------ */
/*
		1.0 - First Public Release
		1.1 - Added Font List & Font Counter, fixed some bugs that only became apparent with the lister...
			  Includes word-balloon addition by Twystneko.
		1.2 - Added random font option.  This required some internal changes, but no functional differences.
		1.3 - Added default string values in cases where X, Y or Z values are not set.
			- Added handler for LARGE FONTS.  Fonts that are not 8x8 should go in a directory    largefonts/

/* ------------------------------------------------ */
/*              Instructional Block                 */
/* ------------------------------------------------ */

/*  HOW TO USE THIS SCRIPT
        1. Requirements
                PHP
                GD graphics library (almost always included with PHP)
                A website (duh)
                This script (also duh)
                Some fonts (slightly less, but still duh)

        2. Usage
                . First, decide if you'll use PHPBB-friendly parameters or not.
		  I suggest leaving this on by default, and just get used to the way it works.
                . The output of this script is a .PNG image.
                  To link to it, or use it in a webpage, just put the script URL and
                  parameters between some [img] or <img> tags.  It's not tricky.

           Examples
                . Webpage: <img src="http://server/path-to-script/arcade.php/y-font/x-phrase to encode" />
                . Forum: [img]http://server/path-to-script/arcade.php/y-font/x-phrase to encode[/img]

        3. Things to watch for
                . Some forums don't like spaces in the names.  Use the HTML-friendly space:   %20    instead.  so,   /x-phrase%20to%20encode
                . Many parameters are optional.  The minimum is font (y) and phrase (x).

        4. Parameters
                x - words or phrase to create image with
                y - font to use.  Use r for random (usage:  /y-r/ )
                z - colour or variation.  A font file may contain several fonts stacked vertically.
					This chooses how many rows down an image file to start. (starts at zero!)
					use r for random (usage: /z-r/ )
                h - height of character (default is 8 if unset)
                w - width of character (default is 8 if unset)
					Note that all characters must be the same height and width.
					There is no facility for variable width fonts.
                dbl - doublesize or not.  If un-set, defaults to 1x, but you can set dbl to 2-6.
					The script will reduce all values larger than six to six.
					4x example:  /dbl-4
                cs - colour shift, to adjust the hue of the font.
					Format is red.green.blue.
					Example:  /cs-0.128.64
				list - list all fonts.  Ignores the x-phrase and y-fontchoice, but obeys all other commands.  (usage:  /list-1/ )
				count - changes x-phrase into the number of available fonts.  Obeys all other commands.   (usage: /count-1/ )
				b - Bubble position. This activates the speech bubble mode, and is either "u" (up) or "d" (down).
				bp - a percentage of where it is along the bubble.

	5. Filenames
		Your filenames MUST be in this format:  shortcut-whateveryouwant.png
                where:  	shortcut 		is the Y/Fontchoice value used in the URL.
		where:  	whateveryouwant 	is the descriptive name of the font.
                example:  	fz-FantasyZone.png   	the Y/URL code for this font is fz.
                example:  	cotn-Cotton.png  	the Y/URL code for this one is cotn.
                usage:  	arcade.php?y=cotn&x=This is the Cotton font!

*/

/* ------------------------------------------------ */
/*              Configuration Block                 */
/*         Edit these settings as desired           */
/* ------------------------------------------------ */

                // NOTE: Config options: 1 = YES, 0 = NO

                // Many forums, including the popular phpBB, won't allow images with ?, = or & in the path.
                // Do you want standard URLs    arcade.php?param=value&param2=value2
                // Or PHPbb-friendly URLs?              arcade.php/param-value/param2-value2/.png
$phpbbfriendly = 1;

                // Cache previously-created images?
		// Note that on a Windows system, there's no filename difference between upper and lower case, so
		// cached phrases will no refresh if you change the capitalization later.
		// For example, Windows thinks phrase.png is the same as Phrase.png and PHRASE.png and PhRaSe.png
$cacheornot = 1;

                // Directory to store cached images:
                // Should prolly be something like   ./cache/  for most servers.
				// Be sure to create this directory!
				// And make it writable!!
$filepath = './cache/';

                // Set the directory where you store the source fontfiles.  Should be ./fonts/ for most servers.
				// If you have any fonts larger than 8x8 you should put them in a different directory.
				//		(sadly this is more for my benefit than yours)
$dir = './images/fonts/';
$bigdir = './images/fonts/large/';

				// where the components for the speech bubbles are
$bubblepath = "./images/bubble/";
$bubbletheme = 'l'; // 'l' for light or 'd' for dark

                // I suspect you'll want to stick to 8x8 characters, but if you get something bigger, specify the size here.
                // Note: this can be overridden later with the H and V parameters.  This just sets the default.
                // Set default source character width in pixels
$charwidth = 8;
                // Set default source character height in pixels
$charheight = 8;

                // Character offset: It skips the first 32 ASCII chars, 'cause they're all control-characters that you'll never use.
                // You should never need to change this.
$charoffset = 32;

				// Set the maximum phrase length (default 100 chars:
$stringlimit = 100;

 				// Allow the creation of a long list of available fonts?
				// When doing a font list, the spacing between fonts is 1 x fontsize, so 3x font = 3px gap.
$allowlist = 1;

$doublesize = '';

/* ------------------------------------------------ */
/*    Set up default values to keep things from     */
/*     from breaking when no values are in URL      */
/* ------------------------------------------------ */

$fontchoice = "taitoa";
$randomfontcolour = FALSE;

/* ------------------------------------------------ */
/*    You shouldn't need to muck about past here    */
/*           Commented for your enjoy!              */
/*                                                  */
/*     First, get the vars from the URL request     */
/* ------------------------------------------------ */

$stringhash = '';   // Just gettin' it out there.  <_<

if ($phpbbfriendly == 1) {
	// This is the PHPbb-friendly version
	$scriptname = $_SERVER['SCRIPT_NAME']."/";
	$filename = str_replace($scriptname, '', $_SERVER['REQUEST_URI']);
	$filename = urldecode($filename);
	$bits = explode("/",$filename);
	$out = array();
	foreach($bits as $bite) {
		$temp = explode("-",$bite, 2);
		@$out[$temp[0]] = $temp[1];
	}
	
	$string = (isset($out["x"])) ? $out["x"] : "NULL";

    if (isset($out["bt"])) {
        $bubbletheme = ($out["bt"] === 'd') ? 'd' : 'l';
    }

	// Get the desired font file:
	if (isset($out["y"])) {
		if ($out["y"] == "r") {
			$randomfont = TRUE;
		} else {
			$fontchoice = $out["y"];
		}
	} else {
		$fontchoice = "taitoa";
	}
	
	// Row offset (font colour in multiple-colour fonts)
	if (isset($out["z"])) {
		if ($out["z"] == "r") {
			$randomfontcolour = TRUE;
		} else {
			$randomfontcolour = FALSE;
			$charcolor = $out["z"];
		}
	} else {
		$charcolor = "0";
	}

	// Check dbl: if set, it becomes the multiplier (up to 6x)
	if (isset($out["dbl"])) {
		$doublesize = $out["dbl"];
		// There's no point setting the multiplier to ONE, so if set, change it to TWO
		if ( $doublesize <= 1 ) {
			$doublesize = 2;
		}
	}

	// Check for height/width overrides.
	//		If H or V parameters exist, change the font size.
	//		Also, change font directory to $bigdir (defined above)
	if (isset($out["w"])) {
			$charwidth = $out["w"];
			$dir = $bigdir;
	}
	if (isset($out["h"])) {
			$charheight = $out["h"];
			$dir = $bigdir;
	}
	if (isset($out["cs"])) {
			$colorize = explode(".",$out["cs"]);
	}
	if (isset($out["b"])) {
		$b = $out['b'];
	}
	if (isset($out["bp"])) {
		$bp = $out['bp'];
	} else {
		$bp = 0;
	}
	if (isset($out["list"])) {
			$listfonts = true;
	} else {
			$listfonts = false;
	}
	if (isset($out["count"])) {
			$countfonts = true;
	} else {
			$countfonts = false;
	}

} else {
	// This is the normal version, using standard URL parameters
	// String to create:

	$string = (isset($_GET["x"])) ? $_GET["x"] : "NULL";

	// Get the desired font file:
	if (isset($_GET["y"])) {
		if ($_GET["y"] == "r") {
			$randomfont = TRUE;
		} else {
			$fontchoice = $_GET["y"];
		}
	} else {
		$fontchoice = "taitoa";
	}

	// Vertical offset (font colour in multiple-colour fonts)
	if (isset($_GET["z"])) {
		if ($_GET["z"] == "r") {
			$randomfontcolour = TRUE;
		} else {
			$randomfontcolour = FALSE;
			$charcolor = $out["z"];
		}
	} else {
		$charcolor = "1";
	}

    if (isset($_GET["bt"])) {
        $bubbletheme = ($_GET["bt"] === 'd') ? 'd' : 'l';
    }

	// Check dbl: if set, it becomes the multiplier (up to 6x)
	if (isset($_GET["dbl"])) {
		$doublesize = $_GET["dbl"];
		// There's no point setting the multiplier to ONE, so if set, change it to TWO
		if ( $doublesize <= 1 ) {
			$doublesize = 2;
		}
	}

	// Check for height/width overrides.  If H or V parameters exist, change the font size.
	if (isset($_GET["w"])) {
		$charwidth = $_GET["w"];
		$dir = $bigdir;
	}

	if (isset($_GET["h"])) {
		$charheight = $_GET["h"];
		$dir = $bigdir;
	}

	if (isset($_GET["cs"])) $colorize = explode(".",$_GET["cs"]);

    if (isset($_GET["b"])) $b = $_GET['b'];
	
	$bp = isset($_GET["bp"]) ? true : 0;
	
	$listfonts = (isset($_GET["list"])) ? true : false;
	
	$countfonts = (isset($_GET["count"])) ? true : false;
}

if (isset($b) && $b == "none") unset($b);


// We don't need any fonts larger than 6x, do we?
if ($doublesize > 6) $doublesize = 6;

/* ------------------------------------------------ */
/*         Sanitize the string, for safety!         */
/* ------------------------------------------------ */

// First, check for chars outside ASCII range 32-126 (20-7E in hex).
$string = preg_replace('/[^(\x20-\x7E)]*/','', $string);
// Limit string to the number of chars specified in config:
$string = substr($string, 0, $stringlimit);

// add this right after string sanitizing
if (empty($string)) { $string = "Arcade Font Engine"; };


/* ------------------------------------------------ */
/*   Now, generate a filename and check the cache   */
/* ------------------------------------------------ */


if ((!$listfonts) or (!$countfonts)) {
	$stringhash = hash('xxh3', urlencode($string));
	$filename = $fontchoice."-".$charcolor."-".$doublesize."-".(isset($out["b"]) ? $b.$bp.$bubbletheme."-" : "").$stringhash.".png";
	$current = $filepath.$filename;
	// Check the cache.  If the file exists, spit it out and die:
	if (file_exists($current)) {
		$contentType = 'Content-type: image/png';
		header ($contentType);
		readfile($current);
		die;
	}
}
//}

/* ------------------------------------------------ */
/*     This is the new font Detect and Select!      */
/*   Look for a file which matches the $fontchoice  */
/* ------------------------------------------------ */

                // Thanks Twyst for this segment!

                // Basically opens the $dir specified in the config block
                // then loops through every file looking for one that matches the Y/Fontchoice value
				// New in 1.1 - remembers the number of fonts and the max font-name-length for the fontlist

$maxfontlength = "0";	// For counting the max chars in a font name (for calc'ing font list width)
$numfonts = "0";		// for counting the number of fonts

$imgdir = opendir($dir) or die('Tick was here.  Can\'t open IMG dir.');						// open the thumbnail location (imgdir = filesystem absolute)
  while (false !== ($currentfile = readdir($imgdir))) {					  // Do this loop for every file found.
                                                                  // So long as it's not a directory...
    if (!is_dir($currentfile)) {
      $temp = explode(".",$currentfile,2);
		$fontnames[$numfonts] = $currentfile;			                // An array of filenames, for later abuse.

		if ($listfonts) { $fontfiles[$numfonts] = $dir.$currentfile; }
		if($fontchoice == $temp[0]) {
			$fontfile = $dir.$currentfile;			// If the current file prefix matches the $fontchoice, specify the SOURCE image
		}
		$numfonts++;							// increment the font count.  Also used for incrementing $fontnames array.
    }
  }


closedir($imgdir);
if ($listfonts) sort($fontfiles[$numfonts]);

/* ------------------------------------------------ */
/*             Special-case adjustments             */
/*        For LIST, COUNT and similar things        */
/* ------------------------------------------------ */

// Are we counting the fonts?  Change the user requested string/phrase to the number of fonts.
if ($countfonts) {
	$string = $numfonts;
}

// If we're doing $randomfonts, change the font filename to be a random one:
if (isset($randomfont)) {
	$fontarraychoice = rand(0,$numfonts);
	$fontfile = $dir.$fontnames[$fontarraychoice];
}

// Is the font colour random?  Check the z-depth and pick one.
if ($randomfontcolour) {
	$size = getimagesize($fontfile);
	$zcount = $size[1] / $charheight;
	$charcolor = rand(0,$zcount);
}

/* ------------------------------------------------ */
/*          This is the preparation section         */
/* ------------------------------------------------ */

//The new image width should equal the # of chars x the width of each.


$newimgwidth = $listfonts
	? ($charwidth * $maxfontlength)
	: ($charwidth * strlen($string));

//The new image height should equal the # of fonts x the height of each char of each.

$newimgheight = $listfonts
	? (($charheight * $numfonts) + ($numfonts * 2)) // charheight (8 px default) x number of fonts, plus 2px gap x number of fonts
	: $charheight;


/* ------------------------------------------------ */
/*         Start building the new PNG image         */
/* ------------------------------------------------ */


// Create the image (width, height)
$newimg = @imagecreatetruecolor($newimgwidth, $newimgheight) or die ('WE DEAD');

// Set up the transparent background:
imagealphablending($newimg, false);
$col = imagecolorallocatealpha($newimg, 44, 0, 0, 127);
imagefilledrectangle($newimg, 0, 0, $newimgwidth, $newimgheight, $col);

/* ------------------------------------------------ */
/*          Now the character cut/paste loop        */
/* ------------------------------------------------ */


		//  NEW for v1.1 - loops through the vertical to accomodate the list.

		// Begin vertical loop.  Number of fonts determines number of loops.
		// $fontnames is the array

				// If we're counting fonts, echo only the count value, replacing any user string in the URL

$vertloop = 0;						// set vertical loop counter to zero

sort($fontnames);
foreach ($fontnames as $currentfont) {
	if ($listfonts) {
		$fontbits = explode("-", $currentfont, 2);
		$string = substr($fontbits[1], 0, -4); // if this is a font list, the current string should be the font name
		$currentVpos = (($charheight + 2) * $vertloop);
		$srcimg = imagecreatefrompng($fontfiles[$vertloop]);
	} else {
		$srcimg = imagecreatefrompng($fontfile); //cChange to the current fontfile
		$currentVpos = 0;
	}
	// Set horizontal loop char-counter to zero
	$charcount = 0;
	// start loop, repeat for each character in the string
	foreach(str_split($string) as $char) {
		// returns ASCII number
		$ASCIIno = ord($char);
		// Set NEWIMG current cursor H position
		$currentHpos = ($charwidth * $charcount);
		// H-position for grabbing char from SRC image (width x ASCII number + offset)
		$srcimgcharpos = ($ASCIIno - $charoffset) * $charwidth;
		// copy the letter from font image to new image
		imagecopy($newimg, $srcimg, $currentHpos, $currentVpos, $srcimgcharpos, $charcolor * $charheight, $charwidth, $charheight);
		// move to next char in string
		$charcount++;
	}
	$vertloop++; // increment the vertical counter
}

imagesavealpha($newimg, true);

/* ------------------------------------------------ */
/*              Colour Shift If Desired             */
/* ------------------------------------------------ */

if (isset($colorize)) {
	imagefilter($newimg, IMG_FILTER_COLORIZE, $colorize[0], $colorize[1], $colorize[2]);
}

/* ------------------------------------------------ */
/*         Two save-routines: big and x size        */
/* ------------------------------------------------ */

$bubblethemepath = $bubblepath . $bubbletheme . '/';

if (isset($b)) {


	$dir = $b == "d"
		? "bot" // the pointer is down
		: "top";

	if($bp <= 40) {
		$s = "l";
	} elseif($bp >= 60) {
		$s = "r";
	} else {
		$s = "c";
	}
	$pname = $s."-".$dir.".png";
	$pt = imagecreatefrompng($bubblethemepath.$pname);
	// got the pointer.
	// now build step 1 - the background
	$bgt = imagecreatefrompng($bubblethemepath."bg.png");

	$width = imagesx($newimg);
	$height = imagesy($newimg);

	$step1 = imagecreatetruecolor($width+4, $height+8);
	imagesavealpha($step1,true);
	imagecopyresized($step1, $bgt, 0,0,0,0,$width+4, $height+8,imagesx($bgt),imagesy($bgt));
	imagecopy($step1,$newimg,2,4,0,0,$width,$height);
	$widthb = imagesx($step1);
	$heightb= $height+8;
	$step2 = imagecreatetruecolor($widthb +8, $heightb);
	imagesavealpha($step2,true);
	$bg = imagecolorallocatealpha($step2,255,255,255,127);
	imagefill($step2,0,0,$bg);
	imagecopy($step2,$step1,4,0,0,0,$widthb,$heightb);
	$lft = imagecreatefrompng($bubblethemepath.'l-end.png');
	$rgt = imagecreatefrompng($bubblethemepath.'r-end.png');
	imagecopy($step2,$lft,0,0,0,0,4,16);
	imagecopy($step2,$rgt,$widthb+4,0,0,0,4,16);


	$step3 = imagecreatetruecolor(imagesx($step2), imagesy($step2)+8);
	imagesavealpha($step3,true);
	$bg = imagecolorallocatealpha($step3,255,255,255,127);
	imagefill($step3,0,0,$bg);
	if($b == "u") {
		$voffset = 8;
		$poffset = 0;
	} else {
		$voffset = 0;
		$poffset = imagesy($step2) - 2;
	}

	$xpos = floor($width * ($bp/100)) + 4;
	imagecopy($step3,$step2,0,$voffset,0,0,imagesx($step2), imagesy($step2));
	imagecopy($step3,$pt,$xpos,$poffset,0,0,imagesx($pt),imagesy($pt));
	$newimg = $step3;

}

if ($doublesize > 1) {
	// Create NewNewImg
	$newimgwidth = imagesx($newimg);
	$newimgheight = imagesy($newimg);
	$newnewimg = imagecreatetruecolor($newimgwidth*$doublesize, $newimgheight*$doublesize);

	// Set up the transparent background:
	imagealphablending($newnewimg,false);
	$col=imagecolorallocatealpha($newnewimg,44,0,0,127);
	imagefilledrectangle($newnewimg,0,0,$newimgwidth*$doublesize,$charheight * $doublesize,$col);

	// Double the size from old image to new image:
	imagecopyresized($newnewimg, $newimg, 0, 0, 0, 0, $newimgwidth * $doublesize, $newimgheight * $doublesize, $newimgwidth, $newimgheight);

	// Output and free from memory:
	header('Content-Type: image/png');
	imagesavealpha($newnewimg, true);
	// If cache is set to yes, save the file:
	if ($cacheornot == 1) imagepng($newnewimg, $filepath.$filename);
	imagepng($newnewimg);
	imagedestroy($newimg);
	imagedestroy($newnewimg);
	imagedestroy($srcimg);
} else {
	// output and free from memory:
	header('Content-Type: image/png');
	imagepng($newimg);
	// if cache is set to yes, save the file
	if ($cacheornot == 1) imagepng($newimg, $filepath.$filename);
	imagedestroy($newimg);
	imagedestroy($srcimg);
};

?>
