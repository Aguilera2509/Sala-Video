import { useEffect, useState } from "react"
import { ErrorLengthCode, ErrorUrl, ErrorRoom } from "./Err"
import { ref, set, onValue, remove } from "firebase/database"
import { db, userdb } from "./chatFirebase/ChatOptionAPI"
//Variable handle url, code and codeDelete
let data = {
  "Url" : "",
  "Code": "",
  "CodeDelete": ""
}
//Function where use only data.Url and setSala for rendering conditional for create room and DB
export function Inputcreate({ setSala }){

  const [url, setUrl] = useState(data)
  const [err, setErr] = useState(null)

  function writeUserData(urlValid, data){
    set(ref(db, `${data}/url`), {
      urlValid
    })
    set(ref(db, `user/urls/${data}`), {
      urlValid
    })
  }

  const handleChange = (e) =>{
    setUrl({
        ...url,
        [e.target.name]:e.target.value
    })
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    if (!url.Url.includes("https://www.youtube.com/watch?")) return setErr(true)
    
    let data = url.Url.substring(30,43)
    setSala(data)
    let urlValid = `https://www.youtube.com/watch?${data}`
    
    writeUserData(urlValid, data)
  }

  return(
    <>
      <div style={{marginBottom: ".4rem"}}>
           <button type="button" className="btn btn-warning btn-lg" data-bs-toggle="modal" data-bs-target="#modalCreate">
              Create
          </button>
      </div>

      <div className="modal fade" id="modalCreate" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Insert video&apos;s URL</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="urlInput" className="form-label">URL</label>
              <input type="url" className="form-control" id="urlInput" name="Url" placeholder="https://www.youtube.com/watch?v=dbevJM-2lcY" value={url.Url} onChange={handleChange}/>
              {err && <ErrorUrl/>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Create</button>
            </div>
          </form>
        </div>
          </div>
        </div>
      </div>
    </>
  )
}
//Function where use only data.Code and setSala for rendering conditional for join room
//Note: Variable err is length code and Variable errRoom is if the room reality exists
export function Inputjoin({ setSala }){

  const [code, setCode] = useState(data)
  const [err, setErr] = useState(null) //Length code
  const [errRoom, setErrRoom] = useState(null) //Room exists? 
  const [codedb, setCodedb] = useState([])

  const handleChange = (e) =>{
    setCode({
        ...code,
        [e.target.name]:e.target.value
    })
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    if (code.Code.length != 13) return setErr(true)

    if (codedb[0]){
      const data = Object.keys(codedb[0])

      const fil = data.find(el => el === code.Code)

      if(fil === undefined ) return setErrRoom(true)

      setSala(fil)
    }
  }

  useEffect(()=>{
    onValue(userdb, (snapshot) => {
      const allCode = snapshot.val()
      if(allCode === null) return setCodedb([]);
      setCodedb([...codedb, allCode])
    })
  },[])

  return(
      <>
      <div style={{marginBottom: ".4rem"}}>
          <button type="button" className="btn btn-warning btn-lg" data-bs-toggle="modal" data-bs-target="#modalJoin">
              Join
          </button>
      </div>

      <div className="modal fade" id="modalJoin" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Insert Code</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="codeInput" className="form-label">Code</label>
              <input type="text" className="form-control" name="Code" id="codeInput" placeholder="v=dbevJM-2lcY" value={code.Code} onChange={handleChange}/>
              {err && <ErrorLengthCode/>}
              {errRoom && <ErrorRoom/>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Join</button>
            </div>
          </form>
        </div>
          </div>
        </div>
      </div>
      </>
  )
}
//Function where use only data.CodeDelete
//If a room is bug or el host is an asshole, put code in this input and that room will remove immediately
export function InputDelete(){

  const [codeDelete, setCodeDelete] = useState(data)
  const [err, setErr] = useState(null) //Length Code
  const [errRoom, setErrRoom] = useState(null) //Room Exists?
  const [success, setSuccess] = useState(null) //Room removed
  const [codedb, setCodedb] = useState([])

  const handleChange = (e) =>{
    setCodeDelete({
        ...codeDelete,
        [e.target.name]:e.target.value
    })
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    if (codeDelete.CodeDelete.length != 13) return setErr(true)

    if (codedb[0]){

      const data = Object.keys(codedb[0])

      const fil = data.find(el => el === codeDelete.CodeDelete)

      if(fil === undefined ) return setErrRoom(true)

      const userdb = ref(db, `${fil}`)
      
      remove(userdb)
      setSuccess(true)
    }
  }

  useEffect(()=>{
    onValue(userdb, (snapshot) => {
      const allCode = snapshot.val()
      if(allCode === null) return setCodedb([]);
      setCodedb([...codedb, allCode])
    })
  },[])

  return(
      <>
      <div>
          <button type="button" className="btn btn-warning btn-lg" data-bs-toggle="modal" data-bs-target="#modalDelete">
              Delete
          </button>
      </div>

      <div className="modal fade" id="modalDelete" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Insert Code</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="codeDeleteInput" className="form-label">Code</label>
              <input type="text" className="form-control" name="CodeDelete" id="codeDeleteInput" placeholder="v=dbevJM-2lcY" value={codeDelete.CodeDelete} onChange={handleChange}/>
              {err && <ErrorLengthCode/>}
              {errRoom && <ErrorRoom/>}
              {success && 
                <div className="alert alert-success" role="alert">
                  Room Deleted 
                </div>
              }
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Delete</button>
            </div>
          </form>
        </div>
          </div>
        </div>
      </div>
      </>
  )
}