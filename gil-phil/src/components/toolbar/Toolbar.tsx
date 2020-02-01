import React from "react";
import { NewTool, NewToolHandlers } from "./NewTool";
import { OpenTool, OpenToolHandlers } from "./OpenTool";
import { ExportTool, ExportToolHandlers } from "./ExportTool";
import { GeneratePatternTool, GeneratePatternToolHandlers } from "./GeneratePatternTool";
import { FreezePatternTool, FreezePatternToolHandlers } from "./FreezePatternTool";
import { ClearFillTool, ClearFillToolHandlers } from "./ClearFillTool";
import { ToggleSymmetryTool, ToggleSymmetryToolHandlers } from "./ToggleSymmetryTool";
import { ImportDictionaryTool, ImportDictionaryToolHandlers } from "./ImportDictionaryTool";
import { AutoFillTool, AutoFillToolHandlers } from "./AutoFillTool";

export type ToolbarHandlers = 
{
    newToolHandlers: NewToolHandlers;
    openToolHandlers: OpenToolHandlers;
    exportToolHandlers: ExportToolHandlers;
    generatePatternToolHandlers: GeneratePatternToolHandlers;
    freezePatternToolHandlers: FreezePatternToolHandlers;
    clearFillToolHandlers: ClearFillToolHandlers;
    toggleSymmetryToolHandlers: ToggleSymmetryToolHandlers;
    importDictionaryToolHandlers: ImportDictionaryToolHandlers;
    autoFillToolHandlers: AutoFillToolHandlers;
}

export type ToolbarDisplays = 
{
    shouldShowExportMenu: boolean;
    patternIsFrozen: boolean;
    isSymmetricalGrid: boolean;
}

type ToolbarProps =
{
    toolbarHandlers: ToolbarHandlers;
    toolbarDisplays: ToolbarDisplays;
}

export class Toolbar extends React.Component<ToolbarProps>
{
    render() 
    {
        const 
        { 
            newToolHandlers,
            openToolHandlers,
            exportToolHandlers,
            generatePatternToolHandlers,
            freezePatternToolHandlers,
            clearFillToolHandlers,
            toggleSymmetryToolHandlers,
            importDictionaryToolHandlers,
            autoFillToolHandlers,
        } = this.props.toolbarHandlers;

        const { 
            shouldShowExportMenu, 
            patternIsFrozen,
            isSymmetricalGrid, } = this.props.toolbarDisplays;

        return (
            <div id="toolbar" onMouseOver={() => exportToolHandlers.toggleExportMenu(false)}>
                <NewTool newToolHandlers={newToolHandlers} />
                <OpenTool openToolHandlers={openToolHandlers} />
                <ExportTool
                    exportToolHandlers={exportToolHandlers}
                    shouldShowExportMenu={shouldShowExportMenu}  />
                <ToolbarDivider />
                <GeneratePatternTool generatePatternToolHandlers={generatePatternToolHandlers} />
                <FreezePatternTool 
                    freezePatternToolHandlers={freezePatternToolHandlers}
                    patternIsFrozen={patternIsFrozen} />
                <ClearFillTool clearFillToolHandlers={clearFillToolHandlers} />
                <ToggleSymmetryTool
                    toggleSymmetryToolHandlers={toggleSymmetryToolHandlers}
                    isSymmetricalGrid={isSymmetricalGrid} />
                <ToolbarDivider />
                <ImportDictionaryTool importDictionaryToolHandlers={importDictionaryToolHandlers} />
                <AutoFillTool autoFillToolHandlers={autoFillToolHandlers} />
            </div>
        )
    }    
}

const ToolbarDivider = () => <div className="divider" /> 
/*
    toggleSymmetryToolHandlers;
    openWordlistToolHandlers;
    autoFillToolHandlers;

                openToolHandlers,
            exportToolHandlers,
            generatePatternToolHandlers,
            freezePatternToolHandlers,
            toggleSymmetryToolHandlers,
            openWordlistToolHandlers,
            autoFillToolHandlers,

             //   <OpenTool openToolHandlers={openToolHandlers} />
             //   <ExportTool exportToolHandlers={exportToolHandlers} />
             //   <ToolbarDivider />
             //   <GeneratePatternTool generatePatternToolHandlers={generatePatternToolHandlers} />
             //   <FreezePatternTool freezePatternToolHandlers={freezePatternToolHandlers} />
              //  <ClearGridTool clearGridToolHandlers={generatePatternToolHandlers} />
            //    <ToggleSymmetryTool toggleSymmetryToolHandlers={toggleSymmetryToolHandlers} />
            //    <ToolbarDivider />
            //    <OpenWordlistTool openWordlistToolHandlers={openWordlistToolHandlers} />
              //  <AutoFillTool autoFillToolHandlers={autoFillToolHandlers} />           */