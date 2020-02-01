import React from "react";
import { SidebarHeading } from "./SidebarHeading";
import { Clue } from "../../classes/clues";
import { DirectionType } from "../../classes/direction";
import { SuggestedAnswersPanel } from "./SuggestedAnswersPanel";

type SidebarPanelProps = 
{
    direction: DirectionType;
    currentClue: Clue
    setClue: (clue: Clue, newTextContent: string) => void;
    getWordAtClue: (clue: Clue) => string;
    suggestedAnswers: string[];
    fillGridFromSelectedAnswer: (answer: string) => void;
    handleEnter: (event: React.KeyboardEvent) => void;
}

export class SidebarPanel extends React.Component<SidebarPanelProps>
{
    render() 
    {
        const {
            currentClue, 
            setClue,
            getWordAtClue,
            direction,
            suggestedAnswers,
            handleEnter,
            fillGridFromSelectedAnswer,
        } = this.props;

        return (
            <div className="sidebar-panel">
                <SidebarHeading 
                    currentClue={currentClue}
                    direction={direction}
                    setClue={setClue} 
                    handleEnter={handleEnter} 
                    getWordAtClue={getWordAtClue} />
                <SuggestedAnswersPanel
                    direction={direction}
                    suggestedAnswers={suggestedAnswers}
                    fillGridFromSelectedAnswer={fillGridFromSelectedAnswer} />
            </div>           
        )
    }
}