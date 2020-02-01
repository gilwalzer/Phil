import React, { RefObject, createRef } from "react";

type AuthorProps = 
{
    author: string;
    updateAuthor: Function;
    suppressEnterKey: (event: React.KeyboardEvent) => void;
}

export class Author extends React.Component<AuthorProps>
{
    private authorRef: RefObject<HTMLSpanElement>;

    constructor(props: AuthorProps) 
    {
        super(props);
        this.authorRef = createRef<HTMLSpanElement>();
    }

    render()
    {
        const { author, suppressEnterKey } = this.props;

        return (
            <span 
                id="puzzle-author"
                ref={this.authorRef}
                className="editable"
                contentEditable="true"
                spellCheck="false"    
                suppressContentEditableWarning={true}
                onKeyDown={suppressEnterKey}
                onBlur={this.processBlur}
            >{author}
            </span> 
        )
    }

    processBlur = (event: React.FocusEvent) => 
    {
        const currentNode = this.authorRef.current;
        if (currentNode != null)
        {
            this.props.updateAuthor(currentNode.textContent);
        }
    }
}