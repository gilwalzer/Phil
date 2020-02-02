import React from "react";
import { Credits } from "./Credits";

export const Footer = () => (
    <div id="footer">
        <Shortcuts />
        <Credits />
    </div>
)

// TODO add undo support 
// <!-- <tr> <td>Undo</td> <td><kbd>Ctrl</kbd><kbd>Z</kbd></td> </tr> -->
      
const Shortcuts = () => 
(
    <div id="shortcuts" className="notification">
        <h3>Keyboard Shortcuts</h3>
            <table> 
                <tr><td>Switch direction</td> <td><kbd>Enter</kbd></td> </tr>
                <tr><td>Toggle black square</td> <td><kbd>.</kbd></td> </tr>
        </table>
    </div>
)