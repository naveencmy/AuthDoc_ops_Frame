
import Joi from "joi"

export const batchSchema = Joi.object({

  batch_name: Joi.string().required(),

  document_type: Joi.string()
    .valid("birth", "marriage", "death")
    .required(),

  schema_version: Joi.string().required(),

  priority: Joi.number()
    .valid(1, 2, 3)
    .default(2)

})