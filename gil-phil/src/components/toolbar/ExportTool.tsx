import React, { createRef, RefObject } from "react";

export type ExportToolHandlers = 
{
    handleExport: (exportAction: ExportAction) => void;
    toggleExportMenu: (shouldShow: boolean) => void
}

export type ExportToolProps = 
{
    exportToolHandlers: ExportToolHandlers;
    shouldShowExportMenu: boolean
}

export enum ExportAction
{
    JSON = "json",
    PUZ = "puz",
    PDF = "pdf",
    PDFNYT = "pdf-nyt"
}

type ExportToolState =
{
    defaultAction: ExportAction;
}

export class ExportTool extends React.Component<ExportToolProps, ExportToolState>
{
    
    private exportMenuRef: RefObject<ExportMenu>;
    
    constructor(props: ExportToolProps)
    {
        super(props);
        this.exportMenuRef = createRef<ExportMenu>();
//      this.downloadLink = props.downloadLink; // TODO implement
        this.state = { defaultAction: ExportAction.JSON };
    }

    render() 
    {
        const { handleExport } = this.props.exportToolHandlers;
        const { shouldShowExportMenu } = this.props;

        return (
            <button 
                id="export" 
                data-tooltip="Save puzzle" 
                onMouseOver={(e) => this.handleMouseEvent(e, true)}
                onClick={(event) => handleExport(this.state.defaultAction)}>
                <i className="fa fa-download fa-fw" aria-hidden="true"></i>
                <a id="download-puzzle-link" className="hidden">Download puzzle</a>
                <ExportMenu
                    defaultAction={this.state.defaultAction}
                    shouldShowMenu={shouldShowExportMenu }
                    setDefaultAction={this.setDefaultAction}
                    handleMouseLeave={(e) => this.handleMouseEvent(e, false)}
                    handleExportClick={this.props.exportToolHandlers.handleExport}
                />
            </button>      
        )
    }

    handleMouseEvent(event: React.MouseEvent, shouldShowMenu: boolean) {
        this.props.exportToolHandlers.toggleExportMenu(shouldShowMenu);
        event.stopPropagation();
    }

    setDefaultAction = (exportAction: ExportAction) => this.setState({ defaultAction: exportAction });
}

type ExportMenuProps = 
{
    handleExportClick: (action: ExportAction) => void;
    handleMouseLeave: (event: React.MouseEvent) => void;
    setDefaultAction: (action: ExportAction) => void;
    defaultAction: ExportAction;
    shouldShowMenu: boolean;
}

type ExportMenuState = 
{
    shouldShowMenu: boolean;
}

class ExportMenu extends React.Component<ExportMenuProps, ExportMenuState>
{
    private exportMenuRef: RefObject<HTMLDivElement>;
    
    constructor(props: ExportMenuProps)
    {
        super(props);
        this.exportMenuRef = createRef<HTMLDivElement>();
        this.state = { shouldShowMenu: this.props.shouldShowMenu }
    }

    render()
    {
        const { handleExportClick, setDefaultAction, defaultAction } = this.props;
        const shouldShowMenu = this.props.shouldShowMenu;
        const classList = [ "menu" ];
        if (!shouldShowMenu)
        {
            classList.push("hidden");
        }
        return (
            <div 
                ref={this.exportMenuRef}
                id="export-menu" 
                className={classList.join(" ")} 
                onMouseOut={this.props.handleMouseLeave}>
                <h4>Export as:</h4>
                <button 
                    id="export-JSON"
                    className={defaultAction === ExportAction.JSON ? "default": "alternative"} 
                    data-tooltip="gilPhil puzzle (.xw)" 
                    onClick={(event) => handleExportClick(ExportAction.JSON)}
                    onMouseUp={(event) => setDefaultAction(ExportAction.JSON)}>
                    <i className="fa fa-download fa-fw" aria-hidden="true"></i>
                </button>
                <button 
                    id="export-PUZ"
                    className={defaultAction === ExportAction.PUZ ? "default": "alternative"} 
                    data-tooltip="Across Lite puzzle (.puz)"
                    onClick={(event) => handleExportClick(ExportAction.PUZ)}
                    onMouseUp={(event) => setDefaultAction(ExportAction.PUZ)}>
                    <i className="fa fa-download fa-fw" aria-hidden="true"/>
                </button>
                <button 
                    id="export-PDF"
                    className={defaultAction === ExportAction.PDF ? "default": "alternative"} 
                    data-tooltip="Printable puzzle (.pdf)"
                    onClick={(event) => handleExportClick(ExportAction.PDF)}
                    onMouseUp={(event) => setDefaultAction(ExportAction.PDF)}>
                    <i className="fa fa-print fa-fw" aria-hidden="true"/>
                </button>
                <button 
                   id="export-PDFNYT"
                   className={defaultAction === ExportAction.PDFNYT ? "default": "alternative"} 
                   data-tooltip="NYT submission (.pdf)" 
                   onClick={(event) => handleExportClick(ExportAction.PDFNYT)}
                   onMouseUp={(event) => setDefaultAction(ExportAction.PDFNYT)}>               
                  <i className="fa fa-newspaper-o fa-fw" aria-hidden="true"/>
                </button>
            </div>
        )    
    }
}