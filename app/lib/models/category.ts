import { model, models, Schema } from "mongoose";

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bloqueado: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true,
})

const Category = models.Category || model("Category", CategorySchema);
export default Category;