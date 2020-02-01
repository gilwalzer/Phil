import React from "react";

export type ToggleSymmetryToolHandlers = 
{
    handleClick: () => void;
}

export type ToggleSymmetryToolProps = 
{
    toggleSymmetryToolHandlers: ToggleSymmetryToolHandlers;
    isSymmetricalGrid: boolean;
}

export class ToggleSymmetryTool extends React.Component<ToggleSymmetryToolProps>
{
    render() 
    {
        const { isSymmetricalGrid } = this.props;
        const className = "feature" + (isSymmetricalGrid ? "-enabled" : "disabled");
        const dataTooltip = "Turn " + (isSymmetricalGrid ? "off" : "on") + " symmetry";

        return (
            <button 
                id="toggle-symmetry" 
                data-tooltip={dataTooltip}
                className={className}
                onClick={this.processClick}>
            <i className="fa fa-balance-scale fa-fw" aria-hidden="true"></i>
            </button>
        )
    }

    processClick = (event: React.MouseEvent) =>
    {
        const { handleClick } = this.props.toggleSymmetryToolHandlers;
        handleClick();
    }
}