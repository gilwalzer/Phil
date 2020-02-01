import React, { RefObject } from "react";
import { Clue } from "../../classes/clues";
import { DirectionType, Direction } from "../../classes/direction";

type SidebarHeadingProps = 
{
    currentClue: Clue
    direction: DirectionType;
    setClue: (clue: Clue, newText: string) => void;
    handleEnter: (event: React.KeyboardEvent) => void;
    getWordAtClue: (clue: Clue) => string;
}

type SidebarHeadingState =
{
    currentWordAtClue: string;
}

export class SidebarHeading extends React.Component<SidebarHeadingProps, SidebarHeadingState>
{
    private clueTextRef: RefObject<HTMLSpanElement>;
    
    constructor(props: SidebarHeadingProps)
    {
        super(props);
        this.clueTextRef = React.createRef<HTMLSpanElement>();
    }

    render() 
    {
        const { currentClue, direction, handleEnter } = this.props;
        const directionName = new Direction(direction).toString();
        const { clueText, label } = currentClue
        const currentWord = this.props.getWordAtClue(currentClue);
        
        return (
            <div id={directionName + "-heading"} className="direction-heading">
                <div className="clue">
                    <span id={directionName + "-clue-number"} className="clue-number">{label}</span>
                    &nbsp;
                    <span 
                        ref={this.clueTextRef}
                        key={label}
                        id={directionName + "-clue-text"} 
                        className="editable" 
                        contentEditable="true" 
                        onKeyDown={(event) => handleEnter(event)} 
                        onBlur={(event) => this.handleFocusOut(event)}
                        dangerouslySetInnerHTML={ {__html: clueText} }></span>
                </div>
                <div 
                    id={directionName + "-word"} 
                    className="current-word">{currentWord}</div>
            </div>  
        )
    }

    handleFocusOut = (event: React.FocusEvent) => {
        console.log("focus out!")
        const { setClue, currentClue } = this.props;

        const currentNode = this.clueTextRef.current;
        if (currentNode != null && currentNode.textContent != null)
        {
            console.log(currentClue, currentNode.textContent)
            setClue(currentClue, currentNode.textContent);
        }
    }
}