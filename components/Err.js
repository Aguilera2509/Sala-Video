//Handle ERRS at the moment put CODE or URL -- Components/input.js
export const ErrorLengthCode = () =>{
    return(
        <div className="alert alert-danger" role="alert">
            Error with code&apos;s length
        </div>
    )
}

export const ErrorRoom = () =>{
    return(
        <div className="alert alert-danger" role="alert">
            Room not Found
        </div>
    )
}

export const ErrorUrl = () =>{
    return(
        <div className="alert alert-danger" role="alert">
            Error with url, it is not a youtube&apos;s url
        </div>
    )
}