import Joi from "joi"

export const schemaDefinition = Joi.object({
  document_type:Joi.string()
    .valid("birth","marriage","death")
    .required(),
  language:Joi.string()
    .length(2)
    .required(),
  schema_version:Joi.string()
    .required()

})