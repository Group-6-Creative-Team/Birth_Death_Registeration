/// payment method,  institusion , phoneNumber 
import mongoose from "mongoose";

const paymentMethodSchema = mongoose.Schema({
    methodName:{
        type: String,
        required: true
    },
    receiverNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 15, 
        immutable: true 
      }
},{
    timestamps:true
})
const PaymentMethod = mongoose.model("Payment Method", paymentMethodSchema);
export default PaymentMethod