import React from "react";

export type GeneratePatternToolHandlers = 
{
    handleClick: () => void;
}

export type GeneratePatternToolProps = 
{
    generatePatternToolHandlers: GeneratePatternToolHandlers;
}

export class GeneratePatternTool extends React.Component<GeneratePatternToolProps>
{
    render() 
    {   
        return (
            <button 
                id="quick-layout" 
                data-tooltip="Generate pattern" 
                onClick={this.processClick}>
                <i className="fa fa-delicious fa-fw" aria-hidden="true"></i>
            </button>
        )
    }

    processClick = (event: React.MouseEvent) =>
    {
        const { handleClick } = this.props.generatePatternToolHandlers;
        handleClick();
    }
}