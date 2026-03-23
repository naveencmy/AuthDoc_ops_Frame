import Joi from "joi"

export const exportSchema = Joi.object({

  batch_id: Joi.string().uuid().required(),

  export_type: Joi.string()
    .valid("excel")
    .required()

})