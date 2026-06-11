import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return v !== v.toUpperCase(); 
            },
            message: props => `${props.value} must not be entirely uppercase!` 
        }
    }, 
    content: { type: String, required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'usermodel', required: true } 
}, { timestamps: true }); 

const notemodel = mongoose.model('notemodel', noteSchema)


export default notemodel