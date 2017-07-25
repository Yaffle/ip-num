'use strict';
import {leftPadWithZeroBit} from "./BinaryUtils";

export let expandIPv6Address = (ipv6String:string):string => {
    let expandWithZero = (hexadecimalArray: string[]): string => {
        let paddedArray = hexadecimalArray.map((hexadecimal) => {
            if (hexadecimal === "") {
                return hexadecimal;
            }
            return leftPadWithZeroBit(hexadecimal,4);
        });

        return paddedArray.join(":")
    };

    let expandDoubleColon = (gapCount: number): string => {
        let pads = [];
        for (let count=0; count<gapCount; count++) {
            pads.push("0000");
        }
        return pads.join(":");
    };

    if (ipv6String.includes("::")) {
        let split = ipv6String.split("::");
        let leftPortion = split[0];
        let rightPortion = split[1];

        let leftPortionSplit = leftPortion.split(":").filter(hexadecimal => {return hexadecimal !== ""});
        let rightPortionSplit = rightPortion.split(":").filter(hexadecimal => {return hexadecimal !== ""});
        let doublePortion = expandDoubleColon(8 - (leftPortionSplit.length + rightPortionSplit.length));


        let leftString = expandWithZero(leftPortionSplit);
        if (leftString !== "") {
            leftString += ":";
        }


        let rightString = expandWithZero(rightPortionSplit);
        if (rightString !== "") {
            rightString = ":"+rightString;
        }

        return `${leftString}${doublePortion}${rightString}`;

    } else {
        return expandWithZero(ipv6String.split(":"));
    }
};


export let collapseIPv6Address = (ipv6String:string):string => {
    let hexadecimals: string[] = ipv6String.split(":");
    let hexadecimalsWithoutLeadingZeros = hexadecimals.map((hexidecimal) => {
       let withoutLeadingZero = hexidecimal.replace(/^0+/, '');
       if (withoutLeadingZero !== '') {
           return withoutLeadingZero;
       } else {
           return "0";
       }

    });
    let contracted = hexadecimalsWithoutLeadingZeros.join(":").replace(/(^0)?(:0){2,}/, ':');
    if (contracted.slice(-1) === ":") {
        return `${contracted}:`;
    }
    return contracted;
};