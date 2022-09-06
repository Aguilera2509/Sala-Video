import { ref, set } from "firebase/database"
import { db } from "./chatFirebase/ChatOptionAPI"
import { useState } from "react"
//Function used in pages/sala.js -- line 212 
export const Username = ({ dataUser, data, setData, setUsername, names, room }) =>{
    
    const [errname, setErrname] = useState(false) //Validate if name have 2 or less words and if name is same a full space. Example: Name:"      "
    const [err, setErr] = useState(false) //Validate if name exists in db

    function handleSubmit(e){
        e.preventDefault()
        if(/^ *$/.test(data.name)) return setErrname(true)
        if(data.name.length <= 2) return setErrname(true)
        if(names.length === 0) data.host = true //If you are the first in decide or put nickname, you will be the HOST 
        let valid
        if(names.length !== 0){
            valid = names.find(el => el.toLowerCase() == data.name.toLowerCase())
        }
        if(valid !== undefined) return setErr(true) //Name exists in db
        dataUser.name = data.name //Save in DataUser name -- pages/sala.js line 8
        dataUser.host = data.host //Save in DataUser HOST -- pages/sala.js line 8 because when submit a messages, mess -- pages/sala.js line 31 restore el value of mess to DataUser
        writeUserName(data)
        setUsername(true) //Disappear the button "Nickname" in pages/sala.js and this components
    }

    function handleChange(e){
        setData({
            ...data,
            [e.target.name] : e.target.value
        })
    }

    function writeUserName({ name, host }){
        set(ref(db, `${room}/members/${name}`), {
            name,
            host,
        })
    }

    return(
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Nickname</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="name" value={data.name} onChange={handleChange}/>
                        </div>
                        <div className="modal-footer">
                            <input type="submit" className="btn btn-primary" value="Save" data-bs-dismiss="modal"/>
                        </div>
                        {errname && <h5>Invalid Nickname</h5>}
                        {err && <h5>Dat Nickname already exists</h5>}
                    </form>
                </div>
                </div>
            </div>
        </div>
    )

}