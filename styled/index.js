const escape = '\u001b[';
const base = `${escape}0m`;

const Emoji = { 
	Rotfl: '🤣',
	RollingEyes: '🙄',
	Warning: '⚠',
	Poop: '💩',
	Shrug: '🤷',
	Thinking: '🤔',
	Upvote: '👍',
	Downvote: '👎',
	MicDrop: '😤',
	Angry: '😡',
	Smile: '🙂',
	UpsideDownSmile: '🙃',
	BigBrainTime: '🧠',
	Zombie: '🧟',
	ForFucksSake: '🤬',
	MindBlown: '🤯',
	Explosion: '💥',
	Bomb: '💣',
	FuckYeah: '🤘',
	TheFuck: '🤨',
	TheAbsoluteFuck: '🧐',
	FacePalm: '🤦',
	Eyes: '👀',
	Folder: '📂',
	File: '📄',
	GiveMeThat: '🚬',
	CheckSmall: '✓',
	CrossSmall: '𐄂',
	Check: '✅',
	Cross: '❌',
};
const Text = { Bold: 1, Light: 2, Italic: 3, Underline: 4, Flash: 5, Strikethrough: 9 }
const Foreground = { Black: 30, Red: 31, Green: 32, Yellow: 33, Blue: 34, Magenta: 35, LightBlue: 36, LightGrey: 37 }
const Background = { White: 7, Black: 40, Red: 41, Green: 42, Yellow: 43, Blue: 44, Magenta: 45, LightBlue: 46, LightGrey: 47 }

const validStyles = [...Object.values(Text), ...Object.values(Foreground), ...Object.values(Background)];
const validateStyles = (styles = []) => {
  if (styles instanceof Array === false) {
    console.error("styles must be an array");
    return false;
  }
  {
    for (const s of styles) {
      if (!validStyles.includes(parseInt(s))) {
        console.error('Invalid style');
        return false;
      }
    }
  }
  return true;
}

let currentStyle = null;
const resetStyles = () => (currentStyle = null);

const parseStyles = (styles = []) => {
  if (styles.length === 0) {
    return currentStyle || base;
  }
  return `${styles.join(';')}m`
}

const setStyles = (styles = []) => {
  if (!validateStyles(styles)) {
    return;
  }
  currentStyle = parseStyles(styles);
}


const resolveStyles = (styles = []) => {
  return styles.length === 0 ? currentStyle || parseStyles(styles) : parseStyles(styles);
}

const write = (line, styles = []) => {
  if (!validateStyles(styles)) {
    return;
  }
  const writeStyles = resolveStyles(styles);
  if (typeof line === 'string') {
    const str = `${escape}${writeStyles}${line}${base}`
    console.log(str);
  } else {
    console.log(line);
  }
}

const log = (line) => write(line);
const info = (line) => write(line, [Foreground.LightBlue, Text.Bold]);
const notice = (line) => write(line, [Foreground.Magenta, Text.Bold]);
const warn = (line) => write(line, [Foreground.Yellow, Text.Bold]);
const writeError = (line, quiet = false, styles) => {
  if (line instanceof Error) {
    if (quiet) {
			write(`${line.message}`, styles);
		} else {
			const lines = line.stack.split('\n');
	    write(`${lines[0]}`, styles);
	    for ( let i = 1; i < lines.length; i++) {
		    write(`  ${lines[i].trim().replace(/^at/, Emoji.File)}`);
	    }
	    write(`${lines[lines.length - 1].trim()}    `.replace(/./g, '-'), styles);
	  }
  }
  else {
    write(`${line}`, styles);
  }
}

const error = (line, quiet = false) => writeError(line, quiet, [Foreground.Red, Text.Bold]);
const critical = (line, quiet = false) => writeError(line, quiet, [Background.Red, Text.Bold]);
const debug = (line) => write(line, [Text.Light]);

module.exports = {
  Text, Foreground, Background, write, resetStyles, setStyles, critical, error, warn, info, notice, log, debug, Emoji,
}


/**
 * examples
 */
// import styled from './utils/styled';
// const { Foreground, Text, Background, setStyles, resetStyles } = styled


// styled.write("Hello", [Text.Bold, Foreground.Blue]);

// setStyles([Foreground.Green]);
// styled.write("hello") // prints in green
// styled.write("hello", [Background.Red]) // overrides set style, white text on red bg
// resetStyles();
// styled.write("hello") // prints in white
