import React, { RefObject, createRef } from "react";
import { DirectionType } from "../../classes/direction";

type SuggestedAnswersPanelProps = 
{
    direction: DirectionType;
    suggestedAnswers: string[];
    fillGridFromSelectedAnswer: (answer: string) => void;
}

export class SuggestedAnswersPanel extends React.Component<SuggestedAnswersPanelProps>
{
    private suggestedAnswersToRefs: Map<string, RefObject<HTMLLIElement>>;

    constructor(props: SuggestedAnswersPanelProps)
    {
        super(props);

        // we do this so we can always link back to an answer from every list item.
        this.suggestedAnswersToRefs = new Map();
    }

    render() 
    {
        const { direction, suggestedAnswers } = this.props;
        const directionName = direction.toString().toLowerCase();

        this.rebuildSuggestedAnswersToRefs(suggestedAnswers);

        const renderedListItems = [];
        for (var suggestedAnswer of suggestedAnswers)
        {
            const listItemRef = this.suggestedAnswersToRefs.get(suggestedAnswer);
            renderedListItems.push(
                <li 
                    ref={listItemRef}
                    onClick={(event) => this.handleClick(suggestedAnswer)}>{suggestedAnswer}
                </li> 
            )
        }
        return (
            <ul id={directionName + "-matches"} className="matches">
                {renderedListItems}
            </ul>
        )
    }

    handleClick = (suggestedAnswer: string) => { 
        const listItemRef = this.suggestedAnswersToRefs.get(suggestedAnswer);
        if (listItemRef === undefined)
        {
            throw new Error("suggested answer doesn't have a matching ref")
        }
       
        const currentNode = listItemRef.current;
        if (currentNode != null && currentNode.textContent != null)
        {
            this.props.fillGridFromSelectedAnswer(currentNode.textContent);
        }
    }

    rebuildSuggestedAnswersToRefs = (suggestedAnswers: string[]) =>
    {
        this.suggestedAnswersToRefs = new Map();
        for (var suggestedAnswer of suggestedAnswers)
        {
            const newRef = React.createRef<HTMLLIElement>();
            this.suggestedAnswersToRefs.set(suggestedAnswer, newRef);
        }
    }
}

