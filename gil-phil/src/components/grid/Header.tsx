import { Component } from "react"

type HeaderProps = {
    title: string;
    author: string;
}

export class Header extends Component<HeaderProps>
{
    render() 
    {
        return (
            <div id="header">
        <h1><span id="puzzle-title" className="editable" contentEditable="true">Untitled</span>
         by <span id="puzzle-author" className="editable" contentEditable="true">Anonymous</span></h1>
        </div>
        )

    }
}
