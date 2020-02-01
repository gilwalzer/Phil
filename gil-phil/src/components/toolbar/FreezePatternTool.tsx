import React from "react";

export type FreezePatternToolHandlers = 
{
    handleClick: () => void;
}

export type FreezePatternToolProps = 
{
    freezePatternToolHandlers: FreezePatternToolHandlers;
    patternIsFrozen: boolean;
}

export class FreezePatternTool extends React.Component<FreezePatternToolProps>
{
    render() 
    {
        const { patternIsFrozen } = this.props; 
        const className = "feature" + (patternIsFrozen ? "-enabled" : "disabled");
        const dataTooltip = (patternIsFrozen ? "Unfreeze" : "Freeze") + " pattern";
        return (
            <button 
                id="toggle-freeze-layout"
                data-tooltip={dataTooltip}
                className={className}
                onClick={this.processClick}>
                <i className="fa fa-snowflake-o fa-fw" aria-hidden="true"></i>
            </button>
        )
    }

    processClick = (event: React.MouseEvent) =>
    {
        const { handleClick } = this.props.freezePatternToolHandlers;
        handleClick();
    }
}