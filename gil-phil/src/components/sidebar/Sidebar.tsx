import React from "react";
import { Clue, CluePair, SuggestedAnswersPair } from "../../classes/clues";
import { DirectionType } from "../../classes/direction";
import { KeyInput } from "../../classes/keyinput";
import { SidebarPanel } from "./SidebarPanel";

type SidebarProps = 
{
    cluePair: CluePair;
    setClue: (clue: Clue, newText: string) => void;
    getWordAtClue: (clue: Clue) => string;
    suggestedAnswersPair: SuggestedAnswersPair;
    fillGridFromSelectedAnswer: (answer: string) => void;
}

export class Sidebar extends React.Component<SidebarProps>
{
    render() 
    {
        const { 
            cluePair,
            getWordAtClue,
            setClue,
            suggestedAnswersPair,
            fillGridFromSelectedAnswer
        } = this.props;

        return (
            <div id="sidebar">
                <SidebarPanel 
                    direction={DirectionType.ACROSS} 
                    currentClue={cluePair.acrossClue}
                    getWordAtClue={getWordAtClue}
                    setClue={setClue}
                    fillGridFromSelectedAnswer={fillGridFromSelectedAnswer}
                    suggestedAnswers={suggestedAnswersPair.acrossAnswers}
                    handleEnter={this.suppressEnterKey} />
                <SidebarPanel 
                    direction={DirectionType.ACROSS} 
                    currentClue={cluePair.downClue}
                    getWordAtClue={getWordAtClue}
                    setClue={setClue}
                    fillGridFromSelectedAnswer={fillGridFromSelectedAnswer}
                    suggestedAnswers={suggestedAnswersPair.downAnswers}
                    handleEnter={this.suppressEnterKey} />
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