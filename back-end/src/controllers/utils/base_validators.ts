import {check} from 'express-validator';
import { title } from 'process';

export const baseNameValidator =(attr:string) =>{
    return [
        check(attr)
        .trim()
        .not().isEmpty()
        .withMessage(attr+" can not be null")
        .escape()
        //Regex expression taken from https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
        .withMessage("Invalid "+attr),
    ]
}

export const baseAlphaNumeric = (attr:string) =>{
    const titleRegex = /^[a-zA-Z0-9_\- ]+$/;
    return[
        check(attr)
        .trim()
        .not().isEmpty()
        .withMessage(attr+" can not be null")
        .escape()
        .matches(titleRegex)
        .withMessage("Invalid "+attr)
    ]
}

export const baseEmail = (attr:string) =>{
    return[
        check(attr)
        .trim()
        .not().isEmpty()
        .withMessage(attr+" can not be null")
        .escape()
        .isEmail()
        .withMessage("Invalid "+attr)
    ]
}

export const basePhoneNo = (attr:string) =>{
    return[
        check(attr)
        .trim()
        .not().isEmpty()
        .withMessage(attr+" can not be null")
        .escape()
        .isMobilePhone("any")
        .withMessage("Invalid "+attr)
    ]
}
 



export const baseNormalText = (attr:string) =>{
    return [
        check(attr)
        .trim()
        .not()
        .isEmpty()
        .withMessage("Book title can not be null!!")
        .escape(),
    ]
}
export const status =(att:string)=>{
    return [
    
        check("price")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Price cannot be null")
        .escape().isInt({min:0,max:1})
        .withMessage("invalid price")
    ]
} 

export const baseIdValidator =(attr:string) =>{
    return [
        check(attr)
        .trim()
        .not()
        .isEmpty()
        .withMessage(attr+" can not be null")
        .escape()
        .isInt({min:1})
        .withMessage("Invalid "+attr)
    ]
}

export const baseAddress = (attr:string) =>{
    return [
        check(attr)
        .trim()
        .not()
        .isEmpty()
        .escape()
        .matches(/^(\d{1,}) [a-zA-Z0-9\s]+(\,)? [a-zA-Z]+(\,)? [A-Z]{2} [0-9]{5,6}$/)
        .withMessage("Invalid Address (Pattern: Addr number Street Name, City, State ZIP code Ex: 2024 E Beufort St, Laramie, WY 82072")
    ]
}


export const localPathDir = (attr:string) => {
    return [
        check(attr)
        .trim()
        .optional({nullable:true})
        .matches(/^[A-Za-z]:\\(?:[A-Za-z0-9]+\\)*[A-Za-z0-9]+\.[a-zA-Z]+$/)
        .withMessage('Invalid path directory. Must be in the format "C:\\path\\to\\directory"')
        .escape()
    ];
};



