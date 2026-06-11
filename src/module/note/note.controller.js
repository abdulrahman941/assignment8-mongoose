import { Router } from 'express';
import  notemodel  from '../../database/model/note/note.model.js';
import {auth} from "../../Middleware/middleware.js"
import mongoose from 'mongoose';
import { aggregrationwithsearch, createnoteservices, deletealluser, deletenote, getnotebycontent, getnotebyId, getnotewithuserId, paginate_sort, replacenote, updateallnote, updatenoteservices} from './note.services.js';
const noteRouter = Router();

// 1. Create Note 
noteRouter.post('/:userId', async (req, res) => {
   try {
    const {userId}=req.params
     const { title, content } = req.body;
     const result=await createnoteservices(title, content,userId)
    res.json({ message: "Note created",result:result,userId:result.userId }); 
   } catch (error) {
     const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation1 error",error:error.message})
   }
});

// 2. Update Note 
noteRouter.patch('/:noteId', async (req, res) => {
    try {
        const {noteId}=req.params
        const{title,content,userId}=req.body
        const note=await updatenoteservices(noteId,userId,{title,content})
    if (note=="note not found") return res.status(404).json({ message: "Note not found" }); 
    if (note=="you are not the onwner") return res.status(403).json({ message: "You are not the owner" }); 

    res.status(200).json({ 
    message: "updated",
    note:{
    id:note._id,
    title:note.title,
    content:note.content,
    userId:note.userId,
    createdAt:note.createdAt,
    updatedAt:note.updatedAt,
     },
     }); 
    } catch (error) {
       const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation2 error",error:error.message})  
    }
});
// 3. Replace the entire note document (PUT)
noteRouter.put("/replace/:noteId",async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content,userId} = req.body;
        const replacenoted=await replacenote(noteId,userId,{title,content})
        if(replacenoted=="Note not found")return res.status(404).json({message:"note not found"})
        if(replacenoted=="You are not the owner")return res.status(403).json({message:"you are not the owner"})
        return res.status(200).json({message:"replace updated successfully",replacenoted});
    } catch (error) {
         const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation3 error",error:error.message})
    }
});

// 4. Update all notes title 
noteRouter.patch('/notes/all', async (req, res) => {
   try {
    const {userId,title}=req.body
    const result=await updateallnote(userId,title)
    if (result=="No note found") return res.status(404).json({ message: "No note found" });
    res.json({ message: "All notes updated" }); 
   } catch (error) {
     const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation4 error",error:error.message})
   }
});
// 5. Delete a single Note
noteRouter.delete("/:noteId",async (req, res) => {
    try {
        const { noteId } = req.params;
        const {userId} = req.body;

        const result=await deletenote(noteId,userId)
         if(result=="Note not found")return res.status(404).json({message:"note not found"})
        if(result=="You are not the owner")return res.status(403).json({message:"you are not the owner"})
        return res.status(200).json({ message: "Deleted", result });
    } catch (error) {
         const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation5 error",error:error.message})
    }
});

// 6. Paginated & Sorted List 
noteRouter.get('/paginate-sort', async (req, res) => {
    try {
        const {page, limit} = req.query; 
        const {userId}=req.body
        const note=await paginate_sort({userId},{page, limit})
    res.status(200).json({message:"paginated sort list successfully",note}); 
    } catch (error) {
         const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation6 error",error:error.message})
    }
});

// 7. Get a note by its id
noteRouter.get("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {userId} = req.body;
        const notes=await getnotebyId(id,userId)
        if(notes=="Note not found")return res.status(404).json({message:"note not found"})
        if(notes=="You are not the owner")return res.status(403).json({message:"you are not the owner"})
        

        return res.status(200).json({message:"get note by id successfully",notes});
    } catch (error) {
         const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation7 error",error:error.message})
    }
});

// 8. Get a note for logged-in user by its content
noteRouter.get("/note-by-content", async (req, res) => {
    try {
        const { content } = req.query;
        const {userId} = req.body;
        const notes=await getnotebycontent(userId,{content})
        if(notes=="Note not found")return res.status(404).json({message:"note not found"})
        return res.status(200).json({message:"get note by content successfully",notes});
    } catch (error) {
         const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation8 error",error:error.message})
    }
});

// 9. Retrieve all notes with user info (select title, userId, createdAt and user email)
noteRouter.get("/note-with-user", async (req, res) => {
    try {
       const {userId}=req.body
       const note=await getnotewithuserId(userId)
        return res.status(200).json({message:"get note by userId successfully",note});
    } catch (error) {
         const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation9 error",error:error.message})
    }
});
// 10. Aggregation with Search 
noteRouter.get('/aggregate', async (req, res) => {
    try {
        const {userId}=req.body
        const titleQuery = req.query.title || ""; 
        const result=await aggregrationwithsearch(titleQuery,userId)
    res.json({message:"get aggragration with search successfully",result}); 
    } catch (error) {
        const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation10 error",error:error.message})
    }
});

// 11. Delete all user notes 
noteRouter.delete('/', async (req, res) => {
    try {
        const {userId}=req.body
       const deleted=await deletealluser(userId)
    res.json({ message: "Deleted" ,deleted}); 
    } catch (error) {
         const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation11 error",error:error.message})
    }
});

export default noteRouter