import React, { createRef, RefObject } from "react";

export type OpenToolHandlers = 
{
    updateGridFromUploadedFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type OpenToolProps = 
{
    openToolHandlers: OpenToolHandlers;
}

export class OpenTool extends React.Component<OpenToolProps>
{
    
    private inputRef: RefObject<HTMLInputElement>;
    
    constructor(props: OpenToolProps)
    {
        super(props);
        this.inputRef = createRef<HTMLInputElement>();
    }

    render() 
    {   
        const { updateGridFromUploadedFile } = this.props.openToolHandlers;
        return (
            <button 
                id="open-JSON" 
                data-tooltip="Open puzzle..."  
                onClick={this.processClick.bind(this)}>
                <i className="fa fa-folder-open-o fa-fw" aria-hidden="true"></i>
                <input 
                    id="open-puzzle-input"
                    ref={this.inputRef}
                    className="hidden" 
                    type="file" 
                    accept=".json,.txt,.xw,.puz"
                    onChange={updateGridFromUploadedFile} />
            </button>
        )
    }

    processClick(event: React.MouseEvent)
    {
        const currentNode = this.inputRef.current;
        if (currentNode != null) 
        {
            currentNode.click();
        }
    }
}