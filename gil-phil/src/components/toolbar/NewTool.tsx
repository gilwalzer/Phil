import React from "react";

export type NewToolHandlers = 
{
    handleClick: Function;
}

export type NewToolProps = 
{
    newToolHandlers: NewToolHandlers;
}

export class NewTool extends React.Component<NewToolProps>
{
    render() 
    {   
        return (
            <button id="new-grid" data-tooltip="New puzzle" onClick={this.processClick.bind(this)}>
                <i className="fa fa-plus fa-fw" aria-hidden="true"></i>
            </button>
        )
    }

    processClick(event: React.MouseEvent)
    {
        const { handleClick } = this.props.newToolHandlers;
        
        handleClick();
    }
}