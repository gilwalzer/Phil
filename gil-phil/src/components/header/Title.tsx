import React, { RefObject, createRef } from "react";

type TitleProps = 
{
    title: string;
    updateTitle: Function;
    suppressEnterKey: (event: React.KeyboardEvent) => void;
}

export class Title extends React.Component<TitleProps>
{
    private titleRef: RefObject<HTMLSpanElement>;
    
    constructor(props: TitleProps)
    {
        super(props);
        this.titleRef = createRef<HTMLSpanElement>();
    }

    render() 
    {
        const { title } = this.props;
        
        return (
            <span 
                id="puzzle-title" 
                ref={this.titleRef}
                className="editable" 
                contentEditable="true"
                onBlur={this.processBlur}
                spellCheck="false"
                suppressContentEditableWarning={true}
            >{title}
            </span> 
        )
    }

    processBlur = (event: React.FocusEvent) => {
        const currentNode = this.titleRef.current;
        if (currentNode != null)
        {
            this.props.updateTitle(currentNode.textContent);
        }
    }
}