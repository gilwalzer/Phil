import React from "react";

export type AutoFillToolHandlers = 
{
    handleClick: () => void;
}

export type AutoFillToolProps = 
{
    autoFillToolHandlers: AutoFillToolHandlers;
}

export class AutoFillTool extends React.Component<AutoFillToolProps>
{
    render() 
    {   
        return (
            <button 
                id="auto-fill"
                data-tooltip="Auto-fill puzzle" 
                onClick={this.processClick}>
                <i className="fa fa-magic fa-fw" aria-hidden="true"></i>
            </button>
        )
    }

    processClick = (event: React.MouseEvent) =>
    {
        const { handleClick } = this.props.autoFillToolHandlers;
        handleClick();
    }
}