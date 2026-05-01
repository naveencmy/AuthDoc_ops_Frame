import Joi from "joi"

export const createSchemaValidator = Joi.object({
  document_type: Joi.string().required(),
  language: Joi.string().required(),
  schema_version: Joi.string().required(),

  schema_json: Joi.array().items(
    Joi.object({
      field_name: Joi.string().required(),
      data_type: Joi.string().valid("string", "number", "date","Enum").required(),
      required: Joi.boolean().default(false),
      confidence_min: Joi.number().min(0).max(1).default(0.7)
    })
  ).min(1).required()
})