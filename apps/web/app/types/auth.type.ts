
export type User = {
    id : string,
    name : string,
    email : string

}
export type SignupRequest = {
    name : string,
    email : string,
    password :string
}

export type SigninRequest = {
    email : string,
    password :string
}

export type AuthResponse = {
    msg : string,
    user : User
}
