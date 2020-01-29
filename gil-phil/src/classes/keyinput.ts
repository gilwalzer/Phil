const KEYBOARD = 
{
    "A": 65, "B": 66, "C": 67, "D": 68, "E": 69, "F": 70, "G": 71, "H": 72, "I": 73, "J": 74, "K": 75, "L": 76, "M": 77, 
    "N": 78, "O": 79, "P": 80, "Q": 81, "R": 82, "S": 83, "T": 84, "U": 85, "V": 86, "W": 87, "X": 88, "Y": 89, "Z": 90,
    "a": 97, "b": 98, "c": 99, "d": 100, "e": 101, "f": 102, "g": 103, "h": 104, "i": 105, "j": 106, "k": 107, "l": 108, "m": 109, 
    "n": 110, "o": 111, "p": 112, "q": 113, "r": 114, "s": 115, "t": 116, "u": 117, "v": 118, "w": 119, "x": 120, "y": 121, "z": 122,
    
    "black":  190, ".": 190,
    "backspace": 8,
    "delete": 46,
    "enter":  13,
    "space":  32,
    "left":   37,
    "up":     38,
    "right":  39,
    "down":   40
  };

export const BLACK = ".";
export const EMPTY = " ";

export class KeyInput 
{
  keyCode: number;

  constructor(keyCode: number)
  {
    this.keyCode = keyCode;
  }

  isLowercaseLetter()
  {
    return this.keyCode >= KEYBOARD.a && this.keyCode <= KEYBOARD.z;
  }

  isUppercaseLetter()
  {
    return this.keyCode >= KEYBOARD.A && this.keyCode <= KEYBOARD.Z;
  }

  static getUpperFromLower(keyCode: number)
  {
    if (keyCode < KEYBOARD.a || keyCode > KEYBOARD.z) 
    {
      return keyCode;
    }

    return keyCode + KEYBOARD.A - KEYBOARD.a;
  }

  getFillValue(): string
  {
    if (this.isSpace() || this.isDelete())
    {
      return EMPTY;
    }
    else if (this.isUppercaseLetter()) 
    {
      return String.fromCharCode(this.keyCode);
    }
    else if (this.isBlack())
    {
      return BLACK;
    }
    else if (this.isLowercaseLetter())
    {
      return String.fromCharCode(KeyInput.getUpperFromLower(this.keyCode));
    }
    else 
    {
      // TODO log exception
      return EMPTY;
    }
  }

  isArrowKey()
  {
    return this.keyCode === KEYBOARD.left
            || this.keyCode === KEYBOARD.right
            || this.keyCode === KEYBOARD.up
            || this.keyCode === KEYBOARD.down;
  }

  isUp = () => this.keyCode === KEYBOARD.up;
  isDown = () => this.keyCode === KEYBOARD.down;
  isLeft = () => this.keyCode === KEYBOARD.left;
  isRight = () => this.keyCode === KEYBOARD.right;

  isEnter = () => this.keyCode === KEYBOARD.enter;
  isBackspace = () => this.keyCode === KEYBOARD.backspace;
  isDelete = () => this.keyCode === KEYBOARD.delete;
  isSpace = () => this.keyCode === KEYBOARD.space;
  isBlack = () => this.keyCode === KEYBOARD.black;
}