import React from "react";
import { Title } from "./Title";
import { Author } from "./Author";
import { KeyInput } from "../../classes/keyinput";

type HeaderProps = 
{
    title: string;
    updateTitle: Function;
    author: string;
    updateAuthor: Function;
}

export class Header extends React.Component<HeaderProps>
{
    render() 
    {
        return (
            <div id="header">
                <h1>
                    <Title
                        title={this.props.title}
                        updateTitle={this.props.updateTitle}
                        suppressEnterKey={this.suppressEnterKey} />
                    &nbsp;by&nbsp;
                    <Author 
                        author={this.props.author}
                        updateAuthor={this.props.updateAuthor}
                        suppressEnterKey={this.suppressEnterKey} />
                </h1>
            </div>
        )
    }

    suppressEnterKey(event: React.KeyboardEvent)
    {
        const keyInput = new KeyInput(event.keyCode);
        if (keyInput.isEnter())
        {
            event.preventDefault();
            console.log("Enter key behavior suppressed.");
        }
    }
}