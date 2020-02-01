import React, { createRef, RefObject } from "react";

export type ImportDictionaryToolHandlers = 
{
    updateDictionaryFromUploadedFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type ImportDictionaryToolProps = 
{
    importDictionaryToolHandlers: ImportDictionaryToolHandlers;
}

export class ImportDictionaryTool extends React.Component<ImportDictionaryToolProps>
{
    
    private inputRef: RefObject<HTMLInputElement>;
    
    constructor(props: ImportDictionaryToolProps)
    {
        super(props);
        this.inputRef = createRef<HTMLInputElement>();
    }

    render() 
    {   
        const { updateDictionaryFromUploadedFile } = this.props.importDictionaryToolHandlers;
        return (
            <button 
                id="open-wordlist" 
                data-tooltip="Change dictionary..."
                onClick={this.processClick.bind(this)}>
                <i className="fa fa-book fa-fw" aria-hidden="true"></i>
                <input 
                    id="open-wordlist-input" 
                    ref={this.inputRef}
                    className="hidden"
                    type="file" 
                    accept=".txt"
                    onChange={updateDictionaryFromUploadedFile} />
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