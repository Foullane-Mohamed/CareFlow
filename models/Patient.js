import mongoose from "mongoose"


const patientSchema = new mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },
    address: {type: String, required:true},
    telephone: {type:String, required:true},
    assurance: {type:String},
    
  },
  {timestamps:true}
)

export const Patient = mongoose.model("Patient",patientSchema)