import React from "react";

export const Credits = () => (
    <div id="credits">
        <CreditRow>
            <Credit
                link="mailto:gil.a.walzer@gmail.com?Subject=gil-Phil"
                text="Contact me (Gil), who made this version"/>
            <span>, or&nbsp;</span> 
            <Credit
                link="https://github.com/gil-walzer/gil-Phil"
                text="check out my GitHub" />
        </CreditRow>
        <CreditRow>
            <Credit 
                link="mailto:me@keiranking.com?Subject=Phil"
                text="Contact the original creator" />
            <span>,&nbsp;</span> 
            <Credit
                link="http://www.keiranking.com/" 
                text="visit his website" />
            <span>, or&nbsp;</span> 
            <Credit
                link="https://github.com/keiranking/Phil" 
                text="take a look at his code" />
        </CreditRow>
    </div>
)

type CreditProps =
{
    link: string;
    text: string;
}

const Credit = function(props: CreditProps) {
    return (
        <a href={props.link} target="_top">{props.text}</a>
    )
}

type CreditRowProps = { children: JSX.Element[] }

const CreditRow = (props: CreditRowProps) => (
    <div className="credit-row">
        {props.children}
    </div>
)
