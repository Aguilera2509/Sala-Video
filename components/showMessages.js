export const Messages = ({ data }) =>{

    let { message, name, host } = data

    return(
        <li className="list-group-item list-group-item-info">{host ? "[HOST]" : ""}[{name}]: {message}</li>
    )

}