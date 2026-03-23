import Joi from "joi"

export const batchSchema = Joi.object({

  batch_name: Joi.string().required(),

  document_type: Joi.string()
    .valid("birth", "marriage", "death")
    .required(),

  priority: Joi.string()
    .valid("low", "normal", "high")
    .default("normal")

})