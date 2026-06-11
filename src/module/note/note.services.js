import mongoose from "mongoose";
import notemodel from "../../database/model/note/note.model.js";



// 1. Create Note 
export const createnoteservices=async(title, content,userId)=>{
    try {
    const newnote =await notemodel.create({ title, content, userId}); 
     return newnote
    } catch (error) {
         console.error("error in create note services:",error);
            throw error
    }
}

// 2. Update Note 
export const updatenoteservices=async(noteId,userId,{title,content})=>{
    try {
    const note = await notemodel.findById(noteId);
    if(!note){
        return "note not found"
    }
    if(note.userId.toString()!==userId.toString()){
        return "you are not the onwner"
    }
        note.title=title ?? note.title
        note.content=content ??note.content
        note.updatedAt=new Date()
        return note
        await note.save()



    } catch (error) {
        console.error("error in update note services:",error);
            throw error
    }
}
//3-Replace the entire note document (PUT)
export const replacenote=async(noteId,userId,{title,content})=>{
    try {
        const note = await notemodel.findById(noteId);
        if (!note) return "Note not found"

        if (note.userId.toString() !== userId.toString()) {
            return "You are not the owner"
        }

        // استبدال المستند بالكامل
        const updatedNote = await notemodel.findOneAndReplace(
            { _id: noteId },
            { title, content, userId},
            {returnDocument:"after"}
        );
        return updatedNote
    } catch (error) {
        console.error("error in replace note and retaire get all note services:",error);
            throw error
    }
}

export const updateallnote=async(userId,title)=>{
    try {
         const update = await notemodel.updateMany({userId},{$set:{title}}); 
         if (update.matchedCount === 0)return "No note found"
         return update
    } catch (error) {
        console.error("error in update all note services:",error);
            throw error
    }
}


export const deletenote=async(noteId,userId)=>{
    try {
         const note = await notemodel.findById(noteId);
         if (!note) return "Note not found"

        if (note.userId.toString() !== userId.toString()) {
            return "You are not the owner"
        }
            const noted=await notemodel.findByIdAndDelete(noteId);
          return noted
    } catch (error) {
        console.error("error in delete note services:",error);
            throw error
    }
}

export const paginate_sort=async({userId},{page,limit})=>{
    try {
        const notes = await notemodel.find( {userId})
        .sort({ createdAt: -1 }) 
        .skip((page - 1) * limit)
        .limit(Number(limit));
        return notes
        
    } catch (error) {
        console.error("error in paginate_sort note services:",error);
            throw error
    }
}

export const getnotebyId=async(id,userId)=>{
    try {
         const note = await notemodel.findById(id);
          if (!note) return "Note not found"

        if (note.userId.toString() !== userId.toString()) {
            return "You are not the owner"
        }
        return note
        return note
    } catch (error) {
        console.error("error in get note by id services:",error);
            throw error
    }
}

export const getnotebycontent=async(userId,{content})=>{
    try {
        const note = await notemodel.findOne({ userId, content: new RegExp(content, 'i') });
        if (!note) return "Note not found"
        return note
    } catch (error) {
         console.error("error in get note by content services:",error);
            throw error
    }
}

export const getnotewithuserId=async(userId)=>{
    try {
         const notes = await notemodel.find({ userId })
            .select('title userId createdAt')
            .populate('userId', 'email');
            return notes
    } catch (error) {
         console.error("error in get note by userId services:",error);
            throw error
    }
}

export const aggregrationwithsearch=async(titleQuery,userId)=>{
    try {
        const notes = await notemodel.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), title: { $regex: titleQuery, $options: 'i' } } }, 
        {
            $lookup: {
                from: 'usermodels',
                localField: 'userId',
                foreignField: '_id',
                as: 'usermodel'
            }
        },
        { $unwind: '$usermodel' },
        { $project: { title: 1, userId: 1, createdAt: 1, "user.name": 1, "user.email": 1 } } 
    ]);
    return notes
    } catch (error) {
        console.error("error in aggregration with search services:",error);
            throw error
    }
}

export const deletealluser=async(userId)=>{
    try {
         const deleted= await notemodel.deleteMany({ userId}); 
         return deleted
    } catch (error) {
        console.error("error in delete all user services:",error);
            throw error
    }
}