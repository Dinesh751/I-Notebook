import React from "react";
import NoteContext from "./noteContext";
import { useState } from "react";



const NoteState =(props)=>{
    const host ="http://localhost:5000";
    const n1=[];
    const [notes,setNotes]=useState(n1)
    const [alert,setAlert]=useState(null);

    const showAlert=(message,type)=>{
        setAlert(
            {
                msg:message,
                type:type
            }
        )
    }

    setTimeout(()=>{
        setAlert(null)
    },2500)


    // get All notes

    const getNotes=async ()=>{
        const response=await fetch(`${host}/api/notes/getnotes`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "auth-token":localStorage.getItem("token")
            }
        })
        const json=await response.json();
        console.log(json)
       setNotes(json)
    }


    //Add notes

    const addNotes=async(note)=>{
        const response=await fetch(`${host}/api/notes/createnotes`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "auth-token":localStorage.getItem("token")
            },
            body:JSON.stringify({
                title:note.title,
                description:note.discription,
                tag:note.tag
            })
        })

        const note1=await response.json();

        const newNotes=notes.concat(note1);
        setNotes(newNotes)
        showAlert("Note added successfully","success")
    }



    // Delete Note

    const deleteNote=async(id)=>{
        const response=await fetch(`${host}/api/notes/deletenote/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "auth-token":localStorage.getItem("token")
            },
           
        })

        const newNotes=notes.filter((note)=>{
            return note._id!==id
        })

        setNotes(newNotes)
        showAlert("Note deleted successfully","success")

    }



    //Edit Note

    const editNote=async(id,title,description,tag)=>{

        const response=await fetch(`${host}/api/notes/updatenotes/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "auth-token":localStorage.getItem("token")
            },
            body:JSON.stringify({
                title,
                description,
                tag
            })
        })

        let newNotes=JSON.parse(JSON.stringify(notes))

        for(let i=0;i<newNotes.length;i++){
            const element=newNotes[i];
            if(element._id=== id ){
                newNotes[i].title=title;
                newNotes[i].description=description;
                newNotes[i].tag=tag;
                break;
            }
        }
        setNotes(newNotes);
        showAlert("Note edited successfully","success")
    }


   

return (
    <NoteContext.Provider value={{notes,addNotes,deleteNote,editNote, showAlert,alert}}>
      {props.children}
    </NoteContext.Provider>
)

}

export default NoteState;