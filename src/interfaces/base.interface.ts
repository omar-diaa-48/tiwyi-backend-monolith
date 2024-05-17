export interface IHasEmail {
    email: string
}

export interface IHasPassword {
    password: string
}

export interface IHasToken {
    token: string;
}

export interface IUser extends IHasEmail, IHasPassword { }