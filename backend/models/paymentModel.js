import mongoose from "mongoose";
const paymentSchema = mongoose.Schema({
    certificate_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    PaymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment Method', // This matches the model name as defined in PaymentMethod schema
        required: true,
    },
    
    PaymentType: {
        type: String,
        enum: ['Birth Certificate', 'Death Certificate'], // Define allowed types
        required: true
    },
    senderNumber:{
        type:String,
        required: true
    },
},{
    timestamp :true
})

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment