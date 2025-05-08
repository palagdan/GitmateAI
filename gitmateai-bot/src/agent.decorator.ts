import { Service } from 'typedi';

export function Agent(): ClassDecorator {
    return (target: Function) => {

        Service()(target);
    };
}