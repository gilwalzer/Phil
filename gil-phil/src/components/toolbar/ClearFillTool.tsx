import React from "react";

export type ClearFillToolHandlers = 
{
    handleClick: () => void;
}

export type ClearFillToolProps = 
{
    clearFillToolHandlers: ClearFillToolHandlers;
}

export class ClearFillTool extends React.Component<ClearFillToolProps>
{
    render() 
    {
        return (
            <button 
                id="clear-fill"
                data-tooltip="Clear white squares"        
                onClick={this.processClick}>
                <i className="fa fa-eraser fa-fw" aria-hidden="true"></i>
            </button>
        )
    }

    processClick = (event: React.MouseEvent) =>
    {
        const { handleClick } = this.props.clearFillToolHandlers;
        handleClick();
    }
}